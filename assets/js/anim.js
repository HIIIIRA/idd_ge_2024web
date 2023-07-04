var Glyph;
var aspect = [];
var pixelSize = 100;
let showFps = false;

$(document).ready(function () {
  Glyph = document.getElementsByClassName("glyph");
  SetUp().then(animation);
});

function SetUp() {
  var codeAll = loadText("./assets/text/code.txt");
  var code = codeAll.match(
    RegExp(`.{1,${Math.ceil(codeAll.length / 5)}}`, "g")
  );

  return new Promise(function (resolve) {
    var imgPromises = [];

    $(Glyph).each(function (i) {
      imgPromises.push(
        loadImage(`./assets/img/${this.id.replace("img_", "")}.png`)
      );
    });

    Promise.all(imgPromises).then(function (images) {
      createPixelData(images, code);
      resolve();
    });
  });
}

const loadText = function (src) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", src, false);
  xhr.send();

  if (xhr.status == 200) {
    return xhr.responseText;
  } else {
    throw new Error("Failed to load text file: " + src);
  }
};

const loadImage = function (src) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error("Failed to load image: " + src));
    };
    img.src = src;
  });
};

const createCanvas = function (w, h) {
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext("2d");
  return ctx;
};

const createPixelData = function (images, code) {
  $(Glyph).each(function (i) {
    var image = images[i];
    aspect[i] = image.height / image.width;
    var [w, h] = getGlyphSize(pixelSize, i);
    var ctx = createCanvas(w, h);
    ctx.drawImage(image, 0, 0, w, h);

    var imageData = ctx.getImageData(0, 0, w, h).data;
    var splitCode = code[i];
    var t = "";
    var Count = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        var index = (x + y * w) * 4;
        var alpha = imageData[index + 3];
        if (alpha != 0) {
          if (splitCode[Count] === " ") {
            t += "凹";
          } else {
            t += splitCode[Count];
          }
          Count++;
        } else {
          t += "凹";
        }
      }
      t += "凸";
    }

    $(this).html(t);
    $(this).fadeIn(0);
  });
};

