function TextTypingAnime() {
    $('.typewriter').each(function (j) {
      var elemPos = $(this).offset().top - 50;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      var thisChild = "";
      var t = [];
      var sp = 0.5;
      if (scroll >= elemPos - windowHeight) {
        thisChild = $(this).children(); //spanタグを取得
        //spanタグの要素の１つ１つ処理を追加
        thisChild.each(function (i) {            
          var time = Math.random() * (sp * 5 - sp) + sp;    
          if(this.textContent == " "){
            time = sp * 8;
          }
          t[i] = time;
          var total = t.reduce((sum, element) => sum + element, 0) + (j * sp * 1000);
          //時差で表示する為にdelayを指定しその時間後にfadeInで表示させる
          $(this).delay(total).fadeIn(t[i]);
        });
      } else {
        thisChild = $(this).children();
        thisChild.each(function () {
          $(this).stop(); //delay処理を止める
          $(this).css("display", "none"); //spanタグ非表示
        });
      }
    });
  }
// 画面が読み込まれたらすぐに動かしたい場合の記述
$(window).on('load', function () {
    var d = false;
    //spanタグを追加する
    var element = $(".typewriter");
    element.each(function () {
      var text = $(this).html();
      var textbox = "";
      text.split('').forEach(function (t) {
        if (t !== " ") {
          textbox += '<tspan>' + t + '</tspan>';
          d = false;
        } else if(!d){
          textbox += '<tspan>' + t + '</tspan>';
          d = true;
        }else{
          textbox += t;
        }
        console.log(t);
      });
      $(this).html(textbox);
  
    });
    $(element).fadeIn(0);
    TextTypingAnime();/* アニメーション用の関数を呼ぶ*/
  });// ここまで画面が読み込まれたらすぐに動かしたい場合の記述
