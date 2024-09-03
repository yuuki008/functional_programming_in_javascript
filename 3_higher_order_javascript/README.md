# データ構造の数を減らし、操作の数を増やす

map, reduce, filter などの **高階関数** を使用して、逐次的にデータ構造を操作・変換するプログラムを書けるようになる。

## 制御フローの理解

**制御フロー** とは、プログラムが解決に至るまでの実行パスのこと
この制御フローが FP と OOP で異なる。

OOP では、詳細に処理のフローやパスを記述し、解決に至るまでの全てのステップを明確にする。

```javascript
var loop = ptcC();

while (loop) {
    var condition = optA();
    if (condition) {
        optB1();
    } else {
        optB2();
    }
    loop = optC();
}
```
FP では、制御フローを抽象化し、詳細な処理のフローやパスを記述しない。
処理の内容は、ブラックボックス化され、関数の組み合わせで制御フロー表現する。

```javascript
optA().optB().optC().optD();
```

> [!NOTE]
> 関数型だと処理の詳細は、記述しないので関数への命名が可読性とわかりやすさに直結する。
> エラーハンドリングを適切にしていないとどこでエラーが発生しているのかがわかりにくくなる。

## メソッドチェーン

**メソッドチェーン** とは、複数のメソッドを 1 つの命令分内で呼び出すこと。
OOP でよくみられるプログラミングパターンだが、 FP でも利用される。
基本的に FP では、オブジェクトは不変であるため、メソッドチェーンはオブジェクトの状態を変更するのではなく、新しいオブジェクトを返す。

```javascript
"Functinal Programming".substring(0, 10).toLowerCase() + ' is fun!';
```

## 関数チェーン

### ラムダ式の理解

**ラムダ式** とは、無名関数のこと ( **アロー関数** とも呼ばれる)。

### _.map を使う

map 関数は、配列の各要素に対して順番にイテレータ関数を適用し、新しい配列を返す高階関数。

```javascript

_.map(persons, s => (s !== null && s !== undefined) ? f.fullname : '');
```

```javascript
function map(arr, fn) {
    const len = arr.length;
    const newArr = new Array(len);

    for (let i = 0; i < len; i++) {
        newArr[i] = fn(arr[i], i, arr);
    }

    return newArr;
}
```

上記 map 関数は、第二引数で関数を受け取る高階関数になっている。
そしてイテレーションを肩代わりしてくれているので、呼び出し側でループ処理を意識する必要がなくなる。
