# IITC plugin: Log Downloader for yanwest

# 📥 IITC ログ保存プラグイン (Log Downloader) 導入ガイド

このページは、Ingress の「Intel Map」からログデータを保存できるようにするための手順書です。

---

## 🏁 手順 0：まず最初に準備すること
このツールを動かすために、ブラウザ（Chromeなど）の設定を2つだけ確認してください。

### ① 「デベロッパーモード」を ON にする
1. ブラウザの一番上の枠（アドレスバー）に `chrome://extensions` と入力して Enter を押します。
2. 右上にある **「デベロッパー モード」** というスイッチを **ON（青色）** にしてください。
   * ※これを忘れると、ツールが「無効」と表示されて動きません。

### ② 「Tampermonkey」を準備する
* まだの方は [こちらの公式サイト](https://www.tampermonkey.net/) からインストールしてください。
* ブラウザの右上の「黒いアイコン」をクリックして **「✓ 有効」** になっていればOKです。

---

## 🛠 手順 1：ツールをインストールする
以下のリンクを **順番にクリック** してください。
※クリックすると「黒い画面」が出ます。右上の **「インストール」** ボタンを押せば完了です。

### 1. 【必須】IITC 本体
すべての基礎になる本体です。最初に入れてください。
> [IITC 本体をインストール](https://iitc.app/build/release/total-conversion-build.user.js)

### 2. 【メイン】ログ保存ツール (Log Downloader)
今回の目的である、ログを保存するためのツールです。
> [ログ保存ツールをインストール](https://github.com/aminosup/iitc-log-downloader/raw/main/LogDownLoader.yanwest.user.js)

### 3. 【便利】以前の環境に戻す追加機能
必要に応じて以下のリンクもクリックして導入してください。
* [ポータル名を表示 (Portal Names)](https://iitc.app/build/release/plugins/portal-names.user.js)
* [住所を表示 (Address)](https://github.com/IITC-CE/ingress-intel-total-conversion/raw/master/build/release/plugins/show-address.user.js)
* [図形作成ツール (Draw tools)](https://iitc.app/build/release/plugins/draw-tools.user.js)
* [クロスリンク表示 (Cross links)](https://iitc.app/build/release/plugins/cross-links.user.js)
* [Fan Fields 2](https://github.com/Heistergand/fanfields2/raw/master/iitc_plugin_fanfields2.user.js)

---

## 🚀 手順 2：使い方（動いているか確認する）

1. [Ingress Intel Map](https://intel.ingress.com/) を開きます。
2. 画面の **左下のすみ（About IITCなどの近く）** を見てください。
3. **「📥 Log Download」** という新しいボタンが出ていれば成功です！
   * ボタンを押すと、今見ている画面のログがファイルとして保存されます。

使い方の注意
マップを広範囲に広げると広範囲のLogが取得できます。
Logは過去の古いLogが欲しい場合IITCのALL画面を▲で開きLogを遡らせてください。
AlertsやFactionも同様で遡らせてください。

---

## ❓ うまくいかない時は？

### Q. クリックしても「Google検索」になってしまう
リンクを直接クリックするか、リンクを右クリックして「リンクのアドレスをコピー」し、ブラウザの一番上の枠に直接貼り付けてください。

### Q. Tampermonkeyの設定を「上級者」にする必要は？
いいえ、必要ありません。初期設定のまま（初心者モード）で、すべてのツールが正常に動きます。
