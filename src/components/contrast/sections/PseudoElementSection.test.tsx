import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PseudoElementSection } from './PseudoElementSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 12.0,
    color: 'rgb(17, 24, 39)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('PseudoElementSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<PseudoElementSection />);
    expect(
      screen.getByText('エッジケース - 疑似要素（::before/::after）')
    ).toBeInTheDocument();
  });

  it('::before疑似要素OKのテストカードを表示する', () => {
    render(<PseudoElementSection />);
    expect(screen.getByText('::before疑似要素（OK）')).toBeInTheDocument();
  });

  it('::before疑似要素NGのテストカードを表示する', () => {
    render(<PseudoElementSection />);
    expect(screen.getByText('::before疑似要素（NG）')).toBeInTheDocument();
  });

  it('疑似要素テキストを表示する', () => {
    render(<PseudoElementSection />);
    expect(screen.getByText('星マーク付きテキスト')).toBeInTheDocument();
    expect(screen.getByText('薄い星マーク付きテキスト')).toBeInTheDocument();
  });
});
