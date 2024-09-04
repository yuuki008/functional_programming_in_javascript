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

map 関数の内部実装は以下。

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
そしてイテレーションを肩代わりしてくれているので、呼び出し側でループ処理を意識しなくてよい。

### _.reduce を使う

reduce 関数は、配列の各要素を集計して、最終的な 1 つの値を返す高階関数。
reduce の内部実装は以下。


```javascript
function reduce(arr, fn, accumulator) {
    let idx = -1,
        len = arr.length;

    if (!accumulator && len > 0) {
        accumulator = arr[++idx];
    }

    while(++idx < len) {
        accumulator = fn(accumulator, arr[idx], idx, arr);
    }

    return accumulator;
}

```

- fn は、イテレータ関数で、引数に累積値、現在の値、インデックス、配列を受け取る。
- accumulator は、累積値の初期値で、省略可能。

```javascript
_(persons).reduce((stat, person) => {
    const country = person.address.country;
    stat[country] = _.isUndefined(stat[country]) ? 1 : stat[country] + 1;

    return stat;
}, {});
```

上記は、Persons 配列の各要素を集計して、国ごとの人数を返すプログラム。
map と reduce を組み合わせることで、プログラムをさらにシンプルにできる。

```javascript
const getCountry = person => person.address.country;
const gatherStats = (stat, country) => {
    stat[criteria] = _.isUndefined(stat[criteria]) ? 1 : stat[criteria] + 1;
    return stat;
};

_(persons).map(getCountry).reduce(gatherStats, {});

```

ただし map も reduce も配列の全ての要素に処理を行う。
null や undefined などの要素をスキップしたい場合は、イテレータ関数内に条件分岐を追加する必要があるが、可読性や保守性が損なわれる。
よって、このような場合は、filter 関数を使う。

### _.filter を使う

filter 関数は、配列の各要素に対して、条件を満たす要素だけを抽出して新しい配列を返す高階関数。
filter 関数の内部実装は以下。

```javascript

function filter (arr, predicate) {
  let idx = -1,
    len = arr.length,
    result = [];

  while(++idx < len) {
      const value = arr[idx];
      if (predicate(value, idx, arr)) {
          result.push(value)
      }
  }

  return result;
}
```

- predicate は、イテレータ関数で配列の各要素の選択基準を満たすかどうかを判定するのに使用される。

以下のように filter 関数を使うことで、条件分岐を記述する必要がなくなり、コードがシンプルになる。

```javascript
const bornIn1903 = person => person.birthYear === 1903;

_(persons).filter(bornIn1903).map(getCountry).reduce(gatherStats, {});
```

これらの関数を利用することで、プログラムを見た時に「**どのような方法で結果を得る**」のではなく、「**実行結果がどうなるのか**」に集中できる。
それにより、アプリケーションの深い理解が可能になる。

## コードを把握する

> ![IMPORTANT]
> コードを把握すること
> プログラムを隅々まで見渡して、何が行われているかについて簡単にメンタルモデルを構築する能力

OOPでは、**プログラムがどのような手順で実行されるか**に焦点を当てる。
一方、FPでは手順ではなく、**関数をどのように組み合わせて結果を得るか**に焦点を当てる。
FPでは、処理を抽象的な関数として定義し、それらを組み合わせることでプログラムを構築する。
そのため、FPで実装されたプログラムは、OOPに比べてより簡潔で、全体像と制御フローを把握しやすいという特徴がある。

