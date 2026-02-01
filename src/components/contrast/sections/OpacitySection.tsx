import { TestCard } from '../TestCard';

/**
 * エッジケース - opacityプロパティセクション
 */
export function OpacitySection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        エッジケース - opacityプロパティ
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLParagraphElement>
          title="opacity: 0.8（OK）"
          expectedOk={true}
          expectedRatio="8:1"
          requiredRatio="4.5"
          description="黒テキストにopacity: 0.8でも十分なコントラスト"
        >
          {(ref) => (
            <p ref={ref} className="text-gray-900 opacity-80">
              opacity: 0.8 のテキスト
            </p>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="opacity: 0.3（NG）"
          expectedOk={false}
          expectedRatio="2:1"
          requiredRatio="4.5"
          description="黒テキストでもopacity: 0.3だとコントラスト不足"
        >
          {(ref) => (
            <p ref={ref} className="text-gray-900 opacity-30">
              opacity: 0.3 のテキスト
            </p>
          )}
        </TestCard>
      </div>
    </section>
  );
}
