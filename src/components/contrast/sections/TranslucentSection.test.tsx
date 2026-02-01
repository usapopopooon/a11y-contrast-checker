import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TranslucentSection } from './TranslucentSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 7.0,
    color: 'rgba(0, 0, 0, 0.7)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('TranslucentSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<TranslucentSection />);
    expect(screen.getByText('エッジケース - 半透明色')).toBeInTheDocument();
  });

  it('半透明テキストOKのテストカードを表示する', () => {
    render(<TranslucentSection />);
    expect(screen.getByText('半透明テキスト（OK）')).toBeInTheDocument();
  });

  it('半透明テキストNGのテストカードを表示する', () => {
    render(<TranslucentSection />);
    expect(screen.getByText('半透明テキスト（NG）')).toBeInTheDocument();
  });

  it('半透明テキストを表示する', () => {
    render(<TranslucentSection />);
    expect(
      screen.getByText('半透明の黒テキスト（70%不透明度）')
    ).toBeInTheDocument();
    expect(
      screen.getByText('半透明の黒テキスト（30%不透明度）')
    ).toBeInTheDocument();
  });
});
