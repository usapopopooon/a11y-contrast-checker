import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OpacitySection } from './OpacitySection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 8.0,
    color: 'rgb(17, 24, 39)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('OpacitySection', () => {
  it('セクションタイトルを表示する', () => {
    render(<OpacitySection />);
    expect(
      screen.getByText('エッジケース - opacityプロパティ')
    ).toBeInTheDocument();
  });

  it('opacity 0.8のテストカードを表示する', () => {
    render(<OpacitySection />);
    expect(screen.getByText('opacity: 0.8（OK）')).toBeInTheDocument();
  });

  it('opacity 0.3のテストカードを表示する', () => {
    render(<OpacitySection />);
    expect(screen.getByText('opacity: 0.3（NG）')).toBeInTheDocument();
  });

  it('説明テキストを表示する', () => {
    render(<OpacitySection />);
    expect(screen.getByText('opacity: 0.8 のテキスト')).toBeInTheDocument();
    expect(screen.getByText('opacity: 0.3 のテキスト')).toBeInTheDocument();
  });
});
