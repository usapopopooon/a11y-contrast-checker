import { TestCard } from '../TestCard';

/**
 * 基本テキストセクション
 */
export function BasicTextSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">基本テキスト</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLParagraphElement>
          title="十分なコントラスト"
          expectedOk={true}
          expectedRatio="12.6:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <p ref={ref} className="text-gray-900">
              #333（濃いグレー）と白背景の組み合わせ。読みやすいテキストです。
            </p>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="低コントラスト"
          expectedOk={false}
          expectedRatio="2.3:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <p ref={ref} className="text-gray-400">
              #9ca3af（薄いグレー）と白背景。コントラスト不足で読みにくい。
            </p>
          )}
        </TestCard>
      </div>
    </section>
  );
}
