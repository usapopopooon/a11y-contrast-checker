import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonSection } from './ButtonSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 5.0,
    color: 'rgb(0, 0, 0)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('ButtonSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<ButtonSection />);
    expect(screen.getByText('UIコンポーネント - ボタン')).toBeInTheDocument();
  });

  it('プライマリボタンのテストカードを表示する', () => {
    render(<ButtonSection />);
    expect(screen.getByText('プライマリボタン（OK）')).toBeInTheDocument();
  });

  it('ゴーストボタンのテストカードを表示する', () => {
    render(<ButtonSection />);
    expect(screen.getByText('ゴーストボタン（NG）')).toBeInTheDocument();
  });
});
