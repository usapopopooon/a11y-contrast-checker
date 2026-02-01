import { Search, Bell, Settings, Heart } from 'lucide-react';
import { TestCard } from '../TestCard';

/**
 * 非テキスト - アイコン（基準 3:1）セクション
 */
export function IconSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
        非テキスト - アイコン（基準 3:1）
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestCard<HTMLDivElement>
          title="濃いアイコン（OK）"
          expectedOk={true}
          expectedRatio="10:1"
          requiredRatio="3.0"
          description="gray-700は白背景に対して十分なコントラスト"
          detectionOptions={{ prioritizeSvg: true }}
        >
          {(ref) => (
            <>
              <div ref={ref} className="inline-block">
                <Search className="w-6 h-6 text-gray-700" aria-label="検索" />
              </div>
              <div className="flex gap-4 items-center mt-2">
                <Bell className="w-6 h-6 text-gray-700" aria-label="通知" />
                <Settings className="w-6 h-6 text-gray-700" aria-label="設定" />
                <Heart
                  className="w-6 h-6 text-gray-700"
                  aria-label="お気に入り"
                />
              </div>
            </>
          )}
        </TestCard>

        <TestCard<HTMLDivElement>
          title="薄いアイコン（NG）"
          expectedOk={false}
          expectedRatio="1.5:1"
          requiredRatio="3.0"
          description="gray-300は白背景に対してコントラスト不足"
          detectionOptions={{ prioritizeSvg: true }}
        >
          {(ref) => (
            <>
              <div ref={ref} className="inline-block">
                <Search className="w-6 h-6 text-gray-300" aria-label="検索" />
              </div>
              <div className="flex gap-4 items-center mt-2">
                <Bell className="w-6 h-6 text-gray-300" aria-label="通知" />
                <Settings className="w-6 h-6 text-gray-300" aria-label="設定" />
                <Heart
                  className="w-6 h-6 text-gray-300"
                  aria-label="お気に入り"
                />
              </div>
            </>
          )}
        </TestCard>
      </div>
    </section>
  );
}