function animation() {
  var fps = 0;
  var frameCount = 0;
  var startTime, endTime;
  startTime = new Date().getTime();

  var spritText = [];
  var spritText2 = [];
  var htmlText = new Array(Glyph.length).fill("");
  var originText = new Array(Glyph.length).fill("");
  var Count = new Array(Glyph.length).fill(0);
  var fin = new Array(Glyph.length).fill(false);
  var [appSp, disSp] = [1, 15];
  var animationState = "appear";
  var startDelay = 100;
  var stopTime = new Array(Glyph.length).fill(0);
  var shuffleTime = new Array(Glyph.length).fill(0);
  var [stopTimeLength, shuffleTimeLength] = [1000, 200];
  var intervalStartTime = 0;
  var intervalLength = 10000;
  var effInterval = new Array(Glyph.length).fill(false);

  $(Glyph).each(function (i) {
    originText[i] = $(this).html();

    var sp = appSp * appSpeed(Glyph[i].id.replace("img_", ""));
    spritText[i] = originText[i].match(RegExp(`.{1,${sp}}`, "g"));

    $(this).html("");
    $(this).fadeIn(0);
  });

  function animationLoop() {
    switch (animationState) {
      case "appear":
        appear();
        break;
      case "disappear":
        disappear();
        break;
      case "interval":
        interval();
        break;
    }
    if (showFps) {
      fpsCounter();
    }
    requestAnimationFrame(animationLoop);
  }

  function appear() {
    $(Glyph).each(function (i) {
      if (i === 0) {
      } else if (Count[i - 1] < startDelay) {
        Count[i] = 0;
        return true;
      }

      if (Count[i] == 1) {
        $(this).addClass("cursor");
      }

      if (spritText.every((j) => j.length > Count[i] + shuffleTimeLength)) {
        var [eff1, eff2] = randomEffects(i);
      }
      if (eff1) {
        return true;
      }

      if (spritText[i].length <= Count[i]) {
        if ($(this).hasClass("cursor")) {
          $(this).removeClass("cursor");
          fin[i] = true;
        }
        return true;
      }

      var addText = spritText[i][Count[i]];
      htmlText[i] += addText;

      if (!eff2) {
        setHTMLText(i);
      }

      Count[i]++;
    });

    if (fin.every((j) => j === true)) {
      $(Glyph).each(function (i) {
        $("#back_" + this.id.replace("img_", "")).removeClass("hide");
        $(this).addClass("hide");

        htmlText[i] = originText[i]
          .replace(/&nbsp;/g, "凹")
          .replace(/<br>/g, "凸");
        spritText[i] = htmlText[i].match(RegExp(`.{1,${disSp}}`, "g"));
        spritText2[i] = htmlText[i].split("");
        Count[i] = 0;
        shuffleTime[i] = 0;
      });
      intervalStartTime = new Date().getTime();
      animationState = "interval";
    }
  }

  const setHTMLText = function (i) {
    var modifiedText = removeSpace(htmlText[i]);
    $(Glyph[i]).html(
      modifiedText.replace(/凹/g, "&nbsp;").replace(/凸/g, "<br>")
    );
  };

  const removeSpace = function (str) {
    var pattern = /(.)(\1)+$/;
    if (str.slice(-1) === "凹" && str.charAt(str.length - 2) != "凹") {
      str = str.slice(0, -1);
    }
    str = str.replace(pattern, "");
    if (str.slice(-1) === "凸") {
      str = str.slice(0, -1);
    }

    str = str.replace(pattern, "");
    return str;
  };

  const randomEffects = function (i) {
    var random = Math.random();
    var t = new Date().getTime();
    var playStop = stopTime[i] != 0;
    var playShuffle = shuffleTime[i] != 0;

    if (random < 0.01 && !playStop && !playShuffle) {
      if (i === 0) {
        stopTime[i] = new Date().getTime();
      } else if (fin[i - 1] === false) {
        stopTime[i] = new Date().getTime();
      }
    }

    if (stopTime[i] + stopTimeLength < t) {
      stopTime[i] = 0;
    }

    if (random > 0.998 && !playShuffle && !playStop) {
      shuffleTime[i] = new Date().getTime();
    }

    if (shuffleTime[i] + shuffleTimeLength > t) {
      var temporary = htmlText[i];
      htmlText[i] = replaceRandomChar(htmlText[i]);
      setHTMLText(i);
      htmlText[i] = temporary;
    } else {
      shuffleTime[i] = 0;
      if (fin[i] === true) {
        setHTMLText(i);
      }
    }

    return [playStop, playShuffle];
  };

  const replaceRandomChar = function (text) {
    var characters = text.split("");
    var character = "█▓▒░&$#@---";

    var replacedChar = characters.map(function (char) {
      if (char === "凸" || char === "凹") {
        return char;
      } else {
        var randomChar = Math.floor(Math.random() * (character.length - 1)) + 1;
        return character[randomChar];
      }
    });

    return replacedChar.join("");
  };

  function interval() {
    var t = new Date().getTime();
    $(Glyph).each(function (i) {
      if (intervalStartTime + intervalLength + 1100 <= t) {
        if (animationState === "interval") {
          animationState = "disappear";
        }
      } else if (
        intervalStartTime + intervalLength + 100 <= t &&
        $(this).hasClass("hide")
      ) {
        setHTMLText(i);
        $("#back_" + this.id.replace("img_", "")).addClass("hide");
        $(this).removeClass("hide");
      } else if (
        intervalStartTime + intervalLength <= t &&
        !$(this).hasClass("fade")
      ) {
        $("#back_" + this.id.replace("img_", "")).addClass("fade");
        $(this).addClass("fade");
      }

      if (
        intervalStartTime + intervalLength - 1000 > t &&
        intervalStartTime + 2000 < t
      ) {
        var [eff1, eff2] = randomEffects(i);
        if (eff2) {
          $("#back_" + this.id.replace("img_", ""))
            .removeClass("fade")
            .addClass("hide");
          $(this).removeClass("fade").removeClass("hide");
          if (!effInterval[i]) {
            effInterval[i] = true;
            setTimeout(() => {
              $("#back_" + this.id.replace("img_", "")).removeClass("hide");
              $(this).addClass("hide");
              effInterval[i] = false;
            }, shuffleTimeLength);
          }
        }
      }
    });
  }

  function disappear() {
    $(Glyph).each(function (i) {
      if (spritText[i].length <= Count[i]) {
        fin[i] = false;
        return true;
      }

      var CountChar = Count[i] * disSp;
      for (let j = 0; j < 50; j++) {
        var random = Math.floor(
          Math.random() * ((spritText2[i].length - CountChar) / 3)
        );
        var newTextRandom = spritText2[i][CountChar + random].replace(
          RegExp("[^凸]", "g"),
          "凹"
        );
        htmlText[i] =
          htmlText[i].substring(0, CountChar + random) +
          newTextRandom +
          htmlText[i].substring(CountChar + random + 1);
      }

      var newText = spritText[i][Count[i]].replace(RegExp("[^凸]", "g"), "凹");
      htmlText[i] =
        htmlText[i].substring(0, Count[i] * disSp) +
        newText +
        htmlText[i].substring(Count[i] * disSp + disSp);
      $(this).html(htmlText[i].replace(/凹/g, "&nbsp;").replace(/凸/g, "<br>"));

      Count[i]++;
    });

    if (fin.every((j) => j === false)) {
      $(Glyph).each(function (i) {
        var sp = appSp * appSpeed(Glyph[i].id.replace("img_", ""));
        spritText[i] = originText[i].match(RegExp(`.{1,${sp}}`, "g"));
        Count[i] = 0;
        htmlText[i] = "";
      });
      animationState = "appear";
    }
  }

  function fpsCounter() {
    frameCount++;
    endTime = new Date().getTime();
    if (endTime - startTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      startTime = new Date().getTime();
      let animationFPS = document.getElementById("fps");
      animationFPS.innerHTML = "fps : " + fps;
    }
  }

  $(this)
    .delay(2000)
    .queue(function () {
      animationLoop();
    });
}

