import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CssFilterSection } from './CssFilterSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 8.0,
    color: 'rgb(17, 24, 39)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('CssFilterSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<CssFilterSection />);
    expect(
      screen.getByText('エッジケース - CSSフィルター')
    ).toBeInTheDocument();
  });

  it('brightnessフィルターのテストカードを表示する', () => {
    render(<CssFilterSection />);
    expect(screen.getByText('brightness(0.8)フィルター')).toBeInTheDocument();
  });

  it('contrastフィルターのテストカードを表示する', () => {
    render(<CssFilterSection />);
    expect(screen.getByText('contrast(0.5)フィルター')).toBeInTheDocument();
  });

  it('フィルター適用テキストを表示する', () => {
    render(<CssFilterSection />);
    expect(
      screen.getByText('brightness(0.8)が適用されたテキスト')
    ).toBeInTheDocument();
    expect(
      screen.getByText('contrast(0.5)が適用されたテキスト')
    ).toBeInTheDocument();
  });
});
