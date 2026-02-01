import { TestCard } from '../TestCard';

/**
 * エラーメッセージ（基準 4.5:1）セクション
 */
export function ErrorMessageSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        エラーメッセージ（基準 4.5:1）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLParagraphElement>
          title="濃いエラーメッセージ（OK）"
          expectedOk={true}
          expectedRatio="4.5:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <p ref={ref} className="text-red-700 text-sm">
              入力値が無効です。正しい形式で入力してください。
            </p>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="薄いエラーメッセージ（NG）"
          expectedOk={false}
          expectedRatio="2.5:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <p ref={ref} className="text-red-300 text-sm">
              このエラーメッセージは読みにくい
            </p>
          )}
        </TestCard>
      </div>
    </section>
  );
}
