import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisabledSection } from './DisabledSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 2.5,
    color: 'rgb(156, 163, 175)',
    bgColor: 'rgb(243, 244, 246)',
    type: 'text',
  }),
}));

describe('DisabledSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<DisabledSection />);
    expect(
      screen.getByText('無効状態（WCAG免除だが考慮推奨）')
    ).toBeInTheDocument();
  });

  it('無効なボタンのテストカードを表示する', () => {
    render(<DisabledSection />);
    // タイトルとボタンテキストの両方に「無効なボタン」が含まれる
    expect(screen.getAllByText('無効なボタン')).toHaveLength(2);
  });

  it('無効なインプットのテストカードを表示する', () => {
    render(<DisabledSection />);
    // タイトルに「無効なインプット」が含まれる
    expect(screen.getByText('無効なインプット')).toBeInTheDocument();
  });

  it('無効なボタンが無効化されている', () => {
    render(<DisabledSection />);
    const button = screen.getByRole('button', { name: '無効なボタン' });
    expect(button).toBeDisabled();
  });

  it('無効なインプットが無効化されている', () => {
    render(<DisabledSection />);
    const input = screen.getByLabelText('無効な入力フィールドサンプル');
    expect(input).toBeDisabled();
  });
});
