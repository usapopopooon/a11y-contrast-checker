import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlaceholderSection } from './PlaceholderSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 4.5,
    color: 'rgb(107, 114, 128)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'placeholder',
  }),
}));

describe('PlaceholderSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<PlaceholderSection />);
    expect(
      screen.getByText('プレースホルダー（基準 4.5:1）')
    ).toBeInTheDocument();
  });

  it('濃いプレースホルダーのテストカードを表示する', () => {
    render(<PlaceholderSection />);
    expect(screen.getByText('濃いプレースホルダー（OK）')).toBeInTheDocument();
  });

  it('薄いプレースホルダーのテストカードを表示する', () => {
    render(<PlaceholderSection />);
    expect(screen.getByText('薄いプレースホルダー（NG）')).toBeInTheDocument();
  });

  it('プレースホルダーテキストを持つinputを表示する', () => {
    render(<PlaceholderSection />);
    expect(
      screen.getByPlaceholderText('gray-500のプレースホルダー')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('gray-300のプレースホルダー（読みにくい）')
    ).toBeInTheDocument();
  });
});
