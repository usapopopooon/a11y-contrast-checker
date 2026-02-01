import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContrastBadges, _internal } from './ContrastBadges';
import type { DetectionResult } from '@/lib/contrast';

const {
  parseRequired,
  isDetectionOk,
  getDetectionState,
  getTypeLabel,
  EXPECTED_BADGE_STYLES,
  DETECTION_BADGE_STYLES,
} = _internal;

// ============================================================
// テストヘルパー
// ============================================================

const createDetectionResult = (
  overrides: Partial<DetectionResult> = {}
): DetectionResult => ({
  detected: true,
  ratio: 4.5,
  color: 'rgb(0, 0, 0)',
  bgColor: 'rgb(255, 255, 255)',
  type: 'text',
  ...overrides,
});

// ============================================================
// parseRequired
// ============================================================

describe('parseRequired', () => {
  it('有効な数値文字列をパースする', () => {
    expect(parseRequired('4.5')).toBe(4.5);
    expect(parseRequired('3.0')).toBe(3);
    expect(parseRequired('21')).toBe(21);
  });

  it('無効な文字列の場合0を返す', () => {
    expect(parseRequired('免除')).toBe(0);
    expect(parseRequired('')).toBe(0);
    expect(parseRequired('abc')).toBe(0);
  });
});

// ============================================================
// isDetectionOk
// ============================================================

describe('isDetectionOk', () => {
  it('検知結果がnullの場合、nullを返す', () => {
    expect(isDetectionOk(null, 4.5)).toBeNull();
  });

  it('比率が基準以上の場合、trueを返す', () => {
    const result = createDetectionResult({ ratio: 5.0 });
    expect(isDetectionOk(result, 4.5)).toBe(true);
  });

  it('比率が基準未満の場合、falseを返す', () => {
    const result = createDetectionResult({ ratio: 3.0 });
    expect(isDetectionOk(result, 4.5)).toBe(false);
  });

  it('境界値で正しく判定する', () => {
    const result = createDetectionResult({ ratio: 4.5 });
    expect(isDetectionOk(result, 4.5)).toBe(true);
  });
});

// ============================================================
// getDetectionState
// ============================================================

describe('getDetectionState', () => {
  it('nullの場合、pendingを返す', () => {
    expect(getDetectionState(null)).toBe('pending');
  });

  it('trueの場合、okを返す', () => {
    expect(getDetectionState(true)).toBe('ok');
  });

  it('falseの場合、ngを返す', () => {
    expect(getDetectionState(false)).toBe('ng');
  });
});

// ============================================================
// getTypeLabel
// ============================================================

describe('getTypeLabel', () => {
  it('textに対してテキストを返す', () => {
    expect(getTypeLabel('text')).toBe('テキスト');
  });

  it('borderに対してボーダーを返す', () => {
    expect(getTypeLabel('border')).toBe('ボーダー');
  });

  it('svgに対してSVGを返す', () => {
    expect(getTypeLabel('svg')).toBe('SVG');
  });

  it('placeholderに対してプレースホルダーを返す', () => {
    expect(getTypeLabel('placeholder')).toBe('プレースホルダー');
  });

  it('focus-ringに対してフォーカスリングを返す', () => {
    expect(getTypeLabel('focus-ring')).toBe('フォーカスリング');
  });

  it('gradientに対してグラデーションを返す', () => {
    expect(getTypeLabel('gradient')).toBe('グラデーション');
  });

  it('linkに対してリンクを返す', () => {
    expect(getTypeLabel('link')).toBe('リンク');
  });

  it('link-no-underlineに対してリンク(下線なし)を返す', () => {
    expect(getTypeLabel('link-no-underline')).toBe('リンク(下線なし)');
  });

  it('unknownに対して不明を返す', () => {
    expect(getTypeLabel('unknown')).toBe('不明');
  });
});

// ============================================================
// スタイル定数
// ============================================================

