import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestCard } from './TestCard';

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

describe('TestCard', () => {
  it('タイトルを表示する', () => {
    render(
      <TestCard<HTMLParagraphElement>
        title="テストタイトル"
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
      >
        {(ref) => <p ref={ref}>テスト内容</p>}
      </TestCard>
    );

    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
  });

  it('子要素を表示する', () => {
    render(
      <TestCard<HTMLParagraphElement>
        title="テスト"
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
      >
        {(ref) => <p ref={ref}>子要素のテキスト</p>}
      </TestCard>
    );

    expect(screen.getByText('子要素のテキスト')).toBeInTheDocument();
  });

  it('説明文がある場合に表示する', () => {
    render(
      <TestCard<HTMLParagraphElement>
        title="テスト"
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
        description="これは説明文です"
      >
        {(ref) => <p ref={ref}>内容</p>}
      </TestCard>
    );

    expect(screen.getByText('これは説明文です')).toBeInTheDocument();
  });

  it('説明文がない場合は表示しない', () => {
    render(
      <TestCard<HTMLParagraphElement>
        title="テスト"
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
      >
        {(ref) => <p ref={ref}>内容</p>}
      </TestCard>
    );

    expect(screen.queryByText('これは説明文です')).not.toBeInTheDocument();
  });

  it('期待OKバッジを表示する', () => {
    render(
      <TestCard<HTMLParagraphElement>
        title="テスト"
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
      >
        {(ref) => <p ref={ref}>内容</p>}
      </TestCard>
    );

    expect(screen.getByText('期待: OK')).toBeInTheDocument();
  });

  it('期待NGバッジを表示する', () => {
    render(
      <TestCard<HTMLParagraphElement>
        title="テスト"
        expectedOk={false}
        expectedRatio="3.0:1"
        requiredRatio="4.5"
      >
        {(ref) => <p ref={ref}>内容</p>}
      </TestCard>
    );

    expect(screen.getByText('期待: NG')).toBeInTheDocument();
  });

  it('制限事項がある場合に表示する', () => {
    render(
      <TestCard<HTMLParagraphElement>
        title="テスト"
        expectedOk={true}
        expectedRatio="5.0:1"
        requiredRatio="4.5"
        limitation="jsdomでは対応していません"
      >
        {(ref) => <p ref={ref}>内容</p>}
      </TestCard>
    );

    expect(screen.getByText('jsdomでは対応していません')).toBeInTheDocument();
  });
});
