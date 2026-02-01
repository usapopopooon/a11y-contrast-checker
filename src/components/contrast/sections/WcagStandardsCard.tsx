import { Card, CardContent } from '@/components/ui/card';

/**
 * WCAG 2.1 AA基準説明カード
 */
export function WcagStandardsCard() {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <h2 className="font-bold text-blue-900 mb-2 text-lg">
          WCAG 2.1 AA基準
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-blue-800 mb-1 text-base">
              テキスト (1.4.3)
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>通常テキスト（18px未満）: 4.5:1 以上</li>
              <li>大きいテキスト（18px以上/14px太字）: 3:1 以上</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-1 text-base">
              非テキスト (1.4.11)
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>UIコンポーネント境界線: 3:1 以上</li>
              <li>アイコン・グラフィック: 3:1 以上</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
