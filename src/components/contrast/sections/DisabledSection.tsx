import { TestCard } from '../TestCard';

/**
 * 無効状態（WCAG免除だが考慮推奨）セクション
 */
export function DisabledSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        無効状態（WCAG免除だが考慮推奨）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLButtonElement>
          title="無効なボタン"
          expectedOk={true}
          expectedRatio="2.5:1"
          requiredRatio="免除"
          limitation="無効状態はWCAG免除。ただしユーザビリティ的には配慮推奨"
        >
          {(ref) => (
            <button
              ref={ref}
              disabled
              className="px-4 py-2 bg-gray-100 text-gray-400 border rounded-md cursor-not-allowed"
            >
              無効なボタン
            </button>
          )}
        </TestCard>

        <TestCard<HTMLInputElement>
          title="無効なインプット"
          expectedOk={true}
          expectedRatio="2.5:1"
          requiredRatio="免除"
          limitation="無効状態はWCAG免除。ただしユーザビリティ的には配慮推奨"
        >
          {(ref) => (
            <input
              ref={ref}
              disabled
              type="text"
              value="変更不可"
              aria-label="無効な入力フィールドサンプル"
              className="w-full px-3 py-2 bg-gray-100 text-gray-400 border rounded-md cursor-not-allowed"
            />
          )}
        </TestCard>
      </div>
    </section>
  );
}
