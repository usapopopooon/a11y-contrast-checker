import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LargeTextSection } from './LargeTextSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 4.5,
    color: 'rgb(107, 114, 128)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('LargeTextSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<LargeTextSection />);
    expect(screen.getByText('大きいテキスト（基準 3:1）')).toBeInTheDocument();
  });

  it('24px太字のテストカードを表示する', () => {
    render(<LargeTextSection />);
    expect(screen.getByText('24px太字（OK）')).toBeInTheDocument();
  });

  it('16px通常のテストカードを表示する', () => {
    render(<LargeTextSection />);
    expect(screen.getByText('16px通常（ギリギリOK）')).toBeInTheDocument();
  });

  it('サンプルテキストを表示する', () => {
    render(<LargeTextSection />);
    expect(screen.getByText('24px太字のサンプルテキスト')).toBeInTheDocument();
    expect(
      screen.getByText('gray-500は4.8:1で4.5:1をギリギリクリア')
    ).toBeInTheDocument();
  });
});
