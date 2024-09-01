# 関数型言語としての Javascript

## なぜ Javascript なのか？

**Javascript があらゆる場所で使われているから**
Web の言語で他に類を見ない普及率を持っている。

Javascript は、オブジェクト指向かつ関数型言語でもある。

## 関数型プログラミング vs オブジェクト指向プログラミング

> [!NOTE]
> オブジェクト内のデータへアクセスする際に `this` の利用を避ける！
> メソッドスコープ以外のインスタンスへアクセスすることができるため、副作用を起こしてしまい、純粋関数ではなくなる。

**オブジェクト指向プログラミング（OOP）**では、データとそれに関連する処理をオブジェクトにカプセル化します。
このアプローチの利点は、データと操作を一つのユニットとして扱うことができる点です。
しかし、この方法では、同じ処理を異なるオブジェクトで実行したい場合、それぞれのオブジェクトに対して同じ処理を再実装する必要があることがあります。
これにより、コードの重複が発生し、保守性が低下する可能性があります。

例えば、Male と Female という2つのオブジェクトがあり、これらに共通する処理として walk メソッドがあるとします。
オブジェクト指向では、これらのオブジェクトのスーパークラス（例えば Human）を作成し、共通の walk メソッドをそのスーパークラスに定義します。
このように、オブジェクト指向プログラミングでは、継承を利用して処理を抽象化し、コードの再利用を促進します。

一方、**関数型プログラミング（FP）**では、データと処理を分離し、処理を関数として表現します。
例えば、walk という関数を作成し、Human、Dog、Cat など、歩行可能なあらゆるオブジェクトに対して再利用できるようにします。
関数型プログラミングでは、引数の型を一般化し、再利用性の高いコードを実現します。
ここで言う「Human みたいな引数」とは、walk 関数が人間以外の動物にも適用可能であることを意味しています。
つまり、関数型プログラミングでは、より汎用的な関数を定義することで抽象化を行います。

プログラミングにおいては、コードの重複を減らし、再利用可能で保守性の高いコードを作成することが重要です。
そのため、処理の抽象化が必要であり、この抽象化の方法がオブジェクト指向と関数型プログラミングで異なります。

## Javascript オブジェクトの状態管理

Javascript はオブジェクトのプロパティは動的で追加・削除・変更が可能です。
たとえクラスのインスタンス変数がプライベートであっても、外部からアクセスし、変更できてしまいます。
この仕様は、状態管理を行う上で最悪と言えます。

> [!NOTE]
> ES2022 からは、`#` を使ってプライベートフィールドを定義できるようになっている。
> 公式 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties

## オブジェクトを値として扱う

**関数型プログラミングにおける値とは、数値や文字列のようなプリミティブなデータ型で本質的に不変であるものを指します。**
Javascript における動的なデータ構造を持つ、オブジェクトを値のように扱うことで、堅牢な状態管理を可能にする。

> [!NOTE] 前提として、Javascript のクラスによって作られるオブジェクトは、値として扱えない。
> 外から直接インスタンス変数を書き換えることができるため

### クロージャーを使う

クロージャーは、関数とその関数が作られた環境（スコープ）を持つオブジェクトです。

```javascript
const createPerson = (name, age) => {
    let _name = name;
    let _age = age;

    return {
        getName: () => _name,
        getAge: () => _age,
        setName: (name) => _name = name,
        setAge: (age) => _age = age
    };
}
```

### 可動部をディープフリーズ ( 再起的にフリーズ )

クラス文法でも、プロパティを不変にすることは `Object.freeze` を利用すれば可能。
しかしこれは、 Shallow Freeze であり、オブジェクトのプロパティがオブジェクトである場合は、そのプロパティはフリーズされない。

### ディープフリーズを自作する

```javascript
const isObject = (obj) => obj !== null && typeof obj === 'object';

const deepFreeze = (obj) => {
    if (isObject(obj) && !Object.isFrozen(obj)) {
        Object.freeze(obj);
        Object.keys(obj).forEach(key => deepFreeze(obj[key]));
    }

    return obj;
}
```

### レンズを使ってオブジェクトグラフを操作

オブジェクト指向では、状態をメソッドによって変更を行うが、状態が正しく変更されたかどうかを確認することが難しい。
**コピーオンライト（ 書き込み時にコピーすること ) ** という戦略に基づき、各メソッド呼び出しから新たなオブジェクトを返すような実装も可能だが、冗長でエラーの温床となる。
状態を持つオブジェクトを不変に保ちつつ、状態を変更するための方法として、**レンズ** という概念がある。
レンズは、自前で実装することなく、ライブラリを使用して実装することができる。

