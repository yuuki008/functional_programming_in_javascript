# 関数型で思考する

**オブジェクト思考は、可動部をカプセル化することでこーろを理解しやすくする。**
**関数型プログラミングは、可動部を減らすことでコードを理解しやすくする。**

プロダクトのコードに生産性を落とす要因が、あるかどうかを考えるときは、以下の質問をするといい。

- 拡張性はどうか？
    機能を追加するときに、既存のコードを変更する必要があるか？
- モジュラー化しやすいか？
    ある機能を変更するときに、他の機能に影響を与えるか？
- 再利用性はどうか？
    コードに重複が多すぎないか？
- テストしやすいか？
    関数のユニットテストに苦労していないか？
- わかりやすいか？
    コードを読むのに時間がかかりすぎないか？

## 関数型プログラミングとは

> 関数の利用に焦点を当てる**ソフトウェア開発スタイル**のこと。
> 副作用を避け、アプリケーションのおける状態遷移を減らすために、データに関する制御フローと処理を抽象化すること

この説明じゃ、全然わかんなかった。
オブジェクト指向だとインスタンスの中に状態を持ち、その状態をメソッド（振る舞い）で操作を行う。

```javascript
class Counter {
    constructor() {
        this.count = 0;
    }

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }
}

const counter = new Counter();
counter.increment();
console.log(counter.count); // 1
counter.increment();
console.log(counter.count); // 2
```

上記プログラムのように、振る舞いは状態に依存しており、引数が同じでも結果が異なる。
これにより **参照透過性** がなくなり、テストやデバッグが難しくなる。

### 関数型プログラミングは宣言型である

> 宣言型プログラミングとは、処理がどのように実装されているか、またデータがどのように流れるかを明示することなく、一連の処理を表現するパラダイムです。

今、一番使われているプログラミングパラダイムは、**命令型(手続き型)** である。

```javascript
var array = Array.from({ length: 10 }, (v, k) => k + 1);
for(let i=0; i< array.length; i++) {
    array[i] = Math.pow(array[i], 2);
}
array;
// [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

```

上記は、命令型で記述されたプログラムで、どのように実行されるかを明示している。

```javascript
Array.from({ length: 10 }, (v, k) => k + 1)
    .map(v => Math.pow(v, 2));
```

上記は、宣言型のプログラムで各要素への処理を記述し、ループ制御は `Array.prototype.map` に任せている。
これにより、ループのカウントと配列のインデックスを管理する責任がなくなった。
**通常のループは再利用ができず、使うとコードの重複が増えるが、`map, filter, reduce` などの関数を引数に取る高階関数を使うことで、再利用性が高まる。**

関数型プログラミングでは **状態の不在**と**不変性**を追求する。
状態を持たないコードを実現するには、副作用と状態変化を伴わない関数 (**純粋関数**) を使う。

### 純粋関数と副作用問題

> 純粋関数とは
> - 提供される入力値にのみ依存する。関数の実行中や関数呼び出しが行われる間に状態が変更する可能性がある、隠された値や外部スコープの値には依存しない
> - 関数自身のスコープの外にある値を一切変更しない。つまり、グローバルオブジェクトや参照私された引数を変更しない

```javascript
var counter = 0;
function increment() {
    counter++;
}
```

上記プログラムは、グローバル変数を変更しており、純粋関数ではない。
純粋関数を使うことで、把握しやすいプログラムになるが、複雑で動的なデータを扱うことが満ち溢れているソフトウェア開発では、純粋関数のみで開発を行うことは不可能。

そのため、純粋と不純なプログラムを分割、状態を管理しつつ変更を最小限に抑えることが求められる。

```javascript
// 副作用を伴う命令型 showStudent 関数
function showStudent(ssn) {
  let student = db.find(ssn);

  if (student !== null) {
    document.querySelector(`#${elementId}`).innerHTML = `${student.ssn}, ${student.firstname}, ${student.lastname}`;
  } else {
    throw new Error('Student not found!');
  }
}
```

**上記プログラムに存在する副作用**
- db という外部変数を参照している。
- elementId という外部変数を参照している。
- HTML 要素に直接変更を加えている。
- 学生情報が見つからない場合、例外をスローしている。その結果、プログラムスタック全体が巻き戻され、プログラムが終了する可能性がある。

**2 つの改善方法**
- 大きな関数を複数の小さな関数に分解
- 関数の処理に必要となるすべてのパラメータを明示的に定義し、副作用を減らす。


```javascript
const find = curry((db, id) => {
    let obj = db.find(id);
    if (obj === null) throw new Error('Object not found!');

    return obj;
})

const csv = student => `${student.ssn}, ${student.firstname}, ${student.lastname}`;
const append = curry((selector, info) => {
    document.querySelector(selector).innerHTML = info;
})
```

### 参照透過性と代替性

参照透過性とは、ある関数が同じ引数を受け取った場合、常に同じ結果を返すことを指す。

```javascript
// 命令型
var counter = 0;
function increment() {
    return counter++;
}

// 関数型
const increment = count => count + 1;
```

命令型の計算結果は、常に変更される可能性を持つ外部の counter 変数に依存しているため、一貫性がなく予測できない。
関数型は、引数にしか依存しておらず、エラーが発生する余地がない。

> [!NOTE]
> Javascript では、配列やオブジェクトは参照渡しであるため、参照透過性を持たない。

## 関数型プログラミングの利点

関数型でプログラムするために
- タスクをシンプルな関数に分解する
- 円滑なチェーンを使ってデータを処理する
- リアクティブパラダイムを使ってイベントクドコードの複雑さを低減する

### タスクをシンプルな関数に分解する


# 参考

- [関数型プログラミングはまず考え方から理解しよう](https://qiita.com/stkdev/items/5c021d4e5d54d56b927c)
- [関数型プログラミングのシンプルな3つの原則](https://zenn.dev/michiharu/articles/6f50e80d0eb818)

