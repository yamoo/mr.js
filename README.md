# mr.js

mr.jsはフロントエンド開発のためのフレームワークを提供します。モジュール化されたJSの記述、ファイル管理、必要最低限のユーティリティ機能を提供します。

Introduction
--------------------

世の中にはフロントエンド開発に関する様々な便利なライブラリ、フレームワークが存在しています。mr.jsはこれらwebに存在する有益なリソースの中から、webページを構築するために最低限必要な仕組みを抽出しパッケージ化しました。

### 主な特徴

###### モジュール管理
1ファイル、1モジュール管理。排他的に管理されたモジュールを必要なときに簡単に読み出せる仕組みを提供

###### 雛形モジュール
雛形モジュールを継承し、スピーディにカスタムモジュールを設計可能

###### イベント管理
工事中

###### ブラウザ機能チェック
ブラウザで使用できる機能をチェックする機能を提供

###### ユーティリティ
ua判定、テンプレート、cookie操作等、開発に必要な機能を提供

###### メッセージ機能
簡易メッセージ機能を搭載

### ディレクトリ構成

###### dist/
非圧縮の`mr.js`と圧縮された`mr.min.js`があり、こちらが本体となります。

###### src/
結合前のソースコードです。

###### demo/
簡単なサンプルがあります。


Dependencies
--------------------

mr.jsは`jQuery`に依存しています。


Updates
--------------------

* 2015.02.06 v1.0.0 リリース



Getting started
--------------------

### インストール

mr.jsをbowerを使用してインストールします。`node.js`, `bower`がインストールされていない場合、先にこれらをインストールしておく必要があります。

```html
bower install git+ssh://git@git.rakuten-it.com:7999/~shinsuke.a.yamada/mr.js.git
```

### スクリプトの読み込み

htmlに&lt;script&gt;を使用しmr.jsを読み込みます。mr.jsはjQueryに依存していますので、一緒に読み込む必要があります。また後述します`モジュールjs`と`メインjs`には実際の処理内容を記述します。

```html
<!-- mr.min.js depends on jQuery -->
<script src="bower_components/jquery/dist/jquery.js"></script>
<!-- mr.min.js -->
<script src="bower_components/dist/mr.min.js"></script>
<!-- module js -->
<script src="js/module/module.mod01.js"></script>
<!-- main js -->
<script src="js/main.js"></script>
```

### メインjs

独立した１まとまりの処理は、モジュールjsに記述します。メインjsでは各モジュールを呼び出したり、呼び出したモジュールをDOMにアサインする処理を記述します。

```javascript
;(function($, $MR) {
    var Mod01;

    Mod01 = $MR.require('Mod01');

    $(function() {
        var mod01;

        mod01 = $MR.applyModule('.js-click', Mod01);
    });

})(window.jQuery, window.$MR);
```

`window.$MR`を参照する事でmr.jsの機能にアクセスすることができます。

```javascript
;(function($, $MR) {

  ...

})(window.jQuery, window.$MR);
```

`$MR.require`を使用してモジュールを読み込みます。引数で指定する値は、モジュールjsで定義されたものになります。

```javascript
Mod01 = $MR.require('Mod01');
```

`$MR.applyModule`に対象のエレメントのセレクタと適応するモジュールを渡し、モジュールを初期化します。

```javascript
mod01 = $MR.applyModule('.js-click', Mod01);
```

### モジュールjs

モジュールjsに実際の処理内容を記述します。定義したモジュールはreturn文で返し、メインjs内で`$MR.require`メソッドを使用して呼び出されます。

```javascript
window.$MR.define('Mod01', function ($, $MR) {
    var Utils = $MR.Utils,
        Mod01;

    Mod01 = Utils.extend($MR.View, {

        events: {
            'click .js-click': '_render'
        },

        _init: function() {
            this._delegate();
        },

        _render: function() {
          this.$el.text('hello!');
        }
    });

    return Mod01;
});
```

モジュールの定義には`$MR.define`メソッドを使用します。モジュールの名前と本体のファンクションを引数として渡します。ファンクションには実行時に`jQuery`と`mr.js`への参照が渡されます。モジュールの名前とモジュールのファイル名には同じワードを指定する必要があります。例えば`Mod01`としてモジュールの名前の定義する場合、そのファイル名は`module.mod01.js`とします。モジュール名はキャメルケースで、ファイル名は全て小文字を使用してください。（ファイル名のプリフィックスは変更可能です。）

