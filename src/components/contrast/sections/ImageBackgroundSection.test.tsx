import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageBackgroundSection } from './ImageBackgroundSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 12.0,
    color: 'rgb(255, 255, 255)',
    bgColor: 'rgb(51, 51, 51)',
    type: 'text',
  }),
}));

describe('ImageBackgroundSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<ImageBackgroundSection />);
    expect(screen.getByText('画像背景')).toBeInTheDocument();
  });

  it('モノクロ画像背景のテストカードを表示する', () => {
    render(<ImageBackgroundSection />);
    expect(
      screen.getByText('モノクロ画像背景（期待: OK）')
    ).toBeInTheDocument();
  });

  it('カラー画像背景のテストカードを表示する', () => {
    render(<ImageBackgroundSection />);
    expect(screen.getByText('カラー画像背景（期待: NG）')).toBeInTheDocument();
  });

  it('画像背景上のテキストを表示する', () => {
    render(<ImageBackgroundSection />);
    expect(screen.getAllByText('画像背景上のテキスト')).toHaveLength(2);
  });
});
