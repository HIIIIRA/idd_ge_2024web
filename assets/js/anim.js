var Glyph;
var aspect = [];
var pixelSize = 100;

$(document).ready(function () {
  Glyph = document.getElementsByClassName("glyph");
  SetUp().then(animation);
});

function SetUp() {
  var codeAll = loadText("./assets/text/code.txt");
  var code = codeAll.match(RegExp(`.{1,${Math.ceil(codeAll.length / 5)}}`, "g"));

  return new Promise(function (resolve) {
    var imgPromises = [];

    $(Glyph).each(function (i) {
      imgPromises.push(
        loadImage(`./assets/img/${Glyph[i].id.replace("img_", "")}.png`)
      );
    })

    Promise.all(imgPromises).then(function (images) {
      createPixelData(images, code);
      resolve();
    });
  });
}

const loadText = function(src) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', src, false);
  xhr.send();

  if (xhr.status === 200) {
    return xhr.responseText;
  } else {
    throw new Error('Failed to load text file: ' + src);
  }
}

const loadImage = function(src) {
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
}

const createCanvas = function (w, h) {
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext("2d");
  return ctx;
};

const createPixelData = function(images,code){
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
          if(splitCode[Count] == " "){
            t += "凹"; 
          }else{
            t += splitCode[Count]; 
          }
          Count++;
        }else {
          t += "凹";
        }
      }
      t += "凸";
    }

    $(Glyph[i]).html(t);
    $(Glyph[i]).fadeIn(0);
  });
}

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
  var [appSp, disSp] = [3, 15];
  var animationState = "appear";
  var r_length = $(Glyph[1]).html().length;
  var startDelay = 100;

  $(Glyph).each(function (i) {
    originText[i] = $(Glyph[i]).html();
   
    var sp2 = Math.floor(appSp * originText[i].length / r_length + 1);
    spritText[i] = originText[i].match(RegExp(`.{1,${sp2}}`, "g"));

    $(Glyph[i]).html("");
    $(Glyph[i]).fadeIn(0);
  })
  
  function animationLoop(){
    switch(animationState){
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
    
    fpsCounter();
    requestAnimationFrame(animationLoop);
  }

  function appear() {
    $(Glyph).each(function (i) {
      if (i == 0) {
      } else if (Count[i - 1] < startDelay) {
        Count[i] = 0;
        return true;
      }

      if(Count[i] > 0){
        $(this).addClass("cursor");
      }

      if (spritText[i].length <= [Count[i]]) {
        $(this).removeClass("cursor");
        setHTMLText(i);
        fin[i] = true;
        return true;
      }


      var addText = spritText[i][Count[i]];
      htmlText[i] += addText; 

      setHTMLText(i);

      Count[i]++;
    });

    if (fin.every((i) => i == true)) {
      $(Glyph).each(function (i) {
        $("#back_" + Glyph[i].id.replace("img_", "")).removeClass("hide",1000,"ease");
        $(Glyph[i]).addClass("hide");

        htmlText[i] = originText[i].replace(/&nbsp;/g, "凹").replace(/<br>/g, "凸");
        spritText[i] = htmlText[i].match(RegExp(`.{1,${disSp}}`, "g"));
        spritText2[i] = htmlText[i].split("");
        Count[i] = 0;
      })
      animationState = "interval";
    }
  }

  const setHTMLText = function(i){
    var modifiedText = removeSpace(htmlText[i]);
    $(Glyph[i]).html(modifiedText.replace(/凹/g, "&nbsp;").replace(/凸/g, "<br>"));
  }

  const removeSpace = function(str) {
    var pattern = /(.)(\1)+$/;
    if(str.slice(-1) == "凹" && str.charAt(str.length - 2) != "凹"){
      str = str.slice(0, -1);
    }
    str = str.replace(pattern, "");
    if(str.slice(-1) == "凸"){
      str = str.slice(0, -1);
    }
    
    str = str.replace(pattern, "");
    return str;
  }

  function interval(){
    setTimeout(() => { 
      $(Glyph).each(function (i) {
        $("#back_" + Glyph[i].id.replace("img_", "")).addClass("hide");
        $(Glyph[i]).removeClass("hide");
      });
      setTimeout(() => { 
        if(animationState == "interval"){
          animationState = "disappear";
        }
      },1000)
    }, 30000)  
  }

  function disappear() {
    $(Glyph).each(function (i) {
      if (spritText[i].length <= Count[i]) {
        fin[i] = false;
        return true;
      }

      var newText = spritText[i][Count[i]].replace(RegExp("[^凸]", "g"), "凹");
      htmlText[i] = htmlText[i].substring(0, Count[i] * disSp) + newText + htmlText[i].substring((Count[i] * disSp) + disSp);
      $(Glyph[i]).html(htmlText[i].replace(/凹/g, "&nbsp;").replace(/凸/g, "<br>"));

      Count[i]++;
    });

    if (fin.every((i) => i == false)) {
      $(Glyph).each(function (i) {
        var sp2 = Math.floor(appSp * originText[i].length / r_length + 1);
        spritText[i] = originText[i].match(RegExp(`.{1,${sp2}}`, "g"));
        Count[i] = 0;
        htmlText[i] = "";
      })
      animationState = "appear";
    }
  }

  function fpsCounter(){
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
    .delay(4000)
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
}