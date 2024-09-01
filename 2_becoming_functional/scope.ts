const functionScope = () => {
  if (true) var myVar = 1;

  console.log(myVar);
}

// const blockScope = () => {
//   if (true) let myLet = 1;

//   console.log(myLet);
// }

/** NOTE: スコープの巻き上げによって、グローバルスコープを汚染してしまう
  * ループのカウントの i の宣言は、関数 processArr に巻き上げられ、関数 multipleBy10 で上書きされてしまう
  /
const loopCounterProbrem = () => {
  const arr = [1, 2, 3, 4];

  const processArr = () => {
    const multipleBy10 = (number: number) => {
      i = 10;
      return number * i;
    }

    for (var i = 0; i < arr.length; i++) {
      arr[i] = multipleBy10(arr[i]);
    }

    return arr;
  }

  const result = processArr();
  console.log(result); // [10, 2, 3, 4]
}

loopCounterProbrem();
