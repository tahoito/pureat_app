# 🍳 アプリ名：Tastie

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

<p align="center">
  <img src="https://github.com/user-attachments/assets/e1e557e6-cdce-4656-ad5c-a2e0a737c68f" width="200" title="Login"/> 
  <img src="https://github.com/user-attachments/assets/12935ba7-6f32-4d2f-a39f-463668c662e6" width="200" title="Home"/> 
  <img src="https://github.com/user-attachments/assets/5cddad1b-8039-4729-92e9-10bfc9ebc40e" width="200" title="Home2"/>
  <img src="https://github.com/user-attachments/assets/bc222eff-8c5a-441a-9a42-f24bf7856578" width="200" title="Schopping-list"/> 
</p>

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
