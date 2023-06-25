var aspect = [];
var Glyph;
var pixelSize_PC = 200;
var pixelSize_SP = 100;
var pixelSize_rate;
var mobile = false;

$(document).ready(function () {
  Glyph = document.getElementsByClassName('glyph');
  pixelSize_rate =  Math.pow(pixelSize_PC, 2) /  Math.pow(pixelSize_SP, 2);
  console.log(pixelSize_rate);
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    mobile = true;
    createPixel(pixelSize_SP).then(animation);
  } else {
    createPixel(pixelSize_PC).then(animation);
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
        var t = new Array(Glyph.length).fill('');
        var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum libero sed ante molestie, et tincidunt libero ultrices. Phasellus sed placerat nunc, a condimentum nunc. Proin lobortis tincidunt accumsan. Vivamus vitae enim neque. Curabitur ante felis, sodales at enim id, commodo fermentum sapien. Donec faucibus risus vel ante ultricies commodo. Curabitur commodo quam quis enim porta auctor. Phasellus imperdiet imperdiet condimentum. Aliquam at magna orci. Quisque eget purus vel augue iaculis blandit at sed ex. In ultricies tincidunt lorem. Quisque vel massa placerat, maximus nulla dapibus, ullamcorper mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean a sollicitudin velit, non cursus lectus. Nulla vehicula cursus justo";
        var Count;

        $(Glyph).each(function(i){
          var image = images[i];
          aspect[i] = image.height / image.width;
          var [w, h] = getGlyphSize(s, i);
          var ctx = createCanvas(w, h);
          ctx.drawImage(image, 0, 0, w, h);

          var imageData = ctx.getImageData(0, 0, w, h);
          var data = imageData.data;
          Count = 0;

          for (let y = 0; y < h; y++) {
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
        });
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
  var tex = new Array(Glyph.length).fill('');
  var c = new Array(Glyph.length).fill(0);
  var fin = new Array(Glyph.length).fill(false);
  var sp = 50;
  var reg = new RegExp(`.{1,${sp}}`, 'g'); 

  if(mobile){
    sp = Math.round(sp / pixelSize_rate);
  }

  var str = [];
  // var t = [];

  for(let i = 0; i < Glyph.length; i++){
    var st = [];
    string[i] = $(Glyph[i]).html().match(reg);

    $(Glyph[i]).html("");
    $(Glyph[i]).fadeIn(0);
  }

  function animationLoop(){
    $(Glyph).each(function(i){
      if(i == 0){

      }else if(c[i - 1] < string[i].length / 4){
        c[i] = 0;
        return true;
      }

      if(string[i].length <= [c[i]]){
        fin[i] = true;
        return true;
      }

      var addTex = string[i][c[i]];
      addTex = addTex.replace(/凹/g,"&nbsp;").replace(/凸/g,"<br>");
      tex[i] += addTex;
      //tex[i] += str[i][c[i]];

      $(Glyph[i]).html(tex[i]);

      c[i] ++;
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
  $(this).delay(4000).queue(function(){
    animationLoop();
  });
  
}

$(window).resize(function(){
  if (mobile) {
    ReSize(pixelSize_SP);
  } else {
    ReSize(pixelSize_PC);
  }
});

function ReSize(s){
  $(Glyph).each(function(i){
    getGlyphSize(s, i);
  });
}

const getGlyphSize = function(s, i){
  var titleWidth = $('#container_title').width();
  var [sizeW,sizeH] = size(Glyph[i].id.replace("img_", ""));
  var w = Math.round(sizeW * s);
  var h = Math.round(w * aspect[i]);
  var [fontW, fontH] = getFontSize();
  //var ad = Math.pow((1 - (1 / s)), 2);
  var ad = 1;

  var scaleW = (sizeW * titleWidth / (fontW * w)) * 100 * ad;
  var scaleH = (sizeH * titleWidth / (fontH * h)) * 100 * ad;

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

  return [width, height];
}

const size = function(id){
  var w,h;
  switch(id){
    case "F":
      [w,h] = [ 0.66, 0.36];
    break;
    case "r":
      [w,h] = [ 0.50, 0.67];
    break;
    case "o":
      [w,h] = [ 0.46, 0.45];
    break;
    case "m":
      [w,h] = [ 0.48, 0.69];
    break;
    case "T":
      [w,h] = [ 0.23, 0.32];
    break;
    default:
      [w,h] = [0,0];
    break;
  }

  return [w,h];
}

// var size = [
//   [ 0.66, 0.36],
//   [ 0.50, 0.67],
//   [ 0.46, 0.45],
//   [ 0.48, 0.69],
//   [ 0.23, 0.32]
// ];