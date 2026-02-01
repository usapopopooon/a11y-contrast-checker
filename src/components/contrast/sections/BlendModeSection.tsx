import { TestCard } from '../TestCard';

/**
 * エッジケース - mix-blend-modeセクション
 */
export function BlendModeSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        エッジケース - mix-blend-mode
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLParagraphElement>
          title="mix-blend-mode: multiply"
          expectedOk={true}
          expectedRatio="~10:1"
          requiredRatio="4.5"
          limitation="ブレンドモードの影響は警告として検出"
          description="multiplyは暗い色をより暗くする"
        >
          {(ref) => (
            <div className="bg-blue-100 p-4 rounded">
              <p
                ref={ref}
                className="text-gray-900"
                style={{ mixBlendMode: 'multiply' }}
              >
                multiply ブレンドモードのテキスト
              </p>
            </div>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="mix-blend-mode: screen"
          expectedOk={false}
          expectedRatio="~2:1"
          requiredRatio="4.5"
          limitation="ブレンドモードの影響は警告として検出"
          description="screenは明るい色をより明るくする"
        >
          {(ref) => (
            <div className="bg-gray-200 p-4 rounded">
              <p
                ref={ref}
                className="text-gray-500"
                style={{ mixBlendMode: 'screen' }}
              >
                screen ブレンドモードのテキスト
              </p>
            </div>
          )}
        </TestCard>
      </div>
    </section>
  );
}
