import { TestCard } from '../TestCard';

/**
 * フォーム要素セクション
 */
export function FormSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">フォーム要素</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLSpanElement>
          title="通常のラベル"
          expectedOk={true}
          expectedRatio="12.6:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <span ref={ref} className="text-foreground font-medium text-sm">
              メールアドレス
            </span>
          )}
        </TestCard>

        <TestCard<HTMLSpanElement>
          title="薄いラベル"
          expectedOk={false}
          expectedRatio="1.7:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <span ref={ref} className="text-gray-300 font-medium text-sm">
              パスワード（読みにくい）
            </span>
          )}
        </TestCard>
      </div>
    </section>
  );
}
