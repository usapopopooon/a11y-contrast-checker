import { TestCard } from '../TestCard';

/**
 * 大きいテキスト（基準 3:1）セクション
 */
export function LargeTextSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        大きいテキスト（基準 3:1）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLSpanElement>
          title="24px太字（OK）"
          expectedOk={true}
          expectedRatio="4.5:1"
          requiredRatio="3.0"
        >
          {(ref) => (
            <span ref={ref} className="block text-2xl font-bold text-gray-500">
              24px太字のサンプルテキスト
            </span>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="16px通常（ギリギリOK）"
          expectedOk={true}
          expectedRatio="4.8:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <p ref={ref} className="text-base text-gray-500">
              gray-500は4.8:1で4.5:1をギリギリクリア
            </p>
          )}
        </TestCard>
      </div>
    </section>
  );
}
