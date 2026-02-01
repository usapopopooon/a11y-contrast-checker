import { TestCard } from '../TestCard';

/**
 * エッジケース - 半透明色セクション
 */
export function TranslucentSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        エッジケース - 半透明色
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLParagraphElement>
          title="半透明テキスト（OK）"
          expectedOk={true}
          expectedRatio="7:1"
          requiredRatio="4.5"
          description="rgba(0,0,0,0.7)は白背景とブレンドして十分なコントラスト"
        >
          {(ref) => (
            <p ref={ref} style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
              半透明の黒テキスト（70%不透明度）
            </p>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="半透明テキスト（NG）"
          expectedOk={false}
          expectedRatio="2.5:1"
          requiredRatio="4.5"
          description="rgba(0,0,0,0.3)は白背景とブレンドしてコントラスト不足"
        >
          {(ref) => (
            <p ref={ref} style={{ color: 'rgba(0, 0, 0, 0.3)' }}>
              半透明の黒テキスト（30%不透明度）
            </p>
          )}
        </TestCard>
      </div>
    </section>
  );
}
