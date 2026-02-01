import { TestCard } from '../TestCard';

/**
 * エッジケース - CSSフィルターセクション
 */
export function CssFilterSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        エッジケース - CSSフィルター
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLParagraphElement>
          title="brightness(0.8)フィルター"
          expectedOk={true}
          expectedRatio="~8:1"
          requiredRatio="4.5"
          limitation="CSSフィルターの影響は警告として検出"
          description="brightnessフィルターでコントラストが変化する可能性"
        >
          {(ref) => (
            <p
              ref={ref}
              className="text-gray-900"
              style={{ filter: 'brightness(0.8)' }}
            >
              brightness(0.8)が適用されたテキスト
            </p>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="contrast(0.5)フィルター"
          expectedOk={false}
          expectedRatio="~3:1"
          requiredRatio="4.5"
          limitation="CSSフィルターの影響は警告として検出"
          description="contrastフィルターでコントラストが低下"
        >
          {(ref) => (
            <p
              ref={ref}
              className="text-gray-900"
              style={{ filter: 'contrast(0.5)' }}
            >
              contrast(0.5)が適用されたテキスト
            </p>
          )}
        </TestCard>
      </div>
    </section>
  );
}