```javascript
const person = new Person('Alonzo', 'Church', '444-44-4444');
const lastnameLens = R.lensProp('lastname');
```

上記プログラムでは、 `R.lensProp` で `lastname` プロパティに対するレンズを作成している。

```javascript
R.view(lastnameLens, person); // Church
```

`R.view` によって、このプロパティを読み込む小音ができる。

```javascript
const newPerson = R.set(lastnameLens, 'Mourning', person);
newPerson.lastname // Mourning
person.lastname // Church
```

`R.set` によって新たな値を持ったオブジェクトを作成することができる。
さらに元のインスタンスの状態も保持することができている。
つまりコピーオンライトを実現している。

レンズは、初めての概念なので理解が浅い。
別で時間をとって詳しく調べる必要がある。

## 関数

**関数とは、`()` 演算子によって評価される呼び出し可能な式の事です。**
関数型プログラミングでは、常に関数を有効な値を生成する手段として扱います。
よって void のような undefined を返す関数は避けるべきです。

> [!NOTE]
> 式は、値を返すが、文は値を返さない。

手続き型は、順番に連続した文で構成され、関数型は、式で構成される。

### 第一級オブジェクトとしての関数

Javascript では、関数もオブジェクトであり、変数に代入したり、引数として渡したり、関数から返したりすることが可能。

```javascript
const add = (a, b) => a + b;
const callFuction = (fn, a, b) => fn(a, b);
const returnFunction = () => add;
const obj = {
    add: add
};
```

### 高階関数

上記で説明した通り、関数はオブジェクトであるため、関数を引数に取ったり、戻り値として返すことができる。
このような関数を **高階関数** と呼ぶ。

```javascript

const applyOperation = (a, b, fn) => fn(a, b);
const multiplier = (a, b) => a * b;
applyOperation(2, 3, multiplier); // 6
```

以下の add 関数は、1 つめの引数を取り、別の引数を取って、これを add 関数の 1 つめの引数に加えた結果を戻す関数を返す

```javascript
const add = (a) => {
  return (b) => a + b;
}
add(2)(3); // 5
```

**Javascript における関数は、与えられる入力値に基づき不変的に定義された「まだ実行されたいない値」である。**
高階関数を組み合わせることで、小さなパーツから意味ある式を作ることで、プログラムをシンプルにできる。

以下は、手続型で記述された福岡に住む人をログに出力するプログラム

```javascript
const printFukuokaResidents = (people) => {
    for (let i = 0; i < people.length; i++) {
        if (people[i].city === 'Fukuoka') {
            console.log(people[i].name);
        }
    }
}
```

ここからさらに Fukuoka 以外の人をログに出力するプログラムを追加する場合、手続型では別関数を作成するか、条件分岐を追加する必要がある。
しかし、関数型では、高階関数を使って、配列内の処理を抽象化することができる。

```javascript
const printResidents = (people, action) => {
    for (let i = 0; i < people.length; i++) {
        action(people[i]);
    }
}
```

ここから printPeople をさらに抽象化し、再利用しやすくすると以下のようになる。

```javascript
const printResidents = (people, selector, printer) => {
    people.filter(selector).forEach(printer);
}

const inFukuoka = (person) => person.city === 'Fukuoka';
const inTokyo = (person) => person.city === 'Tokyo';

printResidents(people, inFukuoka, console.log);
printResidents(people, inTokyo, console.log);
```

### 関数の呼び出し方法

1. グローバル関数
2. メソッド
3. コンストラクタ

> [!NOTE]
> 関数とメソッドの違いは、メソッドはオブジェクトに属している関数のことである。

### 関数メソッド

**関数のプロトタイプに定義されている ( メタ関数 ) のことを言う。**
よく API ユーザーが既存の関数から新たな関数を生成できるよう、 API の基礎部分のコードで特に頻繁に利用される。

```javascript

const negate = (fn) => {
    return function() {
        return !fn.apply(this, arguments);
    }
}

const isNull = (val) => val === null;
const isNotNull = negate(isNull);

isNotNull(null); //false
isNotNull({}); // true
```

- call()
  関数を即時に呼び出し、その呼び出し時に this の値を個別の引数を指定できる
  ```javascript
  const greet = () => console.log(`Hello, ${this.name}`);
  const person = { name: 'Alonzo' };
  greet.call(person)
  ```
- apply()
  call() と同じだが、引数を配列で渡すことができる
  ```javascript
  const greet = (greeting) => console.log(`${greeting}, ${this.name}`);
  const person = { name: 'Alonzo' };
  greet.apply(person, ['Hello']);
  ```