$(window).resize(function () {
  ReSize();
});

function ReSize() {
  $(Glyph).each(function (i) {
    getGlyphSize(pixelSize, i);
  });
}

const getGlyphSize = function (s, i) {
  var titleWidth = $("#container_title").width();
  var [sizeW, sizeH] = size(Glyph[i].id.replace("img_", ""));
  var [fontW, fontH] = getFontSize();
  var w = Math.round(sizeW * s);
  var h = Math.round((w * aspect[i] * fontW) / fontH);

  var scaleW = ((sizeW * titleWidth) / (fontW * w)) * 100;
  var scaleH = ((sizeH * titleWidth) / (fontH * h)) * 100;

  $(Glyph[i]).css({ transform: `scale(${scaleW}%,${scaleH}%)` });

  return [w, h];
};

const getFontSize = function () {
  var px = $("#title_frame").css("font-size");
  var height = Number(px.replace("px", ""));

  var span = document.createElement("span");

  span.style.position = "absolute";
  span.style.top = "-1000px";
  span.style.left = "-1000px";
  span.style.whiteSpace = "nowrap";

  span.innerHTML = "a";

  span.style.fontSize = px;
  span.style.fontFamily = "'IBM Plex Mono', monospace";

  document.body.appendChild(span);

  var width = span.clientWidth;

  span.parentElement.removeChild(span);

  return [width, height];
};

const size = function (id) {
  var w, h;
  switch (id) {
    case "F":
      [w, h] = [0.66, 0.36];
      break;
    case "r":
      [w, h] = [0.5, 0.67];
      break;
    case "o":
      [w, h] = [0.46, 0.45];
      break;
    case "m":
      [w, h] = [0.48, 0.69];
      break;
    case "T":
      [w, h] = [0.23, 0.32];
      break;
    default:
      [w, h] = [0, 0];
      break;
  }

  return [w, h];
};

const appSpeed = function (id) {
  var sp;
  switch (id) {
    case "F":
      sp = 2;
      break;
    case "r":
      sp = 3;
      break;
    case "o":
      sp = 3;
      break;
    case "m":
      sp = 5;
      break;
    case "T":
      sp = 1;
      break;
  }

  return sp;
};
