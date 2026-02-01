import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BorderSection } from './BorderSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 4.5,
    color: 'rgb(100, 100, 100)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'border',
  }),
}));

describe('BorderSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<BorderSection />);
    expect(
      screen.getByText('非テキスト - UIコンポーネント境界線（基準 3:1）')
    ).toBeInTheDocument();
  });

  it('濃い境界線のテストカードを表示する', () => {
    render(<BorderSection />);
    expect(screen.getByText('濃い境界線（OK）')).toBeInTheDocument();
  });

  it('薄い境界線のテストカードを表示する', () => {
    render(<BorderSection />);
    expect(screen.getByText('薄い境界線（NG）')).toBeInTheDocument();
  });

  it('入力フィールドを表示する', () => {
    render(<BorderSection />);
    expect(
      screen.getByLabelText('濃いグレーの境界線サンプル')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('薄いグレーの境界線サンプル')
    ).toBeInTheDocument();
  });
});