describe('EXPECTED_BADGE_STYLES', () => {
  it('ok状態のスタイルが定義されている', () => {
    expect(EXPECTED_BADGE_STYLES.ok.className).toContain('bg-green');
  });

  it('ng状態のスタイルが定義されている', () => {
    expect(EXPECTED_BADGE_STYLES.ng.className).toContain('bg-red');
  });

  it('イミュータブルである', () => {
    expect(Object.isFrozen(EXPECTED_BADGE_STYLES)).toBe(true);
  });
});

describe('DETECTION_BADGE_STYLES', () => {
  it('ok状態のスタイルが定義されている', () => {
    expect(DETECTION_BADGE_STYLES.ok.className).toContain('bg-blue');
  });

  it('ng状態のスタイルが定義されている', () => {
    expect(DETECTION_BADGE_STYLES.ng.className).toContain('bg-orange');
  });

  it('pending状態のスタイルが定義されている', () => {
    expect(DETECTION_BADGE_STYLES.pending.className).toContain('bg-gray');
  });

  it('イミュータブルである', () => {
    expect(Object.isFrozen(DETECTION_BADGE_STYLES)).toBe(true);
  });
});

// ============================================================
// ContrastBadges コンポーネント（統合テスト）
// ============================================================

describe('ContrastBadges', () => {
  it('期待値OKの場合、期待: OKと表示する', () => {
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="4.5:1"
        requiredRatio="4.5"
        detection={null}
      />
    );
    expect(screen.getByText('期待: OK')).toBeInTheDocument();
  });

  it('期待値NGの場合、期待: NGと表示する', () => {
    render(
      <ContrastBadges
        expectedOk={false}
        expectedRatio="2.3:1"
        requiredRatio="4.5"
        detection={null}
      />
    );
    expect(screen.getByText('期待: NG')).toBeInTheDocument();
  });

  it('検知結果がない場合、検知: -と表示する', () => {
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="4.5:1"
        requiredRatio="4.5"
        detection={null}
      />
    );
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('検知結果OKの場合、検知: OKと表示する', () => {
    const detection = createDetectionResult({ ratio: 5.0, type: 'text' });
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
        detection={detection}
      />
    );
    expect(screen.getByText('OK', { selector: 'span' })).toBeInTheDocument();
  });

  it('検知結果NGの場合、検知: NGと表示する', () => {
    const detection = createDetectionResult({ ratio: 3.0, type: 'text' });
    render(
      <ContrastBadges
        expectedOk={false}
        expectedRatio="3.0:1"
        requiredRatio="4.5"
        detection={detection}
      />
    );
    expect(screen.getByText('NG', { selector: 'span' })).toBeInTheDocument();
  });

  it('基準値を表示する', () => {
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="4.5:1"
        requiredRatio="4.5"
        detection={null}
      />
    );
    expect(screen.getByText('基準: 4.5:1')).toBeInTheDocument();
  });

  it('制限事項がある場合、表示する', () => {
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="4.5:1"
        requiredRatio="4.5"
        detection={null}
        limitation="フォーカス時のみ表示"
      />
    );
    expect(screen.getByText('フォーカス時のみ表示')).toBeInTheDocument();
  });

  it('制限事項がない場合、表示しない', () => {
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="4.5:1"
        requiredRatio="4.5"
        detection={null}
      />
    );
    expect(screen.queryByText('フォーカス時のみ表示')).not.toBeInTheDocument();
  });

  it('検知タイプを表示する', () => {
    const detection = createDetectionResult({ ratio: 5.0, type: 'border' });
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
        detection={detection}
      />
    );
    expect(screen.getByText('[ボーダー]')).toBeInTheDocument();
  });

  it('検知比率を表示する', () => {
    const detection = createDetectionResult({ ratio: 5.5, type: 'text' });
    render(
      <ContrastBadges
        expectedOk={true}
        expectedRatio="4.5:1"
        requiredRatio="4.5"
        detection={detection}
      />
    );
    // 検知バッジに表示される比率を確認（期待値とは異なる値を使用）
    expect(screen.getByText('(5.5:1)')).toBeInTheDocument();
  });
});
