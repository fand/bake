/*//////////////////////////////////////////

 化物語風ロゴジェネレーター
 ver20140122

 //////////////////////////////////////////*/


var canvas;
var context;

var text= "";     // メイン文字
var subText = []; // サブ文字
var realSize;     // フォントサイズ
var ratio;        // アンチエイリアスの為の拡大率
var fontSize;     // 拡大後のフォントサイズ　描画に使う
var subFontSize;  // サブ文字のサイズ
var mainColor;    // 影の色
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
    text = $("#mainText").val();

    realSize = $("#mainSize").val();
    ratio = realSize / 100;
    fontSize = realSize;
    subFontSize = fontSize * 0.1;

    subText = $("#subText").val().split(/\s/);

    mainColor = '#' + $("#mainColor").val();
    subColor = '#' + $("#subColor").val();
    blur = $("#blur").val();
}

function draw() {
    //キャンバスの位置の調整
    if (fontSize < 210) {
        $("canvas").css("margin", (210 - fontSize) / 2 + "px");
    }

    //キャンバスの初期化
    canvas.width = (text.length + 1) * fontSize - fontSize * 0.2 * (5 - text.length);
    canvas.height = fontSize * 1.5;
    context.clearRect(0,0, canvas.width, canvas.height);

    //メインテキストの描画
    context.font = fontSize + "px 'Hiragino Mincho ProN', 'ＭＳ Ｐ明朝', serif";  // serif体ならなんでも
    context.shadowColor = mainColor;
    context.fillStyle = 'rgba(255,255,255,1)';
    drawTextWithBlur(text, fontSize * 0.2, fontSize * 0.2, fontSize * 0.5, fontSize, fontSize, blur);

    //サブテキストの描画
    context.font = fontSize * 0.3 + "px 'ＭＳ ゴシック'";
    context.fillStyle = subColor;
    context.shadowColor = mainColor;
    for (var i = 0; i < subText.length; i++) {
        var x = fontSize * 1.2 * (i + 1) - subFontSize * subText[i].length;
        var y = fontSize * 0.8;
        drawTextWithBlur(subText[i], x, y, subFontSize * 0.8, subFontSize, fontSize, blur);
    }

    //メインテキストの再描画
    context.font = fontSize + "px 'Hiragino Mincho ProN', 'ＭＳ Ｐ明朝', serif";  // serif体ならなんでも
    context.fillStyle = 'rgba(255,255,255,1)';
    drawText(text, fontSize * 0.2, fontSize * 0.2, fontSize * 0.5, fontSize);

    //サブテキストの再描画
    context.font = fontSize * 0.3 + "px 'ＭＳ ゴシック'";
    context.fillStyle = subColor;
    for (var i = 0; i < subText.length; i++) {
        var x = fontSize * 1.2 * (i + 1) - subFontSize * subText[i].length;
        var y = fontSize * 0.8;
        drawText(subText[i], x, y, subFontSize * 0.8, subFontSize);
    }

    //マスクもどきの描画
    var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(255,255,255,0)"); //透明
    gradient.addColorStop(1, "rgba(255,255,255,1)"); //白
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function saveData(){
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.href = image;
    link.download = text + '.png';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function drawText(text, x, y, dx, size){
    context.save();
    context.shadowBlur = 0;

    for (var i = 0; i < text.length; i++) {
        context.translate(x, y);
        context.translate(dx * i, size * 0.099503719 * i);

        context.transform(0.7, -0.1, 0, 1, 0, 0);

        context.fillText(text[i], size * i, size);

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.restore();
    }
}

function drawTextWithBlur(text, x, y, dx, size, blurSize, blurNum) {
    context.save();

    for (var i = 0; i < text.length; i++) {
        context.translate(x, y);
        context.translate(dx * i, size * 0.099503719 * i);

        context.transform(0.7, -0.1, 0, 1, 0, 0);

        context.shadowBlur = 0.3 * blurSize;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        for (var j = 0; j < blurNum; j++) {
            context.fillText(text[i], size * i, size);
        }

        context.shadowBlur = 0.4 * blurSize;
        context.fillText(text[i], size * i, size);

        context.shadowBlur = 0.3 * blurSize;
        context.fillText(text[i], size * i, size);

        context.setTransform(1, 0, 0, 1, 0, 0);

        context.shadowBlur = 0;
        context.restore();
    }
}
