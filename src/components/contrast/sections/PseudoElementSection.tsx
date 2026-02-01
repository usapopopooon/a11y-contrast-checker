import { TestCard } from '../TestCard';

/**
 * エッジケース - 疑似要素（::before/::after）セクション
 */
export function PseudoElementSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        エッジケース - 疑似要素（::before/::after）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLSpanElement>
          title="::before疑似要素（OK）"
          expectedOk={true}
          expectedRatio="12:1"
          requiredRatio="4.5"
          limitation="疑似要素のコントラストは検知が難しい場合あり"
        >
          {(ref) => (
            <span
              ref={ref}
              className="before:content-['★_'] before:text-gray-900"
            >
              星マーク付きテキスト
            </span>
          )}
        </TestCard>

        <TestCard<HTMLSpanElement>
          title="::before疑似要素（NG）"
          expectedOk={false}
          expectedRatio="1.5:1"
          requiredRatio="4.5"
          limitation="疑似要素のコントラストは検知が難しい場合あり"
        >
          {(ref) => (
            <span
              ref={ref}
              className="before:content-['★_'] before:text-gray-300"
            >
              薄い星マーク付きテキスト
            </span>
          )}
        </TestCard>
      </div>
    </section>
  );
}
