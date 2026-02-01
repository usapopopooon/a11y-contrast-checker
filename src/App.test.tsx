import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// セクションコンポーネントをモック
vi.mock('@/components/contrast/sections', () => ({
  LegendCard: () => <div data-testid="legend-card">LegendCard</div>,
  WcagStandardsCard: () => (
    <div data-testid="wcag-standards-card">WcagStandardsCard</div>
  ),
  BasicTextSection: () => (
    <section data-testid="basic-text-section">BasicTextSection</section>
  ),
  GradientSection: () => (
    <section data-testid="gradient-section">GradientSection</section>
  ),
  ImageBackgroundSection: () => (
    <section data-testid="image-background-section">
      ImageBackgroundSection
    </section>
  ),
  ButtonSection: () => (
    <section data-testid="button-section">ButtonSection</section>
  ),
  BadgeSection: () => (
    <section data-testid="badge-section">BadgeSection</section>
  ),
  FormSection: () => <section data-testid="form-section">FormSection</section>,
  LargeTextSection: () => (
    <section data-testid="large-text-section">LargeTextSection</section>
  ),
  BorderSection: () => (
    <section data-testid="border-section">BorderSection</section>
  ),
  IconSection: () => <section data-testid="icon-section">IconSection</section>,
  PlaceholderSection: () => (
    <section data-testid="placeholder-section">PlaceholderSection</section>
  ),
  LinkSection: () => <section data-testid="link-section">LinkSection</section>,
  FocusRingSection: () => (
    <section data-testid="focus-ring-section">FocusRingSection</section>
  ),
  ErrorMessageSection: () => (
    <section data-testid="error-message-section">ErrorMessageSection</section>
  ),
  TranslucentSection: () => (
    <section data-testid="translucent-section">TranslucentSection</section>
  ),
  OpacitySection: () => (
    <section data-testid="opacity-section">OpacitySection</section>
  ),
  PseudoElementSection: () => (
    <section data-testid="pseudo-element-section">PseudoElementSection</section>
  ),
  CssFilterSection: () => (
    <section data-testid="css-filter-section">CssFilterSection</section>
  ),
  BlendModeSection: () => (
    <section data-testid="blend-mode-section">BlendModeSection</section>
  ),
  DisabledSection: () => (
    <section data-testid="disabled-section">DisabledSection</section>
  ),
}));

describe('App', () => {
  it('ヘッダーを表示する', () => {
    render(<App />);

    expect(screen.getByText('A11y Contrast Checker')).toBeInTheDocument();
    expect(
      screen.getByText('WCAG AA基準のコントラスト比をチェックするデモページ')
    ).toBeInTheDocument();
  });

  it('フッターを表示する', () => {
    render(<App />);

    expect(screen.getByText(/WCAG 2.1 AA基準/)).toBeInTheDocument();
    expect(screen.getByText('4.5:1')).toBeInTheDocument();
    expect(screen.getAllByText('3:1')).toHaveLength(2);
  });

  it('凡例カードを表示する', () => {
    render(<App />);

    expect(screen.getByTestId('legend-card')).toBeInTheDocument();
  });

  it('WCAG基準カードを表示する', () => {
    render(<App />);

    expect(screen.getByTestId('wcag-standards-card')).toBeInTheDocument();
  });

  it('基本テキストセクションを表示する', () => {
    render(<App />);

    expect(screen.getByTestId('basic-text-section')).toBeInTheDocument();
  });

  it('グラデーションセクションを表示する', () => {
    render(<App />);

    expect(screen.getByTestId('gradient-section')).toBeInTheDocument();
  });

  it('ボタンセクションを表示する', () => {
    render(<App />);

    expect(screen.getByTestId('button-section')).toBeInTheDocument();
  });

  it('アイコンセクションを表示する', () => {
    render(<App />);

    expect(screen.getByTestId('icon-section')).toBeInTheDocument();
  });

  it('フォーカスリングセクションを表示する', () => {
    render(<App />);

    expect(screen.getByTestId('focus-ring-section')).toBeInTheDocument();
  });

  it('全てのセクションを表示する', () => {
    render(<App />);

    // 全21セクションが表示されることを確認
    expect(screen.getByTestId('legend-card')).toBeInTheDocument();
    expect(screen.getByTestId('wcag-standards-card')).toBeInTheDocument();
    expect(screen.getByTestId('basic-text-section')).toBeInTheDocument();
    expect(screen.getByTestId('gradient-section')).toBeInTheDocument();
    expect(screen.getByTestId('image-background-section')).toBeInTheDocument();
    expect(screen.getByTestId('button-section')).toBeInTheDocument();
    expect(screen.getByTestId('badge-section')).toBeInTheDocument();
    expect(screen.getByTestId('form-section')).toBeInTheDocument();
    expect(screen.getByTestId('large-text-section')).toBeInTheDocument();
    expect(screen.getByTestId('border-section')).toBeInTheDocument();
    expect(screen.getByTestId('icon-section')).toBeInTheDocument();
    expect(screen.getByTestId('placeholder-section')).toBeInTheDocument();
    expect(screen.getByTestId('link-section')).toBeInTheDocument();
    expect(screen.getByTestId('focus-ring-section')).toBeInTheDocument();
    expect(screen.getByTestId('error-message-section')).toBeInTheDocument();
    expect(screen.getByTestId('translucent-section')).toBeInTheDocument();
    expect(screen.getByTestId('opacity-section')).toBeInTheDocument();
    expect(screen.getByTestId('pseudo-element-section')).toBeInTheDocument();
    expect(screen.getByTestId('css-filter-section')).toBeInTheDocument();
    expect(screen.getByTestId('blend-mode-section')).toBeInTheDocument();
    expect(screen.getByTestId('disabled-section')).toBeInTheDocument();
  });
});
