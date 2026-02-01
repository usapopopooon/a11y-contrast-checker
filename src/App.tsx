import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Bell,
  Settings,
  Heart,
  Eye,
} from 'lucide-react';
import { detectContrast, type DetectionResult } from '@/lib/contrast';

// コントラスト検知フック（レンダリング後に実行）
function useContrastDetection(
  ref: React.RefObject<HTMLElement | null>
): DetectionResult | null {
  const [result, setResult] = useState<DetectionResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) {
        setResult(detectContrast(ref.current));
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [ref]);

  return result;
}

// 期待値と検知結果を表示するコンポーネント
function ContrastBadges({
  expectedOk,
  expectedRatio,
  required,
  detection,
  limitation,
}: {
  expectedOk: boolean;
  expectedRatio: string;
  required: string;
  detection: DetectionResult | null;
  limitation?: string;
}) {
  const requiredNum = parseFloat(required);
  const detectedOk = detection ? detection.ratio >= requiredNum : null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* 期待値バッジ */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          expectedOk
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}
      >
        {expectedOk ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        <span>期待: {expectedOk ? 'OK' : 'NG'}</span>
        <span className="opacity-60">({expectedRatio})</span>
      </div>

      {/* 検知結果バッジ */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          detection
            ? detectedOk
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-orange-100 text-orange-700 border border-orange-200'
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>検知:</span>
        {detection ? (
          <>
            <span>{detectedOk ? 'OK' : 'NG'}</span>
            <span className="opacity-60">({detection.ratio}:1)</span>
          </>
        ) : (
          <span>-</span>
        )}
      </div>

      {/* 基準 */}
      <span className="text-xs text-gray-500">基準: {required}:1</span>

      {/* 制限事項 */}
      {limitation && (
        <span className="text-xs text-amber-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {limitation}
        </span>
      )}
    </div>
  );
}

// 期待値のみ表示（検知不要な場合）
function ExpectedInfo({
  expectedOk,
  expectedRatio,
  required,
  limitation,
}: {
  expectedOk: boolean;
  expectedRatio: string;
  required: string;
  limitation?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* 期待値バッジ */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          expectedOk
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}
      >
        {expectedOk ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        <span>期待: {expectedOk ? 'OK' : 'NG'}</span>
        <span className="opacity-60">({expectedRatio})</span>
      </div>

      {/* 基準 */}
      <span className="text-xs text-gray-500">基準: {required}:1</span>

      {/* 制限事項 */}
      {limitation && (
        <span className="text-xs text-amber-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {limitation}
        </span>
      )}
    </div>
  );
}

