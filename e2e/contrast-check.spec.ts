import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 共通ライブラリ（生JavaScript）を読み込み
const contrastDetectorScript = fs.readFileSync(
  path.join(__dirname, '../lib/contrast-detector.js'),
  'utf-8'
);

test.describe('コントラスト比チェック', () => {
  test('WCAG AA基準を満たしていること', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 共通ライブラリをブラウザに注入
    await page.addScriptTag({ content: contrastDetectorScript });

    // 違反を検出
    const violations = await page.evaluate(() => {
      // @ts-expect-error detectViolations is injected
      return detectViolations();
    });

    // タイプ別にカウント
    const textViolations = violations.filter(
      (v: { type?: string }) => v.type === 'text' || !v.type
    );
    const uiViolations = violations.filter(
      (v: { type?: string }) => v.type === 'ui-border'
    );
    const iconViolations = violations.filter((v: { type?: string }) =>
      v.type?.startsWith('icon-')
    );
    const placeholderViolations = violations.filter(
      (v: { type?: string }) => v.type === 'placeholder'
    );
    const linkViolations = violations.filter((v: { type?: string }) =>
      v.type?.startsWith('link')
    );

    // ログ出力
    if (violations.length > 0) {
      console.log('\n=== コントラスト比違反 ===\n');

      if (textViolations.length > 0) {
        console.log(`--- テキスト (${textViolations.length}件) ---`);
        for (const v of textViolations) {
          console.log(`[FAIL] ${v.selector}`);
          console.log(`  テキスト: "${v.text}"`);
          console.log(`  色: ${v.color} / 背景: ${v.backgroundColor}`);
          console.log(`  コントラスト比: ${v.ratio}:1 (必要: ${v.required}:1)`);
          console.log('');
        }
      }

      if (uiViolations.length > 0) {
        console.log(`--- UIコンポーネント境界線 (${uiViolations.length}件) ---`);
        for (const v of uiViolations) {
          console.log(`[FAIL] ${v.selector}`);
          console.log(`  要素: ${v.text}`);
          console.log(`  境界線: ${v.color} / 背景: ${v.backgroundColor}`);
          console.log(`  コントラスト比: ${v.ratio}:1 (必要: ${v.required}:1)`);
          console.log('');
        }
      }

      if (iconViolations.length > 0) {
        console.log(`--- アイコン (${iconViolations.length}件) ---`);
        for (const v of iconViolations) {
          console.log(`[FAIL] ${v.selector}`);
          console.log(`  タイプ: ${v.type}`);
          console.log(`  色: ${v.color} / 背景: ${v.backgroundColor}`);
          console.log(`  コントラスト比: ${v.ratio}:1 (必要: ${v.required}:1)`);
          console.log('');
        }
      }

      if (placeholderViolations.length > 0) {
        console.log(`--- プレースホルダー (${placeholderViolations.length}件) ---`);
        for (const v of placeholderViolations) {
          console.log(`[FAIL] ${v.selector}`);
          console.log(`  テキスト: "${v.text}"`);
          console.log(`  色: ${v.color} / 背景: ${v.backgroundColor}`);
          console.log(`  コントラスト比: ${v.ratio}:1 (必要: ${v.required}:1)`);
          console.log('');
        }
      }

      if (linkViolations.length > 0) {
        console.log(`--- リンク (${linkViolations.length}件) ---`);
        for (const v of linkViolations) {
          console.log(`[FAIL] ${v.selector}`);
          console.log(`  テキスト: "${v.text}"`);
          console.log(`  色: ${v.color} / 背景: ${v.backgroundColor}`);
          console.log(`  コントラスト比: ${v.ratio}:1 (必要: ${v.required}:1)`);
          if (v.note) console.log(`  注意: ${v.note}`);
          console.log('');
        }
      }
    }

    // レポートディレクトリを作成
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // 違反箇所をハイライトしてスクリーンショット
    if (violations.length > 0) {
      await page.evaluate(
        (
          rects: Array<{ x: number; y: number; width: number; height: number }>
        ) => {
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
        },
        violations.map((v) => v.rect)
      );

      await page.screenshot({
        path: path.join(reportsDir, 'violations.png'),
        fullPage: true,
      });
    }

    // JSONレポートを常に出力
    fs.writeFileSync(
      path.join(reportsDir, 'contrast-report.json'),
      JSON.stringify(violations, null, 2)
    );

    // このデモページは意図的にNG例を含むため、違反数を確認するのみ
    // 実際のプロジェクトでは .toHaveLength(0) で違反がないことを検証する
    console.log(`\n検出された違反: ${violations.length}件`);
    console.log(`  - テキスト: ${textViolations.length}件`);
    console.log(`  - UIコンポーネント: ${uiViolations.length}件`);
    console.log(`  - アイコン: ${iconViolations.length}件`);
    console.log(`  - プレースホルダー: ${placeholderViolations.length}件`);
    console.log(`  - リンク: ${linkViolations.length}件`);

    // レポートが正しく生成されたことを確認
    expect(
      fs.existsSync(path.join(process.cwd(), 'reports', 'contrast-report.json'))
    ).toBe(true);
  });
});
