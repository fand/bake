/*//////////////////////////////////////////

化物語風ロゴジェネレーター
ver20120205

//////////////////////////////////////////*/


var canvas;
var context; 

var text= "";     //メイン文字 文字数の変更も出来ればいいのに
var subText = []; //サブ文字
var realSize;     //フォントサイズ
var ratio;        //アンチエイリアスの為の拡大率
var fontSize;     //拡大後のフォントサイズ　描画に使う
var subFontSize;  //サブ文字のサイズ
var subDx = [];   //サブ文字の微調整, x座標
var subDy = [];   //y座標
var mainColor;      //影の色
var blur;
var subColor;



function init(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d"); 

  render();
}

function render() {
  getForm();
  draw();
}

function getForm() {

  text= $("#mainText").val();
  subText = [];
  subDx = [];
  subDy = [];

  realSize = $("#mainSize").val(); 
  ratio = realSize/100;
  fontSize = realSize;
  subFontSize = fontSize*0.1;

  var gap = text.length - $(".subText").size();
  if(gap < 1) {           //サブ要素が多すぎる場合
    while (gap++<1) {
      $(".subText:last").remove();
    }
  } else {   //サブ要素が足りない場合
    while (gap-->1) {
      $("#subArea").append("<div class='subText'>サブ文字 "+ (text.length - gap) +"<input type='text' id='sub" + (text.length - gap - 1) + "' value='ガタリ' onkeyup='render()'>x座標<input type='number'  id='dx" + (text.length - gap - 1) + "' value='50' onMouseUp='render()'>y座標<input type='number'  id='dy"+ (text.length - gap - 1) +"' value='50' onMouseUp='render()'></div>");
    }
  }

  for(var i=0; i<text.length-1; i++) {
    if($("#sub"+i).val() != null) {
      subText.push($("#sub"+i).val());
    } else {
      subText.push(' ');
    }
    subDx.push(($("#dx"+i).val()-50)*ratio);
    subDy.push(($("#dy"+i).val()-50)*ratio);
  }
  mainColor = '#' + $("#mainColor").val();
  subColor = '#' + $("#subColor").val();
  blur = $("#blur").val();
}

function draw() {
  context.save();

  //キャンバスの位置の調整
  if(fontSize<210) {
    $("canvas").css("margin", (210-fontSize)/2 +"px");
  }

  //キャンバスの初期化
  canvas.width= (text.length+1) * fontSize - fontSize*0.2*(5-text.length);
  canvas.height= fontSize*1.5;
  context.clearRect(0,0, canvas.width, canvas.height);
  context.save();

  context.font = fontSize + "px 'Hiragino Mincho ProN', 'ＭＳ Ｐ明朝', serif";                     //serif体ならなんでも
  context.shadowColor = mainColor;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0.3*fontSize;


//メインテキストの描画
  context.fillStyle = 'rgba(255,255,255,1)';
  context.translate(fontSize*0.2, fontSize*0.2);
  for (var i=0;i<text.length;i++) {
    context.transform(0.7,-0.1, 0, 1, 0, 0);

    for (var j=0;j<blur;j++){
      context.fillText(text.charAt(i), fontSize*i, fontSize);  //影が薄いので何度も重ねる
    }
    context.shadowBlur= 0.4*fontSize;                        //半径を変えつつ
    context.fillText(text.charAt(i), fontSize*i, fontSize);
    context.shadowBlur= 0.3*fontSize;
    context.fillText(text.charAt(i), fontSize*i, fontSize);
    context.transform(1.42857 , 0.142857, 0, 1, 0, 0);
    context.translate(fontSize*0.5, fontSize*0.099503719);
  }
  context.restore();
  context.save();


//サブテキストの描画

  context.font = fontSize * 0.3 + "px 'ＭＳ ゴシック'";
  context.fillStyle= subColor;
  context.shadowColor = mainColor;
  context.shadowBlur = 0.3*fontSize;

  context.translate(0, fontSize*0.78); 
  for (var j=0;j<subText.length;j++) {
    context.translate(fontSize*(1)+subDx[j], subDy[j]);
    for (var i=0;i<subText[j].length;i++) {
      context.transform(0.7,-0.1, 0, 1, 0, 0);
      for (var k=0; k<blur;k++) {
        context.fillText(subText[j].charAt(i), subFontSize*i, subFontSize);
      }

      context.shadowBlur= 0.4*fontSize;
      context.fillText(subText[j].charAt(i), subFontSize*i, subFontSize);
      context.shadowBlur= 0.3*fontSize;
      context.fillText(subText[j].charAt(i), subFontSize*i, subFontSize);
      context.transform(1.42857 , 0.142857, 0, 1, 0, 0);
      context.translate(subFontSize, subFontSize*0.099503719);
    }
    context.translate(0, -subDy[j]-0.45*subFontSize); 
  }
  context.restore();
  context.save();



//メインテキストの再描画
  context.fillStyle = 'rgba(255,255,255,1)';
  context.shadowBlur=0;
  context.translate(fontSize*0.2, fontSize*0.2);
  for (var i=0;i<text.length;i++) {
    context.transform(0.7,-0.1, 0, 1, 0, 0);
    context.fillText(text.charAt(i), fontSize*i, fontSize);
    context.transform(1.42857 , 0.142857, 0, 1, 0, 0);
    context.translate(fontSize*0.5, fontSize*0.099503719);
  }
  context.restore();
  context.save();


//サブテキストの再描画
  context.font = fontSize * 0.3 + "px 'ＭＳ ゴシック'";
  context.fillStyle= subColor;
  context.shadowBlur=0;
  context.translate(0, fontSize*0.78); 
  for (var j=0;j<subText.length;j++) {
    context.translate(fontSize*(1)+subDx[j], subDy[j]);
    for (var i=0;i<subText[j].length;i++) {
      context.transform(0.7,-0.1, 0, 1, 0, 0);
      context.fillText(subText[j].charAt(i), subFontSize*i, subFontSize);
      context.transform(1.42857 , 0.142857, 0, 1, 0, 0);
      context.translate(subFontSize, subFontSize*0.099503719);
    }
    context.translate(0, -subDy[j]-0.45*subFontSize); 
  }
  context.restore();
  context.save();

//マスクもどきの描画
  var gradient = context.createLinearGradient(0,0,0,canvas.height);
  gradient.addColorStop(0, "rgba(255,255,255,0)"); //透明
  gradient.addColorStop(1, "rgba(255,255,255,1)"); //白
  context.fillStyle = gradient;
  context.fillRect(0,0,(text.length+1) * fontSize, canvas.height);

  context.restore();
  context.save();

}

function saveData(){       
  window.open( canvas.toDataURL() );
}

