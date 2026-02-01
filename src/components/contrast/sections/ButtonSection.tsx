import { TestCard } from '../TestCard';

/**
 * UIコンポーネント - ボタンセクション
 */
export function ButtonSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        UIコンポーネント - ボタン
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLParagraphElement>
          title="プライマリボタン（OK）"
          expectedOk={true}
          expectedRatio="12.6:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <p
              ref={ref}
              className="text-primary-foreground bg-primary px-4 py-2 rounded-md text-sm inline-block"
            >
              プライマリボタンのテキスト
            </p>
          )}
        </TestCard>

        <TestCard<HTMLParagraphElement>
          title="ゴーストボタン（NG）"
          expectedOk={false}
          expectedRatio="1.7:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <p ref={ref} className="text-gray-300 px-4 py-2 text-sm">
              薄いグレー（#d1d5db）のテキスト
            </p>
          )}
        </TestCard>
      </div>
    </section>
  );
}
