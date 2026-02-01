import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormSection } from './FormSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 5.0,
    color: 'rgb(0, 0, 0)',
    bgColor: 'rgb(255, 255, 255)',
    type: 'text',
  }),
}));

describe('FormSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<FormSection />);
    expect(screen.getByText('フォーム要素')).toBeInTheDocument();
  });

  it('通常のラベルのテストカードを表示する', () => {
    render(<FormSection />);
    expect(screen.getByText('通常のラベル')).toBeInTheDocument();
  });

  it('薄いラベルのテストカードを表示する', () => {
    render(<FormSection />);
    expect(screen.getByText('薄いラベル')).toBeInTheDocument();
  });
});
