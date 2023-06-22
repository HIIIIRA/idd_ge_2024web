// $(document).ready(function () {
//   var sp = 0.1; 
//   if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
//     mobileProcess(sp);
//     console.log("mobile");
//   } else {
//     mobileProcess(sp);
//     console.log("PC");
//   }
// });

function mobileProcess(s,tag){
  let el = $(tag);
  $(el).fadeIn(0);
  el.each(function (i) {
    let string = this.textContent.split("");
    this.textContent = "";
    var t = [];
    var tex = "";
    string.forEach((char, index) => {
      //var time = Math.random() * (5 * s  - s) + s;
      var time = s;
      t[index] = time;
      //var total = t.reduce((sum, element) => sum + element, 0) + (i * 100);
      setTimeout(() => {
          if(string[index] == "/"){
            tex += "<br>";
          }else{
            tex += string[index];
          }
          
          el.html(tex);
      }, time * index);

  
    });
  });
}

// function PCProcess(s){
//   var d = false;
//   var tex = [,];
  
//   //spanタグを追加する
//   var element = $(".typewriter");
//   element.each(function (j) {
//     var text = $(this).html();
//     var textbox = "";
//     var i = 0;
//     text.split('').forEach(function (t) {
//       if (t !== " ") {
//         textbox += '<tspan>' + "&nbsp;" + '</tspan>';
//         tex[j,i] = t;
//         i ++ ;
//         d = false;
//       } else if(!d){
//         textbox += '<tspan>' + "&nbsp;" + '</tspan>';
//         tex[j,i] = t;
//         i ++ ;
//         d = true;
//       }else{
//         //textbox += t;
//       }
//     });
//     $(this).html(textbox);

//   });
//   $(element).fadeIn(0);
  
//   TextTypingAnime(s, tex);
// }

// function TextTypingAnime(s,tex) {
//   $('.typewriter').each(function (j) {
//     var thisChild = "";
//     var t = [];
//     thisChild = $(this).children(); //spanタグを取得
//     //spanタグの要素の１つ１つ処理を追加
//     thisChild.each(function (i) {       
//       var time = Math.random() * (100 - 80) + 80; 
//       console.log(time + ":" + j)  ;
//       //var time = s; 
//       t[i] = time;
//       var total = t.reduce((sum, element) => sum + element, 0) + (j * s * 50);
//       //時差で表示する為にdelayを指定しその時間後にfadeInで表示させる
//       $(this).delay(time + 500 / (j * 2 + 1)).queue(function(){
//         //$(this).css('display', 'inline');
//         this.textContent = tex[j,i];
//       });
//       //$(this).delay(total).fadeIn(t[i]);
//     });
//   });
// }


var w,h;
var w_r,h_r;

$(document).ready(function () {
  var canvas = document.getElementById('test');
  var ctx = canvas.getContext('2d');
  var canvas2 = document.getElementById('test2');
  var ctx2 = canvas2.getContext('2d');
  var image = new Image();
  var image2 = new Image();
  var t = ""
  var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum libero sed ante molestie, et tincidunt libero ultrices. Phasellus sed placerat nunc, a condimentum nunc. Proin lobortis tincidunt accumsan. Vivamus vitae enim neque. Curabitur ante felis, sodales at enim id, commodo fermentum sapien. Donec faucibus risus vel ante ultricies commodo. Curabitur commodo quam quis enim porta auctor. Phasellus imperdiet imperdiet condimentum. Aliquam at magna orci. Quisque eget purus vel augue iaculis blandit at sed ex. In ultricies tincidunt lorem. Quisque vel massa placerat, maximus nulla dapibus, ullamcorper mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean a sollicitudin velit, non cursus lectus. Nulla vehicula cursus justo."
  var Count = 0;

  image.onload = function() {
    var r = image.height / image.width;
    var newWidth = 100;
    var newHeight = newWidth * r;
    // var w = image.width;
    // var h = image.height;
    //↓解像度変更する場合
    w = newWidth;
    h = newHeight;

    var scaleW = (0.43 * $(window).width() / (6 * w)) * 100;
    var scaleH = (0.24 * $(window).width() / (8 * h)) * 100;

    ctx.drawImage(image, 0, 0, w, h);
  
    var imageData = ctx.getImageData(0, 0, w, h);
    var data = imageData.data;

    for (let y = 0; y < h-1; y++) {
      let line = ""; // 各行のテキストを一時的に格納する変数
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
          line += "&nbsp;";
          Count++;
          if (Count >= lorem.length) {
            Count = 0;
          }
        } else {
          line += "&nbsp;";
        }
      }
      t += line + "/"; // 各行のテキストと改行を追加する
    }
    
    

    $("#img_F").html(t);
    $("#img_F").css({"transform":`scale(${scaleW}%,${scaleH}%)`});
    var tag = "#img_F";
    mobileProcess(1, tag);
  };
  
  image.src = './assets/img/f.png';


  image2.onload = function() {
    var r = image2.height / image2.width;
    var newWidth = 100;
    var newHeight = newWidth * r;
    // var w = image.width;
    // var h = image.height;
    //↓解像度変更する場合
    w_r = newWidth;
    h_r = newHeight;

    t = "";

    var scaleW = (0.33 * $(window).width() / (6 * w_r)) * 100;
    var scaleH = (0.438 * $(window).width() / (8 * h_r)) * 100;

    ctx2.drawImage(image2, 0, 0, w_r, h_r);
  
    var imageData = ctx2.getImageData(0, 0, w_r, h_r);
    var data = imageData.data;

    for (let y = 0; y < h_r-1; y++) {
      let line = ""; // 各行のテキストを一時的に格納する変数
      for (let x = 0; x < w_r; x++) {
        var index = (x + y * w_r) * 4;
        var alpha = data[index + 3];
        if (alpha != 0 && lorem[Count] != " ") {
          line += lorem[Count];
          Count++;
          if (Count >= lorem.length) {
            Count = 0;
          }
        } else if (alpha != 0 && lorem[Count] == " ") {
          line += "&nbsp;";
          Count++;
          if (Count >= lorem.length) {
            Count = 0;
          }
        } else {
          line += "&nbsp;";
        }
      }
      t += line + "/"; // 各行のテキストと改行を追加する
    }
    
    

    $("#img_r").html(t);
    $("#img_r").css({"transform":`scale(${scaleW}%,${scaleH}%)`});
    var tag = "#img_r";
    mobileProcess(0.1, tag);
  };
  
  image2.src = './assets/img/r.png';

  

})

$(window).resize(function(){
  var scaleW_F = (0.43 * $(window).width() / (6 * w)) * 100;
  var scaleH_F = (0.24 * $(window).width() / (8 * h)) * 100;
  var scaleW_r = (0.33 * $(window).width() / (6 * w_r)) * 100;
  var scaleH_r = (0.438 * $(window).width() / (8 * h_r)) * 100;

  $("#img_F").css({"transform":`scale(${scaleW_F}%,${scaleH_F}%)`});
  $("#img_r").css({"transform":`scale(${scaleW_r}%,${scaleH_r}%)`});
  console.log("resize");


});