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

> [!IMPORTANT]
> コードを把握すること
> プログラムを隅々まで見渡して、何が行われているかについて簡単にメンタルモデルを構築する能力

OOPでは、**プログラムがどのような手順で実行されるか**に焦点を当てる。
一方、FPでは手順ではなく、**関数をどのように組み合わせて結果を得るか**に焦点を当てる。
FPでは、処理を抽象的な関数として定義し、それらを組み合わせることでプログラムを構築する。
そのため、FPで実装されたプログラムは、OOPに比べてより簡潔で、全体像と制御フローを把握しやすいという特徴がある。


### 宣言型および遅延関数チェーン

関数の抽象度を上げることにより、データ構造とは無関係に処理を行うことができる。
基本的にプログラムにおいて、処理するデータによってプログラムのセマンティックを変えるべきではない。

> [!NOTE]
> プログラムのセマンティックとは、どのように動作するかという挙動を意味する。
> ```javascript
> // 引数のデータによってセマンティックが変わるプログラム
> function processData(data) {
>  if (typeof data === 'number') {
>    return data * 2;  // 数値の場合は2倍
>  } else if (typeof data === 'string') {
>    return data.toUpperCase();  // 文字列の場合は大文字に変換
>  } else if (Array.isArray(data)) {
>    return data.length;  // 配列の場合はその長さを返す
>  } else {
>    return 'Unsupported data type';  // その他の場合はエラーメッセージを返す
>  }
> }
>
> console.log(processData(10));         // 20
> console.log(processData('hello'));    // 'HELLO'
> console.log(processData([1, 2, 3]));  // 3
> console.log(processData({}));         // 'Unsupported data type'
> ```

まず命令型で名前のリストを読み込んで、正規化、重複除去、ソートするプログラムを見てみる。

```javascript

const names = ['alonzo church', 'Haskell curry', 'stephen_kleene', 'John von Neumann', 'stephen_kleene'];
const result = [];
for(let i = 0; i< names.length; i++) {
    var n = names[i];

    // 各要素を正規化
    if (n !== undefined && n !== null) {
        var ns = n.replace(/_/g, '').split();
    }

    // 先頭を大文字に変換
    for(let j = 0; j < ns.length; j++) {
        var p = ns[j];
        p = p.charAt(0).toUpperCase() + p.slice(1);
        ns[j] = p;
    }

    if (result.indexOf(ns.join(' ')) < 0) {
        result.push(ns.join(' '));
    }
}

result.sort();
```

このプログラムは、手続き型で書かれており、手順が明確に記述されている。
命令型コードは、固有な問題を効率的に解決することを目標にしているため、抽象度が低くなる。
抽象度が低くなると、再利用性が低くなり、保守性が低下する。

次に、関数型で名前のリストを読み込んで、正規化、重複除去、ソートするプログラムを見てみる。

```javascript

const names = ['alonzo church', 'Haskell curry', 'stephen_kleene', 'John von Neumann', 'stephen_kleene'];

_.chain(names)
  .filter(isValid)
  .map(s => s.replace(/_/g, ''))
  .uniq()
  .map(_.startCase)
  .sort()
  .value();
```

上記のように関数を利用して、処理を抽象化を行うことで、コード量が削減し、構造が簡潔かつクリアになる。

> [!IMPORTANT]
> 遅延関数チェーンとは、必要になるまで処理を行わない遅延評価の概念を利用して、関数を連続して実行できるようにすること。
> ```javascript
> class LazyChain {
> constructor(value) {
>        this.value = value;
>        this.chain = [];
>    }
>
>    add(func) {
>        this.chain.push(func);
>        return this;  // チェーンを続けられるように、現在のインスタンスを返す
>    }
>
>    evaluate() {
>        return this.chain.reduce((acc, func) => func(acc), this.value);
>    }
> }
>
> // 使用例
> const lazyChain = new LazyChain(5)
>    .add(x => x + 1)  // 評価されない
>    .add(x => x * 2)  // 評価されない
>    .add(x => x - 3); // 評価されない
>
> // 最後にすべてを評価
> console.log(lazyChain.evaluate());  // 結果: 7
> ```

Lodash を使った遅延関数チェーンの例

```javascript
_.chain(persons)
  .filter(isValid)
  .map(_.property('address.country'))
  .reduce(gatherStats, {})
  .values()
  .sortBy('count')
  .reverse()
  .first()
  .value()
  .name;
```

chain 関数を使うことで Lodash の提供するメソッドを連続して呼び出すことができる。

## 再帰的に考える

