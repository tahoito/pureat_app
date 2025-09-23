# 🍳 アプリ名：Testie

自分のレシピを記録・活用できる Web アプリです。  
「レシピを残す → 買い物リストで使う」までつなげることを目標に作りました。  
スマホからも使いやすいように PWA に対応しています。

---

## 🚀 Features

- レシピ CRUD（タイトル / 画像 / 人数 / 調理時間）
- 材料・手順リストの管理
- タグ検索（和食 / 洋食 / 昼食など）
- お気に入り登録
- 買い物リストに追加（チェックボックス付き）
- 閲覧履歴の保存


---

## 🛠️ Tech Stack

- Laravel  
- Inertia.js (React)  
- Tailwind CSS  
- Vite  
- PWA 対応  

---

## 📸 Screenshots

（ここにアプリの画面キャプチャを載せると見やすい）

---


## 📦 Setup

```bash
git clone <repo>
cd recipe-app
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
