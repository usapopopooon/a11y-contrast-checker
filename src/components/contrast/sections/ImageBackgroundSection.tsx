import { TestCard } from '../TestCard';

/**
 * 画像背景セクション
 */
export function ImageBackgroundSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">画像背景</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLSpanElement>
          title="モノクロ画像背景（期待: OK）"
          expectedOk={true}
          expectedRatio="12:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <div
              className="p-6 rounded-lg text-white"
              style={{
                backgroundImage:
                  'url("https://picsum.photos/seed/dark/400/200?grayscale")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#333',
              }}
            >
              <span
                ref={ref}
                className="block font-bold text-lg text-white drop-shadow-lg"
              >
                画像背景上のテキスト
              </span>
              <p className="text-sm opacity-90 mt-2 drop-shadow">
                暗い背景なら白文字OK
              </p>
            </div>
          )}
        </TestCard>

        <TestCard<HTMLSpanElement>
          title="カラー画像背景（期待: NG）"
          expectedOk={false}
          expectedRatio="2.0:1"
          requiredRatio="4.5"
        >
          {(ref) => (
            <div
              className="p-6 rounded-lg text-white"
              style={{
                backgroundImage:
                  'url("https://picsum.photos/seed/colorful/400/200")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f0f0f0',
              }}
            >
              <span ref={ref} className="block font-bold text-lg text-white">
                画像背景上のテキスト
              </span>
              <p className="text-sm opacity-90 mt-2">明るい部分で読みにくい</p>
            </div>
          )}
        </TestCard>
      </div>
    </section>
  );
}
