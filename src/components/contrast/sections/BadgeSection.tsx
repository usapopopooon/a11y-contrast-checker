import { TestCard } from '../TestCard';

/**
 * UIコンポーネント - バッジセクション
 */
export function BadgeSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        UIコンポーネント - バッジ
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLSpanElement>
          title="成功バッジ（OK）"
          expectedOk={true}
          expectedRatio="5.1:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <span
              ref={ref}
              className="text-green-800 bg-green-100 px-2 py-1 rounded text-sm inline-block"
            >
              緑のバッジテキスト
            </span>
          )}
        </TestCard>

        <TestCard<HTMLSpanElement>
          title="薄いバッジ（NG）"
          expectedOk={false}
          expectedRatio="1.6:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <span
              ref={ref}
              className="text-gray-300 bg-gray-100 px-2 py-1 rounded text-sm inline-block"
            >
              薄いグレーのバッジテキスト
            </span>
          )}
        </TestCard>
      </div>
    </section>
  );
}
