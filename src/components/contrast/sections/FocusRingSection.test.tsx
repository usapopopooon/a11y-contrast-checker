import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FocusRingSection } from './FocusRingSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 8.0,
    color: 'rgb(37, 99, 235)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'focusRing',
  }),
}));

describe('FocusRingSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<FocusRingSection />);
    expect(
      screen.getByText('フォーカスリング（基準 3:1）')
    ).toBeInTheDocument();
  });

  it('濃いフォーカスリングのテストカードを表示する', () => {
    render(<FocusRingSection />);
    expect(screen.getByText('濃いフォーカスリング（OK）')).toBeInTheDocument();
  });

  it('薄いフォーカスリングのテストカードを表示する', () => {
    render(<FocusRingSection />);
    expect(screen.getByText('薄いフォーカスリング（NG）')).toBeInTheDocument();
  });

  it('フォーカスリングボタンを表示する', () => {
    render(<FocusRingSection />);
    expect(
      screen.getByRole('button', { name: '濃いフォーカスリング' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '薄いフォーカスリング（見えにくい）' })
    ).toBeInTheDocument();
  });
});
