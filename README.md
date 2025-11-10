# 🥬 アプリ名：Pureat

四毒抜き（小麦粉・砂糖・乳製品・植物油）に特化したレシピアプリです。 
「レシピを調べる → 足りない材料買い物リストを活用し買う→実際に作る」までつなげることを目標に作りました。  
調味料一覧リストも作り、様々ジャンルの四毒抜き調味料を見ることができます。
スマホからも使いやすいように PWA に対応しています。

---

## 🚀 Features

- レシピ CRUD（タイトル / 画像 / 人数 / 調理時間）
- 材料・手順リストの管理
- タグ検索（和食 / 洋食 / 昼食など）
- 調味料リスト（商品名 / 画像 / 内容量 / 値段）
- 四毒抜きタグ
- お気に入り登録
- 買い物リストに追加（チェックボックス付き）
- 閲覧履歴の保存


---

## 🛠️ Tech Stack

- Laravel : 12.26.4
- Inertia.js (React)  : 2.0.0
- Tailwind CSS : 3.2.1
- Vite : 7.0.4
- PWA 対応  

---

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/e1e557e6-cdce-4656-ad5c-a2e0a737c68f" width="200" title="Login"/> 
  <img src="https://github.com/user-attachments/assets/12935ba7-6f32-4d2f-a39f-463668c662e6" width="200" title="Home"/> 
  <img src="https://github.com/user-attachments/assets/5cddad1b-8039-4729-92e9-10bfc9ebc40e" width="200" title="Home2"/>
  <img src="https://github.com/user-attachments/assets/bc222eff-8c5a-441a-9a42-f24bf7856578" width="200" title="Schopping-list"/> 
</p>

---


## 📦 Setup

下記のコマンドをターミナルで実行後、
ブラウザで http://127.0.0.1:8000 を開けば動作します 🎉

```bash
git clone <repo>
cd recipe-app
composer install
npm install   # ← ここで権限エラーが出た場合は "nvm" を使うか sudo を試してね
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed   # カテゴリー等の初期データも投入されます

php artisan serve
npm run dev
