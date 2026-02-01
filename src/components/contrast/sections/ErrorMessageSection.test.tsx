import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessageSection } from './ErrorMessageSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 4.5,
    color: 'rgb(185, 28, 28)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('ErrorMessageSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<ErrorMessageSection />);
    expect(
      screen.getByText('エラーメッセージ（基準 4.5:1）')
    ).toBeInTheDocument();
  });

  it('濃いエラーメッセージのテストカードを表示する', () => {
    render(<ErrorMessageSection />);
    expect(screen.getByText('濃いエラーメッセージ（OK）')).toBeInTheDocument();
  });

  it('薄いエラーメッセージのテストカードを表示する', () => {
    render(<ErrorMessageSection />);
    expect(screen.getByText('薄いエラーメッセージ（NG）')).toBeInTheDocument();
  });

  it('エラーメッセージのテキストを表示する', () => {
    render(<ErrorMessageSection />);
    expect(
      screen.getByText('入力値が無効です。正しい形式で入力してください。')
    ).toBeInTheDocument();
    expect(
      screen.getByText('このエラーメッセージは読みにくい')
    ).toBeInTheDocument();
  });
});
