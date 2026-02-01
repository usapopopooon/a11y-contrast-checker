import { TestCard } from '../TestCard';

/**
 * プレースホルダー（基準 4.5:1）セクション
 */
export function PlaceholderSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        プレースホルダー（基準 4.5:1）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLInputElement>
          title="濃いプレースホルダー（OK）"
          expectedOk={true}
          expectedRatio="4.8:1"
          requiredRatio="4.5"
          detectionOptions={{ prioritizePlaceholder: true }}
        >
          {(ref) => (
            <input
              ref={ref}
              type="text"
              placeholder="gray-500のプレースホルダー"
              aria-label="濃いプレースホルダーサンプル"
              className="w-full px-3 py-2 border rounded-md placeholder:text-gray-500"
            />
          )}
        </TestCard>

        <TestCard<HTMLInputElement>
          title="薄いプレースホルダー（NG）"
          expectedOk={false}
          expectedRatio="1.5:1"
          requiredRatio="4.5"
          detectionOptions={{ prioritizePlaceholder: true }}
        >
          {(ref) => (
            <input
              ref={ref}
              type="text"
              placeholder="gray-300のプレースホルダー（読みにくい）"
              aria-label="薄いプレースホルダーサンプル"
              className="w-full px-3 py-2 border rounded-md placeholder:text-gray-300"
            />
          )}
        </TestCard>
      </div>
    </section>
  );
}
