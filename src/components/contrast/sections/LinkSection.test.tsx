import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinkSection } from './LinkSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 5.0,
    color: 'rgb(0, 0, 255)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'link',
    hasUnderline: true,
  }),
}));

describe('LinkSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<LinkSection />);
    expect(
      screen.getByText(
        'リンク（基準: 背景と4.5:1、周囲テキストと3:1または下線）'
      )
    ).toBeInTheDocument();
  });

  it('下線付きリンクのテストカードを表示する', () => {
    render(<LinkSection />);
    expect(screen.getByText('下線付きリンク（OK）')).toBeInTheDocument();
  });

  it('下線なしリンクのテストカードを表示する', () => {
    render(<LinkSection />);
    expect(screen.getByText('下線なし（区別不足）')).toBeInTheDocument();
  });

  it('リンク要素を表示する', () => {
    render(<LinkSection />);
    expect(screen.getByText('下線付きリンク')).toBeInTheDocument();
    expect(screen.getByText('下線なしリンク')).toBeInTheDocument();
  });
});
