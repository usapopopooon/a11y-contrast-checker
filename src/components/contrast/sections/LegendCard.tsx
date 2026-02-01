import { Card, CardContent } from '@/components/ui/card';

/**
 * バッジの見方（凡例カード）
 */
export function LegendCard() {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardContent className="pt-6">
        <h2 className="font-bold text-slate-900 mb-3 text-lg">バッジの見方</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-slate-700">期待値（手動設定）</p>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs border border-green-200">
                期待: OK
              </div>
              <span className="text-slate-600">基準クリアの設定</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs border border-red-200">
                期待: NG
              </div>
              <span className="text-slate-600">違反例の設定</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-slate-700">検知結果（自動計算）</p>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs border border-blue-200">
                検知: OK
              </div>
              <span className="text-slate-600">基準クリアを検知</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs border border-orange-200">
                検知: NG
              </div>
              <span className="text-slate-600">違反を検知</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
