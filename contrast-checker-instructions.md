# コントラスト比チェッカー実装指示書

## 概要

Playwrightを使用してWCAG AA基準のコントラスト比をチェックするツールを作成する。CIに組み込むことを最終目標とし、まずはローカルで動作する最小構成を実装する。

## 技術スタック

- Node.js: Volta で管理
- Vite + React + TypeScript
- Vitest: ユニットテスト
- Storybook: コンポーネント確認
- Playwright: E2Eテスト & コントラストチェック実行

## ディレクトリ構成

```
contrast-checker/
├── src/
│   ├── App.tsx                    # チェック対象のサンプルページ
│   ├── main.tsx
│   └── lib/
│       └── contrast.ts            # コントラスト比計算ロジック
├── e2e/
│   └── contrast-check.spec.ts     # Playwrightテスト
├── scripts/
│   └── check-contrast.ts          # スタンドアロン実行用スクリプト
├── reports/                       # 出力先（自動生成）
│   ├── contrast-report.json
│   └── violations.png
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── .storybook/
    └── main.ts
```

## 実装手順

### 1. プロジェクト初期化

```bash
# Volta でNode.jsバージョン固定
volta pin node@20
volta pin npm@10

# Vite + React + TypeScript
npm create vite@latest contrast-checker -- --template react-ts
cd contrast-checker
npm install

# 開発依存
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D @storybook/react-vite storybook
npm install -D playwright @playwright/test
npx playwright install chromium
```

### 2. コントラスト比計算ロジック（src/lib/contrast.ts）

以下の機能を実装する。

#### 2.1 相対輝度の計算

WCAG 2.1の定義に従う。

```typescript
// sRGB値（0-255）を相対輝度（0-1）に変換
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
```

#### 2.2 コントラスト比の計算

```typescript
// 2つの相対輝度からコントラスト比を計算（1:1 〜 21:1）
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

#### 2.3 RGB文字列のパース

`getComputedStyle()`は `rgb(255, 0, 0)` や `rgba(255, 0, 0, 1)` 形式で返す。

```typescript
function parseRgb(color: string): { r: number; g: number; b: number } | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}
```

#### 2.4 WCAG AA基準判定

```typescript
interface WcagResult {
  ratio: number;
  isLargeText: boolean;
  meetsAA: boolean;
  required: number;
}

// 大きいテキスト: 18pt以上、または14pt以上かつbold
function isLargeText(fontSize: string, fontWeight: string): boolean {
  const size = parseFloat(fontSize);
  const weight = parseInt(fontWeight, 10);
  const pt = size * 0.75; // px to pt (概算)
  return pt >= 18 || (pt >= 14 && weight >= 700);
}

function checkWcagAA(
  ratio: number,
  fontSize: string,
  fontWeight: string
): WcagResult {
  const large = isLargeText(fontSize, fontWeight);
  const required = large ? 3.0 : 4.5;
  return {
    ratio,
    isLargeText: large,
    meetsAA: ratio >= required,
    required,
  };
}
```

### 3. DOM走査ロジック（Playwright内で実行）

`page.evaluate()` 内で実行するスクリプト。

```typescript
interface Violation {
  selector: string;
  text: string;
  color: string;
  backgroundColor: string;
  ratio: number;
  required: number;
  fontSize: string;
  rect: { x: number; y: number; width: number; height: number };
}

function findContrastViolations(): Violation[] {
  const violations: Violation[] = [];

  // テキストを含む要素を取得
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const text = node.textContent?.trim();
        return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    }
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  // 各テキストノードの親要素をチェック
  const checkedElements = new Set<Element>();

  for (const textNode of textNodes) {
    const element = textNode.parentElement;
    if (!element || checkedElements.has(element)) continue;
    checkedElements.add(element);

    const style = getComputedStyle(element);
    const color = style.color;
    const bgColor = getBackgroundColor(element);

    if (!bgColor) continue; // 背景色が取得できない場合はスキップ

    const ratio = calculateContrastRatio(color, bgColor);
    const result = checkWcagAA(ratio, style.fontSize, style.fontWeight);

    if (!result.meetsAA) {
      const rect = element.getBoundingClientRect();
      violations.push({
        selector: getSelector(element),
        text: element.textContent?.slice(0, 50) || '',
        color,
        backgroundColor: bgColor,
        ratio: Math.round(ratio * 100) / 100,
        required: result.required,
        fontSize: style.fontSize,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      });
    }
  }

  return violations;
}

// 背景色を取得（親要素を遡る）
function getBackgroundColor(element: Element): string | null {
  let el: Element | null = element;

  while (el) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }
    el = el.parentElement;
  }

  // body/htmlまで遡っても見つからなければ白を仮定
  return 'rgb(255, 255, 255)';
}

