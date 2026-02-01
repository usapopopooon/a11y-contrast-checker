import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BasicTextSection } from './BasicTextSection';

// useContrastDetectionをモック
vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 5.0,
    color: 'rgb(0, 0, 0)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('BasicTextSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<BasicTextSection />);

    expect(screen.getByText('基本テキスト')).toBeInTheDocument();
  });

  it('十分なコントラストのテストカードを表示する', () => {
    render(<BasicTextSection />);

    expect(screen.getByText('十分なコントラスト')).toBeInTheDocument();
  });

  it('低コントラストのテストカードを表示する', () => {
    render(<BasicTextSection />);

    expect(screen.getByText('低コントラスト')).toBeInTheDocument();
  });
});