```javascript
window.$MR.define('Mod01', function ($, $MR) {

  ...

});
```

関数やプロトタイプ文等を使用し独自でモジュールを定義するこもできますが、mr.jsが提供するモジュールを継承する事でもモジュールを定義する事ができます。`$MR.View`には`Backbone.js`ライクのメソッドが用意されており、エレメントやイベントのバインド処理が簡単に記述できる様になっています。


```javascript
Mod01 = Utils.extend($MR.View, {

  ...

});
```

定義したモジュールは最後にreturnで返す必要があります。

```javascript
return Mod01;
```


モジュール管理
--------------------

mr.jsが提供するモジュール管理の仕組みはとてもシンプルな物です。require.jsの様に依存関係を定義する事はできません。各モジュールファイルは次の３つのどれかを選択してください。

### 別々に読み込む

一番シンプルな方法です。&lt;script&gt;でモジュールファイルを一つずつ読み込みます。記述する際は次の順序を保証する必要があります。各モジュールjsの順序は気にする必要はありません。各モジュールは他のモジュールに依存しない形（jQuery等外部のライブラリは除く）で定義する必要があります。もしモジュール感の依存関係を定義する場合、メインjs内で定義します。

1. jQuery
2. mr.js
3. 各モジュールjs（モジュールのロード順序は関係ない）
4. メインjs

```html
<!-- mr.min.js depends on jQuery -->
<script src="bower_components/jquery/dist/jquery.js"></script>
<!-- mr.min.js -->
<script src="bower_components/dist/mr.min.js"></script>
<!-- module js -->
<script src="js/module/module.mod01.js"></script>
<!-- main js -->
<script src="js/main.js"></script>
```

### Minifyした物を読み込む


mr.jsを含め、メインjs、モジュールjsや、その他外部ライブラリをすべてMinifyして、1ファイルとして読み込む場合、上記別々に読み込む場合と同様の順序で定義します。


### 非同期(async)で読み込む

あらかじめ全てのモジュールを読み込むのではなく、必要なモジュールのみメインjs内でモジュールjsを非同期で読み込む事が可能です。jQuery, mr.js, メインjsの読み込み順は前述と同じです。モジュールjsは決められたディレクトリ・名前で格納する必要があります。

初期設定では、mr.jsが存在するディレクトリ（ベースディレクトリ）を基準に、「`module/`の中に`module.%modulename%.js`という名前」のファイルを読み込むようになっています。`%modulename%`はモジュールを定義したときに決めた名前(を小文字に変換したもの)と一致している必要があります。ベースディレクトリ、モジュールディレクトリ、モジュールファイル名のプリフィックス（デフォルトは"module"）は以下の様に変更できます。

```html
<script>
  window.$MR.Const.baseDir = 'js';        //ベースディレクトリ
  window.$MR.Const.moduleDir = 'mod';     //モジュールディレクトリ
  window.$MR.Const.modulePrefix = 'mod';  //モジュールファイル名のプリフィックス
</script>
```

この記述はmr.jsの定義の後、メインjsの前に記述して下さい。


### $MR.define

モジュールを定義する際に使用するメソッドです。このメソッドは原則「1モジュール内で1度のみ」しか使えません。第1引数にモジュールの名前を指定します（大文字から始めるとが好ましい）。第2引数にはfunctionを記述し、その中で実際のモジュールの定義を行います。当該funcitonは引数にjQueryとmr.jsへの参照を受け取る事ができます。

```javascript
window.$MR.define('Mod01', function ($, $MR) {
  var Mod01

  ...
  
  return Mod01;
});
```

1モジュールjs内で複数のモジュール定義をオブジェクトとして返す事も可能です。

```javascript
  return {
    Mod01: Mod01,
    Mod02: Mod02
  };
```

### $MR.require

$MR.defineで定義されたモジュールを読み込む際に使用するメソッドです。基本的にはメインjsの中で使用します。第1引数にモジュールの名前を指定します。

```javascript
var Mod01 = $MR.require('Mod01');
```