// CSSセレクタを生成（デバッグ用）
function getSelector(element: Element): string {
  if (element.id) return `#${element.id}`;

  const parts: string[] = [];
  let el: Element | null = element;

  while (el && el !== document.body) {
    let selector = el.tagName.toLowerCase();
    if (el.className) {
      const classes = el.className.split(/\s+/).filter(Boolean).slice(0, 2);
      selector += classes.map((c) => `.${c}`).join('');
    }
    parts.unshift(selector);
    el = el.parentElement;
  }

  return parts.join(' > ');
}
```

### 4. Playwrightテスト（e2e/contrast-check.spec.ts）

```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('コントラスト比チェック', () => {
  test('WCAG AA基準を満たしていること', async ({ page }) => {
    // ローカルサーバーのURLを指定
    await page.goto('http://localhost:5173');

    // DOM走査してコントラスト違反を検出
    const violations = await page.evaluate(() => {
      // ここに上記のfindContrastViolations関数を展開
      // または別ファイルからインジェクト
      return findContrastViolations();
    });

    // ログ出力
    if (violations.length > 0) {
      console.log('\n=== コントラスト比違反 ===\n');
      for (const v of violations) {
        console.log(`[FAIL] ${v.selector}`);
        console.log(`  テキスト: "${v.text}"`);
        console.log(`  色: ${v.color} / 背景: ${v.backgroundColor}`);
        console.log(`  コントラスト比: ${v.ratio}:1 (必要: ${v.required}:1)`);
        console.log('');
      }
    }

    // 違反箇所をハイライトしてスクリーンショット
    if (violations.length > 0) {
      await page.evaluate((rects) => {
        for (const rect of rects) {
          const overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed;
            left: ${rect.x}px;
            top: ${rect.y}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            border: 3px solid red;
            background: rgba(255, 0, 0, 0.1);
            pointer-events: none;
            z-index: 99999;
          `;
          document.body.appendChild(overlay);
        }
      }, violations.map((v) => v.rect));

      const reportsDir = path.join(process.cwd(), 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      await page.screenshot({
        path: path.join(reportsDir, 'violations.png'),
        fullPage: true,
      });

      // JSONレポートも出力
      fs.writeFileSync(
        path.join(reportsDir, 'contrast-report.json'),
        JSON.stringify(violations, null, 2)
      );
    }

    // テストとしてはviolationsが0であることを期待
    expect(
      violations,
      `${violations.length}件のコントラスト比違反があります`
    ).toHaveLength(0);
  });
});
```

### 5. サンプルページ（src/App.tsx）

意図的にコントラスト違反を含むサンプル。

```tsx
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#333' }}>コントラストチェッカー テスト</h1>

      {/* OK: 十分なコントラスト */}
      <p style={{ color: '#333', backgroundColor: '#fff' }}>
        これは読みやすいテキストです（コントラスト比 12.6:1）
      </p>

      {/* NG: 低コントラスト */}
      <p style={{ color: '#aaa', backgroundColor: '#fff' }}>
        これは読みにくいテキストです（コントラスト比 2.3:1）
      </p>

      {/* NG: 背景色との組み合わせ */}
      <div style={{ backgroundColor: '#3498db', padding: '10px' }}>
        <span style={{ color: '#5dade2' }}>
          青背景に薄い青文字（コントラスト比 1.5:1）
        </span>
      </div>

      {/* OK: 大きいテキストは基準が緩い */}
      <p style={{ color: '#777', fontSize: '24px', fontWeight: 'bold' }}>
        大きいテキストは3:1でOK（コントラスト比 4.5:1）
      </p>
    </div>
  );
}

export default App;
```

### 6. 設定ファイル

#### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173',
  },
});
```

#### package.json（scripts追加）

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:e2e": "playwright test",
    "check:contrast": "playwright test e2e/contrast-check.spec.ts"
  }
}
```

## 実行方法

```bash
# 開発サーバー起動（別ターミナル）
npm run dev

# コントラストチェック実行
npm run check:contrast

# 結果確認
cat reports/contrast-report.json
open reports/violations.png
```

## 出力例

### ログ

```
=== コントラスト比違反 ===

[FAIL] div > p.low-contrast
  テキスト: "これは読みにくいテキストです"
  色: rgb(170, 170, 170) / 背景: rgb(255, 255, 255)
  コントラスト比: 2.32:1 (必要: 4.5:1)

[FAIL] div.blue-bg > span
  テキスト: "青背景に薄い青文字"
  色: rgb(93, 173, 226) / 背景: rgb(52, 152, 219)
  コントラスト比: 1.47:1 (必要: 4.5:1)
```

### レポート画像

違反箇所が赤枠でハイライトされたスクリーンショット。

## 今後の拡張

1. **CI統合**: GitHub Actionsでプルリクエスト時に自動チェック
2. **Storybook統合**: 各Storyに対してコントラストチェック
3. **背景画像対応**: Canvas APIで背景画像の色をサンプリング
4. **レポート形式**: HTML形式で見やすいレポート生成
5. **除外設定**: 意図的に基準を満たさない箇所を除外する設定

## 参考

- [WCAG 2.1 コントラスト要件](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [相対輝度の計算式](https://www.w3.org/TR/WCAG21/#dfn-relative-luminance)
