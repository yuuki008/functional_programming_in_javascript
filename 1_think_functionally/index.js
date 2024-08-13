document.querySelector('#msg').innerHTML = "Hello World!";

// ハードコード部分を変数に置き換えてメソッドにする
function printMessage(elementId, format, message) {
  document.querySelector(elementId).innerHTML = `<${format}>${message}</${format}>`;
}

// 関数型の printMessage
var pritMessage = run(addToDom('msg'), h1, echo);
printMessage('Hello World')

// 副作用を伴う命令型 showStudent 関数
function showStudent(ssn) {
  let student = db.find(ssn);

  if (student !== null) {
    document.querySelector(`#${elementId}`).innerHTML = `${student.ssn}, ${student.firstname}, ${student.lastname}`;
  } else {
    throw new Error('Student not found!');
  }
}
