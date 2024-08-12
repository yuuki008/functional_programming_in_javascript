document.querySelector('#msg').innerHTML = "Hello World!";

// ハードコード部分を変数に置き換えてメソッドにする
function printMessage(elementId, format, message) {
  document.querySelector(elementId).innerHTML = `<${format}>${message}</${format}>`;
}

// 関数型の printMessage
var pritMessage = run(addToDom('msg'), h1, echo);
printMessage('Hello World')
