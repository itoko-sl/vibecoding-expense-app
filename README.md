# 経費申請システム (Expense Management System)

社員用の経費申請・管理を行うWebアプリケーションです。Next.js、TypeScript、Tailwind CSSを使用して構築されています。

## 🚀 機能

### 📊 ダッシュボード
- 今月の承認済み経費総額表示
- 前月比較（増減率）
- 申請中の経費件数・金額
- カテゴリ別経費統計

### 📋 経費一覧
- 申請済み経費の一覧表示
- ステータス別色分け（下書き・申請中・承認済み・差し戻し）
- 詳細情報表示（日付、カテゴリ、金額、説明）
- 差し戻し理由の表示
- 編集機能（下書き・差し戻し分）

### ➕ 新規経費申請
- 使用日選択
- カテゴリ選択（8種類）
- 金額入力（バリデーション付き）
- 使用目的・詳細入力
- 領収書ファイルアップロード
- フォームバリデーション

## 🛠 技術スタック

- **Next.js 15.5.0** - Reactフレームワーク
- **TypeScript 5** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **React Hook Form** - フォーム管理
- **Lucide React** - アイコン
- **date-fns** - 日付処理

## 🏗 セットアップ

1. リポジトリをクローン:
```bash
git clone <repository-url>
cd expense-app-v2
```

2. 依存関係をインストール:
```bash
npm install
```

3. 開発サーバーを起動:

```bash
npm run dev
```

4. ブラウザで http://localhost:3000 を開く

## 📁 プロジェクト構造

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # メインページ
│   ├── layout.tsx    # レイアウト
│   └── globals.css   # グローバルスタイル
├── components/       # Reactコンポーネント
│   ├── ExpenseForm.tsx      # 経費申請フォーム
│   ├── ExpenseList.tsx      # 経費一覧
│   └── ExpenseDashboard.tsx # ダッシュボード
└── types/           # TypeScript型定義
    └── expense.ts   # 経費関連の型
```

## 🎯 使用方法

1. **ダッシュボード**: 経費の概要統計を確認
2. **経費一覧**: 申請済み経費の確認・編集
3. **新規申請**: 新しい経費を申請

## 📝 カテゴリ

- 交通費
- 宿泊費
- 食費
- 会議費
- 通信費
- 事務用品
- 書籍・研修費
- その他

## 🔧 開発

### ビルド
```bash
npm run build
```

### 型チェック
```bash
npm run type-check
```

### リント
```bash
npm run lint
```

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📧 お問い合わせ

プロジェクトに関する質問やフィードバックがございましたら、お気軽にお知らせください。
