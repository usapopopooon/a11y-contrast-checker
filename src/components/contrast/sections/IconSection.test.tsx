import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IconSection } from './IconSection';

// useContrastDetectionをモック
vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 5.0,
    color: 'rgb(0, 0, 0)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'svg',
  }),
}));

describe('IconSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<IconSection />);

    expect(
      screen.getByText('非テキスト - アイコン（基準 3:1）')
    ).toBeInTheDocument();
  });

  it('濃いアイコンのテストカードを表示する', () => {
    render(<IconSection />);

    expect(screen.getByText('濃いアイコン（OK）')).toBeInTheDocument();
  });

  it('薄いアイコンのテストカードを表示する', () => {
    render(<IconSection />);

    expect(screen.getByText('薄いアイコン（NG）')).toBeInTheDocument();
  });

  it('アイコンにアクセシブルな名前がある', () => {
    render(<IconSection />);

    // aria-label属性があることを確認
    expect(screen.getAllByLabelText('検索')).toHaveLength(2);
    expect(screen.getAllByLabelText('通知')).toHaveLength(2);
    expect(screen.getAllByLabelText('設定')).toHaveLength(2);
    expect(screen.getAllByLabelText('お気に入り')).toHaveLength(2);
  });
});