- bind()
  新しい関数を返し、その関数の this の値や、引数を固定することができる
  ```javascript
  const greet = (greeting) => console.log(`${greeting}, ${this.name}`);
  const person = { name: 'Alonzo' };
  const greetPerson = greet.bind(person, 'Hello');
  greetPerson();
  ```

## クロージャとスコープ

**クロージャとは、関数をその宣言された時点の環境にバインドするデータ構造のこと**
他にも静的スコープや構文スコープとも呼ばれる。

スコープは、変数が参照される値の範囲ですが、クロージャは、関数が宣言された時点のスコープを保持する。
そしてクロージャは関数のスコープを超えて変数を参照することができるため、入れ子のようにクロージャを定義することで継承のような機能を実現することができる。

```javascript
const makeAddfunction = (amount) => {
    return (number) => number + amount;
}

const makeExponentialFunction = (exponent) => {
    return (base) => Math.pow(base, exponent);
}

const addTen = makeAddfunction(10);
addTen(5); // 15

const raiseTwoToThe = makeExponentialFunction(2);
raiseTwoToThe(3); // 8
```

この例では、amount と base 変数が makeAddFunction と makeExponentialFunction の有効なスコープから外れているが、それぞれの関数が呼ばれた際に返される関数からは amount と base にアクセスできる。

```typescript
const outerVar = "Outer";

const makeInner = (params: string) => {
const innerVar = "Inner";

const inner = () => {
  console.log(
    `I can see: ${outerVar}, ${innerVar}, and ${params}`
  )
}

return inner;
}

const inner = makeInner("Params");
inner()
```

このようにクロージャは、宣言された時点のスコープを保持するため、関数が返された後もそのスコープにアクセスできる。
通常では、関数の実行が終了するとその関数内で定義されている変数はガベージコレクションによって破棄される。
しかし関数の中の関数で変数が参照されている場合、その変数は破棄されずに保持される。
この関数の中で関数を定義し、その中で変数を参照することで状態を保持するというのが、クロージャーの仕組み。

### グローバルスコープ

グローバルスコープは、プログラムのどこからでもアクセスできるスコープのこと。
パッケージ化されていない場合は、ネームスペースの衝突が発生する可能性があるため、避けるべき。
グローバルネームスペースの汚染は、別のファイル（ ライブラリやフレームワーク ) との競合を引き起こす可能性がある。

**グローバル変数の使用は避ける**

### Javascript のスコープ

Javascript は、呼び出された変数に最も近いスコープから変数を探し、見つからない場合は、外側のスコープに移動していく。
そこでグローバルスコープまで探し、見つからない場合は、 undefeind を返す。

> [!NOTE]
> Javascript の var は、ブロックスコープをサポートしていない
> ブロックスコープとは、for や while, if, switch などの { } に囲まれたスコープの事
> 例外は、catch ブロック内の変数
> ```javascript
> if (true) myVar = 10;
> const doWork = () => {
>   if (!myVar) {
>     let myVar = 10;
>   }
>   console.log(myVar); // 10
> }
> ```
> 他の言語だとブロックスコープがあるため、myVar を参照するエラーが発生する。

スコープの巻き上げによって、グローバルスコープを汚染してしまう
ループのカウントの i の宣言は、関数 processArr に巻き上げられ、関数 multipleBy10 で上書きされてしまう
**ブロックスコープの let と const を使うことで、スコープの巻き上げを防ぐ**

```typescript
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
```

## クロージャー実践

1. クロージャでプライベート変数を実現する

クロージャを使用すれば、プライベート変数を実現できるため、ライブラリやフレームワークなどの開発者は、クロージャを使用してカプセル化を行なっています。

```javascript
var MyModule = (function MyModule(export) {
    let _myPrivateVar = 10;

    export.method1 = () => {
        console.log(_myPrivateVar);
    }
    export.method2 = () => {
        console.log(_myPrivateVar);
    }
} MyModule || {}));
```

上記の例では、MyModule というクロージャを使用して、_myPrivateVar というプライベート変数を実現する。
呼び出し側は、method1 と method2 というパブリックメソッドを使用して、_myPrivateVar を参照する。

2. クロージャで非同期のフックを実現する

```
getJSON('/students',
    (students => {
        getJSON('students/grades',
          grades => processGrades(grades),
          error => console.log(error.message)
        )
    },
    (error) => {
        console.log(error.message)
    }
);
```

3. ブロックスコープ変数をエミュレートする

## 大事〜
- Javascript には、ブロックスコープがない

