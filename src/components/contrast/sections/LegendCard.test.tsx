import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LegendCard } from './LegendCard';

describe('LegendCard', () => {
  it('タイトルを表示する', () => {
    render(<LegendCard />);

    expect(screen.getByText('バッジの見方')).toBeInTheDocument();
  });

  it('期待値の説明を表示する', () => {
    render(<LegendCard />);

    expect(screen.getByText('期待値（手動設定）')).toBeInTheDocument();
    expect(screen.getByText('期待: OK')).toBeInTheDocument();
    expect(screen.getByText('期待: NG')).toBeInTheDocument();
  });

  it('検知結果の説明を表示する', () => {
    render(<LegendCard />);

    expect(screen.getByText('検知結果（自動計算）')).toBeInTheDocument();
    expect(screen.getByText('検知: OK')).toBeInTheDocument();
    expect(screen.getByText('検知: NG')).toBeInTheDocument();
  });

  it('基準クリアの設定を説明する', () => {
    render(<LegendCard />);

    expect(screen.getByText('基準クリアの設定')).toBeInTheDocument();
  });

  it('違反例の設定を説明する', () => {
    render(<LegendCard />);

    expect(screen.getByText('違反例の設定')).toBeInTheDocument();
  });
});
