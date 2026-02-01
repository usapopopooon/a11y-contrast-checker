# A11y Contrast Checker

[![CI](https://github.com/usapopopooon/a11y-contrast-checker/actions/workflows/ci.yml/badge.svg)](https://github.com/usapopopooon/a11y-contrast-checker/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/usapopopooon/a11y-contrast-checker/graph/badge.svg)](https://codecov.io/gh/usapopopooon/a11y-contrast-checker)

**Demo:** https://usapopopooon.github.io/a11y-contrast-checker/

## 概要

WCAG 2.1 AA基準のコントラスト比をチェックするデモアプリケーションです。

様々なUIコンポーネントのコントラスト比を自動検出し、アクセシビリティ基準を満たしているかを視覚的に確認できます。

### 主な機能

- テキスト、アイコン、ボタン、フォーム要素のコントラスト比検出
- グラデーション背景、半透明色、フォーカスリングの検出
- WCAG 2.1 AA基準（4.5:1 / 3:1）での判定
- E2Eテストによる自動コントラスト比チェック

## 技術スタック

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Vitest (Unit Tests)
- Playwright (E2E Tests)

## 開発環境

- Node.js 20以上
- npm 10以上

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/usapopopooon/a11y-contrast-checker.git
cd a11y-contrast-checker

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## スクリプト

| コマンド                | 説明                          |
| ----------------------- | ----------------------------- |
| `npm run dev`           | 開発サーバー起動              |
| `npm run build`         | プロダクションビルド          |
| `npm run lint`          | ESLintチェック                |
| `npm run format`        | Prettierでフォーマット        |
| `npm run test`          | ユニットテスト（watchモード） |
| `npm run test:run`      | ユニットテスト（1回実行）     |
| `npm run test:coverage` | カバレッジ付きテスト          |
| `npm run test:e2e`      | E2Eテスト                     |
| `npm run check:all`     | 全チェック実行                |
