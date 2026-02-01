import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BadgeSection } from './BadgeSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 5.0,
    color: 'rgb(0, 100, 0)',
    bgColor: 'rgb(200, 255, 200)',
    type: 'text',
  }),
}));

describe('BadgeSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<BadgeSection />);
    expect(screen.getByText('UIコンポーネント - バッジ')).toBeInTheDocument();
  });

  it('成功バッジのテストカードを表示する', () => {
    render(<BadgeSection />);
    expect(screen.getByText('成功バッジ（OK）')).toBeInTheDocument();
  });

  it('薄いバッジのテストカードを表示する', () => {
    render(<BadgeSection />);
    expect(screen.getByText('薄いバッジ（NG）')).toBeInTheDocument();
  });

  it('バッジ要素を表示する', () => {
    render(<BadgeSection />);
    expect(screen.getByText('緑のバッジテキスト')).toBeInTheDocument();
    expect(screen.getByText('薄いグレーのバッジテキスト')).toBeInTheDocument();
  });
});
