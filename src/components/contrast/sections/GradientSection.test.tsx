import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GradientSection } from './GradientSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 8.0,
    color: 'rgb(255, 255, 255)',
    bgColor: 'rgb(30, 58, 138)',
    type: 'gradient',
  }),
}));

describe('GradientSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<GradientSection />);
    expect(screen.getByText('グラデーション背景')).toBeInTheDocument();
  });

  it('深いブルーのテストカードを表示する', () => {
    render(<GradientSection />);
    expect(screen.getByText('深いブルー（期待: OK）')).toBeInTheDocument();
  });

  it('サンセットのテストカードを表示する', () => {
    render(<GradientSection />);
    expect(screen.getByText('サンセット（期待: NG）')).toBeInTheDocument();
  });

  it('グラデーションテキストを表示する', () => {
    render(<GradientSection />);
    expect(screen.getAllByText('グラデーション上のテキスト')).toHaveLength(2);
  });
});
