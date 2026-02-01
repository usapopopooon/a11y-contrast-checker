import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WcagStandardsCard } from './WcagStandardsCard';

describe('WcagStandardsCard', () => {
  it('タイトルを表示する', () => {
    render(<WcagStandardsCard />);

    expect(screen.getByText('WCAG 2.1 AA基準')).toBeInTheDocument();
  });

  it('テキスト基準のセクションを表示する', () => {
    render(<WcagStandardsCard />);

    expect(screen.getByText('テキスト (1.4.3)')).toBeInTheDocument();
  });

  it('通常テキストの基準を表示する', () => {
    render(<WcagStandardsCard />);

    expect(
      screen.getByText('通常テキスト（18px未満）: 4.5:1 以上')
    ).toBeInTheDocument();
  });

  it('大きいテキストの基準を表示する', () => {
    render(<WcagStandardsCard />);

    expect(
      screen.getByText('大きいテキスト（18px以上/14px太字）: 3:1 以上')
    ).toBeInTheDocument();
  });

  it('非テキスト基準のセクションを表示する', () => {
    render(<WcagStandardsCard />);

    expect(screen.getByText('非テキスト (1.4.11)')).toBeInTheDocument();
  });

  it('UIコンポーネントの基準を表示する', () => {
    render(<WcagStandardsCard />);

    expect(
      screen.getByText('UIコンポーネント境界線: 3:1 以上')
    ).toBeInTheDocument();
  });

  it('アイコン・グラフィックの基準を表示する', () => {
    render(<WcagStandardsCard />);

    expect(
      screen.getByText('アイコン・グラフィック: 3:1 以上')
    ).toBeInTheDocument();
  });
});
