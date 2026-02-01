import { TestCard } from '../TestCard';

/**
 * 非テキスト - UIコンポーネント境界線（基準 3:1）セクション
 */
export function BorderSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        非テキスト - UIコンポーネント境界線（基準 3:1）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLInputElement>
          title="濃い境界線（OK）"
          expectedOk={true}
          expectedRatio="4.5:1"
          requiredRatio="3.0"
          detectionOptions={{ prioritizeBorder: true }}
        >
          {(ref) => (
            <input
              ref={ref}
              type="text"
              placeholder="濃いグレーの境界線"
              aria-label="濃いグレーの境界線サンプル"
              className="w-full px-3 py-2 border-2 border-gray-500 rounded-md"
            />
          )}
        </TestCard>

        <TestCard<HTMLInputElement>
          title="薄い境界線（NG）"
          expectedOk={false}
          expectedRatio="1.5:1"
          requiredRatio="3.0"
          detectionOptions={{ prioritizeBorder: true }}
        >
          {(ref) => (
            <input
              ref={ref}
              type="text"
              placeholder="薄いグレーの境界線"
              aria-label="薄いグレーの境界線サンプル"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md"
            />
          )}
        </TestCard>
      </div>
    </section>
  );
}