**再帰とは、ある問題を解決するために、問題をさらに小さな自己相似の問題に分解すること。**

> [!NOTE]
> 自己相似とは、全体の構造が部分の構造と同様のパターンや特性を持つことを指す。
> ![自己相似](https://quizknock.com/wp-content/uploads/2017/01/sierpinski.png)

配列を加算するプログラムを考える。
まずは命令型で書いた例を見てみる。

```javascript
var acc = 0;

for(let i = 0; i < numbers.length; i++) {
    acc += numbers[i];
}
```

reduce を利用する

```javascript
_.reduce(numbers, (acc, number) => acc + number, 0);
```

ループの制御（イテレーション）を関数に抽象化した。

Lodash の first と rest を使って再帰的に考える。

```javascript
function sum(numbers) {
    if (_.isEmpty(numbers)) {
        return 0;
    }

    return _.first(numbers) + sum(_.rest(numbers));
}
```

```
1 + sum([2, 3, 4])
1 + 2 + sum([3, 4])
1 + 2 + 3 + sum([4])
1 + 2 + 3 + 4 + sum([])
1 + 2 + 3 + 4 + 0
1 + 2 + 3 + 4
1 + 2 + 7
1 + 9
10
```

> [!IMPORTANT]
> **再帰処理は、ループ処理とパフォーマンスはほぼ同等**
> Javaascript には末尾呼び出し最適化( TCO ) があり、スタックのオーバーフローを防いでいる。
> 具体的な仕組みや実装について、以下のリンクを参照
> [末尾再帰による最適化](https://qiita.com/pebblip/items/cf8d3230969b2f6b3132)


```javascript
class Tree {
	constructor(root) {
		this._root = root;
	}

	static map(node, fn, tree = null) {
		node.value = fn(node.value);
		if(tree === null) {
			tree = new Tree(node);
		}
		if(node.hasChildren()) {
			_.map(node.children, function (child) {
				Tree.map(child, fn, tree);
			});
		}
		return tree;
	}

	get root() {
		return this._root;
	}
}

class Node {
	constructor(val) {
		this._val = val;
		this._parent = null;
		this._children = [];
	}

	isRoot() {
		return !isValid(this._parent);
	}

	get children() {
		return this._children;
	}

	hasChildren() {
		return this._children.length > 0;
	}

	get value() {
		return this._val;
	}

	set value(val) {
		this._val = val;
	}

	append(child) {
		child._parent = this;
		this._children.push(child);
		return this;
	}

	toString() {
		return `Node (val: ${this._val}, children:
			${this._children.length})`;
	}
};
```

> [!IMPORTANT]
> データ構造に関わらず、関数のセマンティックを変更させてはいけない

## ループではなく、再帰を使うメリット

多くの問題は、小さな部分に分割することで同じ種類の問題を解決できるという性質を持っている。
再起を利用することで、小さな問題に分割でき、それをを個別の関数として扱いやすくなる。
これにより再利用可能な関数を作成しやすくなる。

具体例1: 階乗計算
```javascript
// 再帰
function factorial(n) {
    if (n === 0) {
        return 1;
    }

    return n * factorial(n - 1);
}

// ループ
function factorial(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

再帰では、階乗の定義 `n * (n-1)!` をそのままプログラムに落とし込むことができている。
ループでは、`for` 分を使って、`result` に値を累積しているが、数学的な定義を直接的に表現していないため、問題の理解には処理の流れを追う必要がある。

具体例2: ツリー探索
```javascript
// 再帰
interface TreeNode {
    value: number;
    children: TreeNode[];
}

function findValueInTree(node: TreeNode, target: number): boolean {
    if (node.value === target) return true;

    for (let child of node.children) {
        if (findValueInTree(child, target)) return true;
    }

    return false;
}

// ループ
function findValueInTree(node: TreeNode, target: number): boolean {
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current.value === target) return true;

        stack.push(...current.children);
    }

    return false;
}
```

再帰的な実装は、関数の再利用性や抽象化に優れている。
再帰の実装でも `TreeNode` というデータ構造に依存しているため、そのままの形では他のデータ構造には適用できません。
しかし、**再帰の本当に優れている点は、関数を抽象化しやすい**ことです。
引数を一般化することで、簡単にデータ構造に依存しない再利用可能な関数を作成できます。

ループだとデータ構造が変わるたびにスタックやキューの管理が必要になり、再帰のようには抽象化できない。
ループ内の処理がデータ構造に密接に結びついているため、他の構造に再利用する際には手動でコードを変更する必要が出てくる。
