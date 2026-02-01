import { TestCard } from '../TestCard';

/**
 * グラデーション背景セクション
 */
export function GradientSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        グラデーション背景
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLSpanElement>
          title="深いブルー（期待: OK）"
          expectedOk={true}
          expectedRatio="8.6:1"
          requiredRatio="3.0"
        >
          {(ref) => (
            <div className="p-6 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 text-white">
              <span ref={ref} className="block font-bold text-lg text-white">
                グラデーション上のテキスト
              </span>
              <p className="text-sm opacity-90 mt-2">暗い背景に白文字はOK</p>
            </div>
          )}
        </TestCard>

        <TestCard<HTMLSpanElement>
          title="サンセット（期待: NG）"
          expectedOk={false}
          expectedRatio="1.8:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <div className="p-6 rounded-lg bg-gradient-to-br from-red-400 to-yellow-400 text-white">
              <span ref={ref} className="block font-bold text-lg text-white">
                グラデーション上のテキスト
              </span>
              <p className="text-sm opacity-90 mt-2">
                黄色部分で白文字が読みにくい
              </p>
            </div>
          )}
        </TestCard>
      </div>
    </section>
  );
}
