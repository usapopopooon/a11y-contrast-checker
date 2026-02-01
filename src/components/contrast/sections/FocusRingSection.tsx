import { TestCard } from '../TestCard';

/**
 * フォーカスリング（基準 3:1）セクション
 */
export function FocusRingSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        フォーカスリング（基準 3:1）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLButtonElement>
          title="濃いフォーカスリング（OK）"
          expectedOk={true}
          expectedRatio="8:1"
          requiredRatio="3.0"
          limitation="フォーカス時のみ表示"
          description="クリックしてフォーカスを確認"
          detectionOptions={{ detectFocusRing: true, focusRingDelay: 200 }}
        >
          {(ref) => (
            <button
              ref={ref}
              className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              濃いフォーカスリング
            </button>
          )}
        </TestCard>

        <TestCard<HTMLButtonElement>
          title="薄いフォーカスリング（NG）"
          expectedOk={false}
          expectedRatio="1.5:1"
          requiredRatio="3.0"
          limitation="フォーカス時のみ表示"
          description="クリックしてフォーカスを確認"
          detectionOptions={{ detectFocusRing: true, focusRingDelay: 200 }}
        >
          {(ref) => (
            <button
              ref={ref}
              className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              薄いフォーカスリング（見えにくい）
            </button>
          )}
        </TestCard>
      </div>
    </section>
  );
}
