var size = [
  [ 0.66, 0.35],
  [ 0.50, 0.67],
  [ 0.48, 0.45],
  [ 0.48, 0.69],
  [ 0.23, 0.32]
];

var aspect = [];
var Glyph;

$(document).ready(function () {
  Glyph = document.getElementsByClassName('glyph');

  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    createPixel(100).then(animation);
  } else {
    createPixel(200).then(animation);
  }
})

function createPixel(s) {
  return new Promise(function (resolve) {
    var imgPromises = [];

    for (var i = 0; i < Glyph.length; i++) {
      imgPromises.push(loadImage(`./assets/img/${Glyph[i].id.replace("img_", "")}.png`));
    }

    Promise.all(imgPromises)
      .then(function (images) {
        var t = [];
        var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum libero sed ante molestie, et tincidunt libero ultrices. Phasellus sed placerat nunc, a condimentum nunc. Proin lobortis tincidunt accumsan. Vivamus vitae enim neque. Curabitur ante felis, sodales at enim id, commodo fermentum sapien. Donec faucibus risus vel ante ultricies commodo. Curabitur commodo quam quis enim porta auctor. Phasellus imperdiet imperdiet condimentum. Aliquam at magna orci. Quisque eget purus vel augue iaculis blandit at sed ex. In ultricies tincidunt lorem. Quisque vel massa placerat, maximus nulla dapibus, ullamcorper mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean a sollicitudin velit, non cursus lectus. Nulla vehicula cursus justo";
        var Count;

        for (var i = 0; i < Glyph.length; i++) {
          var image = images[i];
          aspect[i] = image.height / image.width;

          var [w, h] = getGlyphSize(s, i);
          var ctx = createCanvas(w, h);
          ctx.drawImage(image, 0, 0, w, h);

          var imageData = ctx.getImageData(0, 0, w, h);
          var data = imageData.data;
          t[i] = "";
          Count = 0;

          for (let y = 0; y < h - 1; y++) {
            let line = "";
            for (let x = 0; x < w; x++) {
              var index = (x + y * w) * 4;
              var alpha = data[index + 3];
              if (alpha != 0 && lorem[Count] != " ") {
                line += lorem[Count];
                Count++;
                if (Count >= lorem.length) {
                  Count = 0;
                }
              } else if (alpha != 0 && lorem[Count] == " ") {
                line += "凹";
                Count++;
                if (Count >= lorem.length) {
                  Count = 0;
                }
              } else {
                line += "凹";
              }
            }
            t[i] += line + "凸";
          }
          
          $(Glyph[i]).html(t[i]);
          $(Glyph[i]).fadeOut(0);
        }
        resolve();
      });
  });
}

function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error('Failed to load image: ' + src));
    };
    img.src = src;
  });
}

const createCanvas  = function(w,h) {
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  return ctx;
}

function animation(){ 
  var fps = 0;
  var frameCount = 0;
  var startTime, endTime;
  startTime = new Date().getTime();

  var string = [];
  var tex = [];
  var c = [];
  var fin = [];
  var sp = 50;
  var reg = new RegExp(`.{1,${sp}}`, 'g'); 

  for(let i = 0; i < Glyph.length; i++){
    string[i] = $(Glyph[i]).html().match(reg);
    $(Glyph[i]).html("");
    $(Glyph[i]).fadeIn(0);
    
    tex[i] = "";
    c[i] = 0;
    fin[i] = false;
  }

  function animationLoop(){
    $(Glyph).each(function(i){
      if(string[i].length <= [c[i]]){
        fin[i] = true;
        return true;
      }
      var addTex = string[i][c[i]];
      addTex = addTex.replace(/凹/g,"&nbsp;").replace(/凸/g,"<br>");
      tex[i] += addTex;
      c[i] ++;
      $(Glyph[i]).html(tex[i]);
    }); 
    
    frameCount ++;
    endTime = new Date().getTime();
    if(endTime - startTime >= 1000){
        fps = frameCount;
        frameCount = 0;
        startTime = new Date().getTime();
        let animationFPS = document.getElementById("fps");
        animationFPS.innerHTML = "fps : " + fps;
    }

    if(!fin.every(i => i == true)){
      requestAnimationFrame(animationLoop);
    }else{
      let animationFPS = document.getElementById("fps");
      animationFPS.innerHTML = "all finish";
    }
    
  }
  animationLoop();
}

$(window).resize(function(){
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    ReSize(100);
  } else {
    ReSize(200);
  }
});

function ReSize(s){
  $(Glyph).each(function(i){
    getGlyphSize(s, i);
  });
}

const getGlyphSize = function(s, i){
  var titleWidth = $('#container_title').width();
  var w = Math.round(size[i][0] * s);
  var h = Math.round(w * aspect[i]);
  var {fontW, fontH} = getFontSize();
  var ad = Math.pow((1 - (1 / s)), 2);

  var scaleW = (size[i][0] * titleWidth / (fontW * w)) * 100 * ad;
  var scaleH = (size[i][1] * titleWidth / (fontH * h)) * 100 * ad;

  $(Glyph[i]).css({ "transform": `scale(${scaleW}%,${scaleH}%)` });

  return [w, h];
}

const getFontSize = function(){
  var px = $('#title_frame').css('font-size');
  var height = Number(px.replace("px", ""));

  var span = document.createElement('span');

  span.style.position = 'absolute';
  span.style.top = '-1000px';
  span.style.left = '-1000px';
  span.style.whiteSpace = 'nowrap';

  span.innerHTML = 'a';

  span.style.fontSize = px;
  span.style.fontFamily =  "'IBM Plex Mono', monospace";

  document.body.appendChild(span);

  var width = span.clientWidth;

  span.parentElement.removeChild(span);

  return {fontW: width, fontH: height};
}