// テスト対象テキストのラッパー（検知付き）
function TestText({
  children,
  className,
  expectedOk,
  expectedRatio,
  required,
  limitation,
}: {
  children: React.ReactNode;
  className?: string;
  expectedOk: boolean;
  expectedRatio: string;
  required: string;
  limitation?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const detection = useContrastDetection(ref);

  return (
    <div className="space-y-2">
      <ContrastBadges
        expectedOk={expectedOk}
        expectedRatio={expectedRatio}
        required={required}
        detection={detection}
        limitation={limitation}
      />
      <p ref={ref} className={className}>
        {children}
      </p>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">A11y Contrast Checker</h1>
        <p className="text-lg opacity-90">
          WCAG AA基準のコントラスト比をチェックするデモページ
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* 凡例 */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-3">バッジの見方</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-slate-700">期待値（手動設定）</p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs border border-green-200">
                    期待: OK
                  </div>
                  <span className="text-slate-600">基準クリアの設定</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs border border-red-200">
                    期待: NG
                  </div>
                  <span className="text-slate-600">違反例の設定</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-slate-700">検知結果（自動計算）</p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs border border-blue-200">
                    検知: OK
                  </div>
                  <span className="text-slate-600">基準クリアを検知</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs border border-orange-200">
                    検知: NG
                  </div>
                  <span className="text-slate-600">違反を検知</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>制限:</strong>{' '}
                グラデーション・画像背景は検知できません（白にフォールバック）
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 基準説明 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-blue-900 mb-2">WCAG 2.1 AA基準</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">
                  テキスト (1.4.3)
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 通常テキスト（18px未満）: 4.5:1 以上</li>
                  <li>• 大きいテキスト（18px以上/14px太字）: 3:1 以上</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">
                  非テキスト (1.4.11)
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• UIコンポーネント境界線: 3:1 以上</li>
                  <li>• アイコン・グラフィック: 3:1 以上</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本テキスト */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            基本テキスト
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK例 */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg mb-4">
                  十分なコントラスト
                </CardTitle>
                <TestText
                  expectedOk={true}
                  expectedRatio="12.6:1"
                  required="4.5"
                  className="text-gray-900"
                >
                  #333（濃いグレー）と白背景の組み合わせ。読みやすいテキストです。
                </TestText>
              </CardHeader>
            </Card>

            {/* NG例 */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg mb-4">低コントラスト</CardTitle>
                <TestText
                  expectedOk={false}
                  expectedRatio="2.3:1"
                  required="4.5"
                  className="text-gray-400"
                >
                  #9ca3af（薄いグレー）と白背景。コントラスト不足で読みにくい。
                </TestText>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* グラデーション背景 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            グラデーション背景
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK: 暗いグラデーション */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg mb-4">
                  深いブルー（期待: OK）
                </CardTitle>
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="8.6:1"
                  required="4.5"
                  limitation="グラデーション背景は検知不可（白にフォールバック）"
                />
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 text-white">
                  <h3 className="font-bold text-lg">
                    深いブルーグラデーション
                  </h3>
                  <p className="text-sm opacity-90">暗い背景に白文字はOK</p>
                </div>
              </CardContent>
            </Card>

            {/* NG: 明るいグラデーション */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg mb-4">
                  サンセット（期待: NG）
                </CardTitle>
                <ExpectedInfo
                  expectedOk={false}
                  expectedRatio="1.8:1"
                  required="4.5"
                  limitation="グラデーション背景は検知不可（白にフォールバック）"
                />
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-gradient-to-br from-red-400 to-yellow-400 text-white">
                  <h3 className="font-bold text-lg">
                    サンセットグラデーション
                  </h3>
                  <p className="text-sm">黄色部分で白文字が読みにくい</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* UIコンポーネント */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            UIコンポーネント - ボタン
          </h2>
          <div className="space-y-6">
            {/* プライマリボタン */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <Button className="shrink-0">プライマリボタン</Button>
                  <TestText
                    expectedOk={true}
                    expectedRatio="12.6:1"
                    required="4.5"
                    className="text-primary-foreground bg-primary px-4 py-2 rounded-md text-sm"
                  >
                    プライマリボタンのテキスト
                  </TestText>
                </div>
              </CardContent>
            </Card>

            {/* ゴーストボタン（NG） */}
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <Button
                    variant="ghost"
                    className="shrink-0 text-gray-300 hover:text-gray-300"
                  >
                    ゴーストボタン
                  </Button>
                  <TestText
                    expectedOk={false}
                    expectedRatio="1.7:1"
                    required="4.5"
                    className="text-gray-300 px-4 py-2 text-sm"
                  >
                    薄いグレー（#d1d5db）のテキスト
                  </TestText>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* バッジ */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            UIコンポーネント - バッジ
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* 成功バッジ（OK） */}
            <Card className="border-green-200">
              <CardContent className="pt-6 space-y-4">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  成功バッジ
                </Badge>
                <TestText
                  expectedOk={true}
                  expectedRatio="5.1:1"
                  required="4.5"
                  className="text-green-800 bg-green-100 px-2 py-1 rounded text-sm inline-block"
                >
                  緑のバッジテキスト
                </TestText>
              </CardContent>
            </Card>

            {/* 薄いバッジ（NG） */}
            <Card className="border-red-200">
              <CardContent className="pt-6 space-y-4">
                <Badge className="bg-gray-100 text-gray-300 hover:bg-gray-100">
                  薄いバッジ
                </Badge>
                <TestText
                  expectedOk={false}
                  expectedRatio="1.6:1"
                  required="4.5"
                  className="text-gray-300 bg-gray-100 px-2 py-1 rounded text-sm inline-block"
                >
                  薄いグレーのバッジテキスト
                </TestText>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* フォーム要素 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            フォーム要素
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK例 */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">通常のラベル</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TestText
                  expectedOk={true}
                  expectedRatio="12.6:1"
                  required="4.5"
                  className="text-foreground font-medium text-sm"
                >
                  メールアドレス
                </TestText>
                <Input type="email" placeholder="example@email.com" />
              </CardContent>
            </Card>

            {/* NG例 */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">薄いラベル</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TestText
                  expectedOk={false}
                  expectedRatio="1.7:1"
                  required="4.5"
                  className="text-gray-300 font-medium text-sm"
                >
                  パスワード（読みにくい）
                </TestText>
                <Input type="password" placeholder="パスワードを入力" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 大きいテキスト */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            大きいテキスト（基準 3:1）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">24px太字（OK）</CardTitle>
              </CardHeader>
              <CardContent>
                <TestText
                  expectedOk={true}
                  expectedRatio="4.5:1"
                  required="3.0"
                  className="text-2xl font-bold text-gray-500"
                >
                  大きいテキストは基準が緩い
                </TestText>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">16px通常（ギリギリOK）</CardTitle>
              </CardHeader>
              <CardContent>
                <TestText
                  expectedOk={true}
                  expectedRatio="4.8:1"
                  required="4.5"
                  className="text-base text-gray-500"
                >
                  gray-500は4.8:1で4.5:1をギリギリクリア
                </TestText>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 非テキストコントラスト - UIコンポーネント境界線 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            非テキスト - UIコンポーネント境界線（基準 3:1）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK: 濃い境界線 */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">濃い境界線（OK）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="4.5:1"
                  required="3.0"
                />
                <input
                  type="text"
                  placeholder="濃いグレーの境界線"
                  className="w-full px-3 py-2 border-2 border-gray-500 rounded-md"
                />
                <button className="px-4 py-2 border-2 border-gray-600 rounded-md bg-white">
                  濃い境界線ボタン
                </button>
              </CardContent>
            </Card>

            {/* NG: 薄い境界線 */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">薄い境界線（NG）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={false}
                  expectedRatio="1.5:1"
                  required="3.0"
                />
                <input
                  type="text"
                  placeholder="薄いグレーの境界線"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-md"
                />
                <button className="px-4 py-2 border-2 border-gray-200 rounded-md bg-white">
                  薄い境界線ボタン
                </button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 非テキストコントラスト - アイコン */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            非テキスト - アイコン（基準 3:1）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK: 濃いアイコン */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">濃いアイコン（OK）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="10:1"
                  required="3.0"
                />
                <div className="flex gap-4 items-center">
                  <Search className="w-6 h-6 text-gray-700" />
                  <Bell className="w-6 h-6 text-gray-700" />
                  <Settings className="w-6 h-6 text-gray-700" />
                  <Heart className="w-6 h-6 text-gray-700" />
                </div>
                <p className="text-sm text-gray-600">
                  gray-700は白背景に対して十分なコントラスト
                </p>
              </CardContent>
            </Card>

            {/* NG: 薄いアイコン */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">薄いアイコン（NG）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={false}
                  expectedRatio="1.5:1"
                  required="3.0"
                />
                <div className="flex gap-4 items-center">
                  <Search className="w-6 h-6 text-gray-300" />
                  <Bell className="w-6 h-6 text-gray-300" />
                  <Settings className="w-6 h-6 text-gray-300" />
                  <Heart className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-600">
                  gray-300は白背景に対してコントラスト不足
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* プレースホルダー */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            プレースホルダー（基準 4.5:1）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK: 濃いプレースホルダー */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">濃いプレースホルダー（OK）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="4.8:1"
                  required="4.5"
                />
                <input
                  type="text"
                  placeholder="gray-500のプレースホルダー"
                  className="w-full px-3 py-2 border rounded-md placeholder:text-gray-500"
                />
              </CardContent>
            </Card>

            {/* NG: 薄いプレースホルダー */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">薄いプレースホルダー（NG）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={false}
                  expectedRatio="1.5:1"
                  required="4.5"
                />
                <input
                  type="text"
                  placeholder="gray-300のプレースホルダー（読みにくい）"
                  className="w-full px-3 py-2 border rounded-md placeholder:text-gray-300"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* リンク */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            リンク（基準: 背景と4.5:1、周囲テキストと3:1または下線）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK: 下線付きリンク */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">下線付きリンク（OK）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="4.5:1"
                  required="4.5"
                />
                <p className="text-gray-700">
                  通常のテキストに
                  <a href="#" className="text-blue-600 underline">
                    下線付きリンク
                  </a>
                  が含まれています。
                </p>
              </CardContent>
            </Card>

            {/* NG: 下線なし区別不足 */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">下線なし（区別不足）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={false}
                  expectedRatio="1.2:1"
                  required="3.0"
                  limitation="下線なしの場合、周囲テキストと3:1以上必要"
                />
                <p className="text-gray-700">
                  通常のテキストに
                  <a href="#" className="text-gray-600 no-underline">
                    下線なしリンク
                  </a>
                  が含まれています（区別困難）。
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* フォーカスリング */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            フォーカスリング（基準 3:1）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK: 濃いフォーカスリング */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">濃いフォーカスリング（OK）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="8:1"
                  required="3.0"
                />
                <p className="text-sm text-gray-600 mb-2">
                  クリックしてフォーカスを確認:
                </p>
                <button className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                  濃いフォーカスリング
                </button>
              </CardContent>
            </Card>

            {/* NG: 薄いフォーカスリング */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">薄いフォーカスリング（NG）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={false}
                  expectedRatio="1.5:1"
                  required="3.0"
                />
                <p className="text-sm text-gray-600 mb-2">
                  クリックしてフォーカスを確認:
                </p>
                <button className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200">
                  薄いフォーカスリング（見えにくい）
                </button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* エラーメッセージ */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            エラーメッセージ（基準 4.5:1）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* OK: 濃いエラー */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">濃いエラーメッセージ（OK）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="4.5:1"
                  required="4.5"
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-red-500 rounded-md"
                  defaultValue="無効な値"
                />
                <p className="text-red-700 text-sm">
                  入力値が無効です。正しい形式で入力してください。
                </p>
              </CardContent>
            </Card>

            {/* NG: 薄いエラー */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">薄いエラーメッセージ（NG）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={false}
                  expectedRatio="2.5:1"
                  required="4.5"
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-red-300 rounded-md"
                  defaultValue="無効な値"
                />
                <p className="text-red-300 text-sm">
                  このエラーメッセージは読みにくい
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 無効状態 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
            無効状態（WCAG免除だが考慮推奨）
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">無効なボタン</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="2.5:1"
                  required="免除"
                  limitation="無効状態はWCAG免除。ただしユーザビリティ的には配慮推奨"
                />
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 border rounded-md cursor-not-allowed"
                >
                  無効なボタン
                </button>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">無効なインプット</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpectedInfo
                  expectedOk={true}
                  expectedRatio="2.5:1"
                  required="免除"
                  limitation="無効状態はWCAG免除。ただしユーザビリティ的には配慮推奨"
                />
                <input
                  disabled
                  type="text"
                  value="変更不可"
                  className="w-full px-3 py-2 bg-gray-100 text-gray-400 border rounded-md cursor-not-allowed"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-muted-foreground text-sm border-t mt-8">
        <p>
          WCAG 2.1 AA基準: テキスト <strong>4.5:1</strong> / 大きいテキスト{' '}
          <strong>3:1</strong> / 非テキスト <strong>3:1</strong>
        </p>
      </footer>
    </div>
  );
}

export default App;
