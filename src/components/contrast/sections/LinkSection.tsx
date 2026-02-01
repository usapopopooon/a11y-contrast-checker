import { TestCard } from '../TestCard';

/**
 * リンク（基準: 背景と4.5:1、周囲テキストと3:1または下線）セクション
 */
export function LinkSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        リンク（基準: 背景と4.5:1、周囲テキストと3:1または下線）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLAnchorElement>
          title="下線付きリンク（OK）"
          expectedOk={true}
          expectedRatio="4.5:1"
          requiredRatio="4.5"
          description="通常のテキストに上のリンクが含まれています。"
        >
          {(ref) => (
            <a
              ref={ref}
              href="https://example.com"
              className="text-blue-600 underline"
            >
              下線付きリンク
            </a>
          )}
        </TestCard>

        <TestCard<HTMLAnchorElement>
          title="下線なし（区別不足）"
          expectedOk={false}
          expectedRatio="1.2:1"
          requiredRatio="3.0"
          limitation="下線なしの場合、周囲テキストと3:1以上必要"
          description="上のリンクは周囲テキストと区別困難。"
        >
          {(ref) => (
            <a
              ref={ref}
              href="https://example.org"
              className="text-gray-600 no-underline"
            >
              下線なしリンク
            </a>
          )}
        </TestCard>
      </div>
    </section>
  );
}