読み込んだモジュールはnewでインスタンスを生成するか、後述する`$MR.applyModule`を使用しDOMエレメントへアサインします。
```javascript
new Mod01();

or 

$MR.applyModule('.js-hoge', Mod01);
```

`$MR.require`は指定したモジュールが$MR空間上に存在しない場合、非同期でモジュールを読み込みます。(モジュールjsのパス、名前のルールは[非同期で読み込む](#mrjs--async)を参照）。非同期で読み込む場合、jQueryの`$.Deferred().promise()`を返します。`done`メソッドにはモジュール本体が渡されますので、モジュールjsがロードされた後に処理を続行する事が可能です。

```javascript
$MR.require('Mod02').done(function(Mod02) {
  var mod02 = new Mod02();
});
```

複数のモジュールjsのロードを同期したい場合は、`$.when`メソッドを使用します。

```javascript
$.when(
  $MR.require('Mod01'),
  $MR.require('Mod02'),
).done(function(Mod01, Mod02) {
  var mod01 = new Mod01();
  var mod02 = new Mod02();
});
```

### $MR.applyModule

モジュールをDOMエレメントへアサインします。第1引数にはエレメントのセレクタ、第2引数にモジュールを指定します。モジュールに渡すoptionsがある場合、第3引数にオブジェクトの形で渡します。戻り値として生成されてインスタンスを配列の返します。またこの配列はモジュール内で`instances`プロパティとしても参照する事が可能です。

```javascript
var mod01 = $MR.applyModule('.js-hoge', Mod01, {hoge: 1});

console.log(mod01);              // [ インスタンスの配列 ]
console.log(mod01[0].instances); // [ インスタンスの配列 ]
```


雛形モジュール
--------------------

mr.jsが提供する雛形モジュールを継承することで、簡単に独自モジュールを定義する事ができます。継承する際には`$MR.Utils.extend`メソッドを使用します。

* Bone
* Model
* View

```javascript
var Mod01 = $MR.Uitls.extend($MR.Bone, {
  // 独自の定義
};
```

### コーディングスタイル

雛形モジュールに定義されているプロパティ、メソッドは次の命名規則を採用しています。雛形モジュールを継承してモジュールを定義する際もこの命名規則を採用される事を推奨します。

#### _（アンダースコア）から始まるプロパティ、メソッド

インスタンス内からしか呼ばれない事を想定した`内部（プライベート）プロパティ、メソッド`を定義する際、「_（アンダースコア）」を接頭辞としています。

#### __（アンダースコア2つ）から始まるプロパティ、メソッド

通常参照、実行される事のない事を想定し、またオーバーライドされたくない`内部（プライベート）プロパティ、メソッド`を定義する際、「__（アンダースコア2つ）」を接頭辞としています。

#### その他のプロパティ、メソッド

インスタンス内、外を問わず参照、実行されることを想定した`外部（パブリック）プロパティ、メソッド`の定義。（一部例外あり）

#### jQueryオブジェクトを格納するプロパティ

またjQueryオブジェクトを格納するプロパティは`$hoge`のように「$」を接頭辞としています。


Bone
--------------------

$MR.Boneはイベントハンドリング関連のメソッドを持ったシンプルな雛形モジュールです。このモジュールを継承する事で、あらかじめ次のメソッドを持ったモジュールを定義する事ができます。

### - _bind

自分のメソッドのthisを自分自信で束縛するために使用する内部メソッド。例えばjQueryのonにハンドラとして登録する際に使用すると便利です。

```javascript
var Mod01 = $MR.Uitls.extend($MR.Bone, {
  _create: function() {
    $(window).on('load', this._bind('hoge'));
  },
  hoge: function() {
    this.value = true; //このthisは必ず自分になる。
  }
});
```

### - on

jQueryのonに似たイベントのハンドラを登録するためのメソッドです。第3引数にオブジェクトを指定することでthisを束縛できます。

```javascript
module.on('eventName', callback [, target]);
```

### - off

onで登録したハンドラを削除するためのメソッドです。

```javascript
module.off('eventName', callback [, target]);
```

### - trigger

onで登録されているインスタンスに対し、指定したイベントを発火させます。

```javascript
module.trigger('eventName');
```

### - listenTo

対象となるインスタンスのイベントを監視し、発火されたとき指定のメソッドを実行します。onと似ていますがlistenToは監視するインスタンスを必ず指定する必要があります。

```javascript
mod01.listenTo(mod02, 'eventName', callback);
```

### - stopListening

listenToで登録したイベントの監視を停止します。

```javascript
mod01.stopListening(mod02, 'eventName', callback);
```

Model
--------------------

`$MR.Bone`を継承したシンプルな雛形モジュールです。主にUI処理を伴わないビジネス処理用として使用する事ができます。

### - defaults

このモジュールが使用するデフォルトの設定が格納されているプロパティ。

### - settings

`_create`メソッドで生成される、インスタンスの設定値を格納するプロパティ

### - _create

インスタンスが生成された際に実行されるコンストラクタメソッド（内部メソッド）。インスタンス生成時の引数`options`と`this.defaults`を結合したオブジェクトを`this.settings`に格納し`this._init`を実行します。特に必要がない限りこのメソッドの直接実行、またオーバーライドの必要はありません。

```javascript
_create: function(options) {
    this.settings = $.extend({}, this.defaults, options);
    this._init();
}
```

### - _init

モジュールの初期処理メソッド（内部メソッド）。インスタンスが生成された後実行されます。デフォルトではブランクのfunctionが定義されています。自由にオーバーライドする事が可能です。


View
--------------------

`$MR.Bone`を継承したUI処理を行うことに特化した雛形モジュールです。DOMエレメントの操作をする際に便利なメソッドが定義されています。このモジュールを継承して独自にUI処理を定義することができます。

### - defaults

このモジュールが使用するデフォルトの設定が格納されているプロパティ。

### - settings

`this._create`メソッドで生成される、インスタンスの設定値を格納するプロパティ

### - el

インスタンスが対象とするDOMエレメントを格納するプロパティ。`this._create`メソッドで設定されます。

### - $el

`this.el`をjQueryオブジェクト化したものを格納するプロパティ。`this._create`メソッドで設定されます。

### - events

`this.el`とその子要素へのイベント監視をまとめて定義するためのプロパティ。定義した内容は`this._delegate`メソッドを実行する事で登録されます。オブジェクトの形で定義し、key値にイベント名、そのイベントが発火したときのハンドラとして、value値に自分のメソッドをそれぞれ文字列で定義します。

```javascript
events: {
  'click': '_handler'
}
```

複数のイベントに対して共通のハンドラを定義することもできます。


```javascript
events: {
  'click mouseener': '_handler'
}
```

また、`this.el`の子要素へのイベント監視は、key値にイベント名と一緒にそのセレクタを定義します。このように子要素に対する登録は内部的にjQueryのdelegateメソッドに渡されるため、まだ存在しない要素に対するイベント監視も登録する事が可能です。

```javascript
events: {
  'click .hoge': '_handler'
}
```

### - _create

インスタンスが生成された際に実行されるコンストラクタメソッド（内部メソッド）。インスタンス生成時の引数`options`と`this.defaults`を結合したオブジェクトを`this.settings`に格納します。また`this.el`にはアサインされた対象のDOMエレメントを、`this.$el`にはそのjQueryオブジェクトを格納し、最後に`this._init`を実行します。特に必要がない限りこのメソッドの直接実行、またオーバーライドの必要はありません。

```javascript
_create: function(options) {
    this.el = options.el;
    this.$el = $(this.el);
    this.settings = $.extend({}, this.defaults, options, this.$el.data('options'));
    this._init();
}
```

### - _init

モジュールの初期処理メソッド（内部メソッド）。インスタンスが生成された後実行されます。デフォルトではブランクのfunctionが定義されています。自由にオーバーライドする事が可能です。


### - _mkCache

`this.$`メソッドの結果をキャッシュするために内部的に呼ばれる、`this.settings.cache`を生成するためのメソッド。通常意図的に呼ぶ必要はありません。

### - _delegateEvent

`this._delegate`, `this._undelegate`内部で呼ばれるイベント登録／解除メソッド

### - _delegate

`this.events`で定義されたイベント監視パターンを登録し、監視を開始します。また第1引数にイベントを定義したオブジェクトを指定する事で、`this.events`以外の定義を登録することが可能です。さらに第2引数にthisに束縛したいインスタンスを指定する事ができます。

```javascript
this._delegate({
  'click': '_handler'
}, mod02);
```

### - _undelegate

`this._delegate`で登録したイベントを解除するためのメソッド。

### - $

`this.$el.find`へのショートカット。`this.$el`内のエレメントを参照します。

```javascript
var $hoge = this.$('.hoge');
```

一度参照したエレメントは`this.settings.cashe.$`にキャッシュされます。2回目に同じセレクタで参照した場合はキャッシュを参照します。キャッシュをクリアしたい場合は、第2引数に`true`を指定します。

```javascript
this.$('.hoge');      // DOMツリーを捜査

this.$('.hoge');      // キャッシュを参照

this.$('.hoge', true) // キャッシュをクリア
```

DOMツリーを捜査した結果、エレメントが見つからなかった場合は`null`を返します。

```javascript
if (!this.$('.hoge')) {
  // エレメントが存在しない場合
}
```

Event
--------------------
工事中


Feature
--------------------

`$MR.Feature`を参照する事で、目的の機能がブラウザで使用可能かどうかを確認することができます。現在確認できる機能は以下の通りです。

### - Touch

タッチ機能が使用できる場合は`true`、できない場合は`false`が格納されます。

```javascript
if ($MR.Feature.Touch) {
  // タッチ機能が使用できる場合
}
```

### - FormData

FormData APIが使用できる場合は`true`、できない場合は`false`が格納されます。

```javascript
if ($MR.Feature.FormData) {
  // FormData APIが使用できる場合
}
```

### - XHRUpload

XHRUploadが使用できる場合は`true`、できない場合は`false`が格納されます。

```javascript
if ($MR.Feature.XHRUpload) {
  // XHRUploadが使用できる場合
}
```


Utils
--------------------

`$MR.Utils`にはモジュールを実装する際等に便利なユーティリティ機能がまとめられています。

### - ua

`window.navigator.userAgent`から分かるブラウザ名が格納されているプロパティ。ブラウザ名のパターンは以下の通り。

* android (Android 標準ブラウザ）
* android2 (Android 2.x系　標準ブラウザ)
* iso (iPhone, iPad, iPod Mobile Safari）
* ie (IE)
* other（その他）

```javascript
if ($MR.Utils.ua === 'ios') {
  // iPhone, iPad, iPod Mobile Safari
}
```
### - transitionend

プリフィックス付きのtransitionendイベント名が格納されています。

```javascript
console.log($MR.Utils.transitionend) //Webkit系の場合、webkitTransitionEnd

### - animationend

プリフィックス付きのanimationendイベント名が格納されています。

```javascript
console.log($MR.Utils.animationend) //Webkit系の場合、webkitAnimationEnd

### - hasCookie

第1引数に指定した名前のクッキーが存在するかを調べるためのメソッド。

```javascript
$MR.Utils.hasCookie('cookieName' [,options]);
```

指定したクッキーが存在する場合`true`、しない場合`false`を返します。

```javascript
if ($MR.Utils.hasCookie('hoge')) {
  // クッキーhogeが存在する
}
```

第2引数にoptionsを指定する事で2次元クッキーの存在確認が可能です。

```javascript
// クッキーhogeの値が"foo=1:bar=2"の場合

if ($MR.Utils.hasCookie('hoge:foo', {delimiter: ':'})) {
  // クッキーhogeの中にfooが存在する場合
}
```

### - getCookie

第1引数に指定した名前のクッキーの値を取得するためのメソッド。

```javascript
$MR.Utils.getCookie('cookieName' [,options]);
```

hogeという名前のクッキーを取得する場合。

```javascript
var hoge = $MR.Utils.getCookie('hoge');
```

第2引数にoptionsを指定する事で2次元クッキーの値を取得可能です。

```javascript
var hogeFoo = $MR.Utils.getCookie('hoge:foo', {delimiter: ':'});
```

### - setCookie

第1引数に指定した名前のクッキーの値をセットするためのメソッド。

```javascript
$MR.Utils.setCookie('cookieName', value [,options]);
```

hogeという名前のクッキーに値をセットする場合。

```javascript
$MR.Utils.setCookie('hoge', 100);
```

第2引数にoptionsを指定する事で2次元クッキーの値をセットすることも可能です。

```javascript
$MR.Utils.setCookie('hoge:foo', 100, {delimiter: ':'});
```

### - deleteCookie

第1引数に指定した名前のクッキーの値を削除するためのメソッド。

```javascript
$MR.Utils.deleteCookie('cookieName');
```

### - getStorageItem

第1引数に指定したキーのlocalStorageの値を取得するためのメソッド。

```javascript
$MR.Utils.getStorageItem('key');
```

オブジェクトを実行結果として返します。値の取得に失敗した場合、`error`プロパティに`true`がセットされます。成功した場合は`data`プロパティに取得した値がセットされます。

```javascript
var result = $MR.Utils.getStorageItem('key');

console.log(result); // {error: false, data: 'hoge'} -> 成功！
```

### - setStorageItem

第1引数に指定したキーのlocalStorageに、第2引数に渡された値をセットするためのメソッド。

```javascript
$MR.Utils.setStorageItem('key', value);
```

オブジェクトを実行結果として返します。値のセットに失敗した場合、`error`プロパティに`true`が、成功した場合は`false`がセットされます。

```javascript
var result = $MR.Utils.setStorageItem('key', 'foo');

console.log(result); // {error: false} -> 成功！
```

### - uniqueId

ユニークなIDを返すメソッド。第1引数に文字列を与えると、文字列+IDを返します。

```javascript
var id1 = $MR.Utils.uniqueId();
var id2 = $MR.Utils.uniqueId('a');

console.log(id1); // 0
console.log(id2); // a1
```

### - extend

あるモジュールを継承したモジュールを定義するためのメソッド。

```javascript
Mod01 = $MR.Utils.extend(継承モジュール, モジュール定義);
```

コンストラクタを定義したい場合は、_createメソッドに定義します。

```javascript
Mod01 = $MR.Utils.extend($MR.Bone, {
  _create: function:function() {
    ...
  }
  ...

});
```

### - template

テンプレートエンジン。第1引数にテンプレート、第2引数にデータオブジェクトを指定します。

```javascript
var template = $MR.Utils.template(tmpl, data);
```

テンプレート内では、```$```でjQueryを参照する事で来ます。また`__d`で第2引数に指定したデータオブジェクトを参照できます。

```html
<div class="<%= name %>">
  <p><%= value %></p>
  
  <% $.each(__d.arr, function() { %>
    <span>this</span>
  <% }); %>
</div>
```

### - where

複数のオブジェクトを要素に持つ配列内から、特定のオブジェクトが存在するindexと値が格納されたオブジェクトを返すメソッド。

```javascript
var array = [
      {type: 'a', value: 10},
      {type: 'b', value: 11},
      {type: 'c', value: 12},
      {type: 'a', value: 13}
    ],
    search1 = {type: 'a'},
    search2 = {type: 'd'};

var ret1 = $MR.Utils.where(array, search1);
var ret2 = $MR.Utils.where(array, search2);
```

第1引数に指定した配列の中に、第2引数で指定したオブジェクトが存在するかを調べ、`indexes`と`values`をメンバに持つオブジェクトを返します。
`indexes`、`values`はそれぞれ配列になっており、結果が複数見つかった場合は、その全てが格納されます。見つからなかった場合`null`を返します。

```javascript
ret1 -> {
    indexes: [0, 3],
    values: [{type: 'a', value: 10}, {type: 'a', value: 13}]
  }
  
ret2 -> null
```

用語
--------------------

### モジュール

ある目的のために必要な設定値、メソッドが定義された部品。モジュールはそのままでは使用できず、実際にはモジュールから生成されたインスタンスを使用する。１つのモジュールから複数のインスタンスを生成する事が可能。

### インスタンス

モジュールを元に生成された実体。インスタンスはモジュールで定義されたプロパティ、メソッドを持ち、基本的に同じモジュールから生成されたインスタンス動詞でも、そのプロパティ、メソッドはそれぞれ別空間に存在するため干渉し合わない。

### コンストラクタ

モジュールからインスタンスを生成する際に実行される、モジュールがもつ特別なメソッド

### プロパティ

インスタンスが持つ変数

### メソッド

インスタンスが持つ関数

### 継承

あるモジュールを元に別のモジュールを定義すること。


Special Thanks
--------------------

This project is created on 2015-02-04 using [generator-rff](https://github.com/rakuten-frontend/generator-rff) v0.6.0.
