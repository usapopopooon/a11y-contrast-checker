import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlendModeSection } from './BlendModeSection';

vi.mock('@/hooks/useContrastDetection', () => ({
  useContrastDetection: () => ({
    detected: true,
    ratio: 10.0,
    color: 'rgb(17, 24, 39)',
    bgColor: 'rgb(219, 234, 254)',
    type: 'text',
  }),
}));

describe('BlendModeSection', () => {
  it('セクションタイトルを表示する', () => {
    render(<BlendModeSection />);
    expect(
      screen.getByText('エッジケース - mix-blend-mode')
    ).toBeInTheDocument();
  });

  it('multiplyブレンドモードのテストカードを表示する', () => {
    render(<BlendModeSection />);
    expect(screen.getByText('mix-blend-mode: multiply')).toBeInTheDocument();
  });

  it('screenブレンドモードのテストカードを表示する', () => {
    render(<BlendModeSection />);
    expect(screen.getByText('mix-blend-mode: screen')).toBeInTheDocument();
  });

  it('ブレンドモードのテキストを表示する', () => {
    render(<BlendModeSection />);
    expect(
      screen.getByText('multiply ブレンドモードのテキスト')
    ).toBeInTheDocument();
    expect(
      screen.getByText('screen ブレンドモードのテキスト')
    ).toBeInTheDocument();
  });
});
