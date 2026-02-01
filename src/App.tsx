import {
  // Info cards
  LegendCard,
  WcagStandardsCard,
  // Basic sections
  BasicTextSection,
  GradientSection,
  ImageBackgroundSection,
  // UI component sections
  ButtonSection,
  BadgeSection,
  FormSection,
  LargeTextSection,
  // Non-text sections
  BorderSection,
  IconSection,
  PlaceholderSection,
  LinkSection,
  FocusRingSection,
  ErrorMessageSection,
  // Edge case sections
  TranslucentSection,
  OpacitySection,
  PseudoElementSection,
  CssFilterSection,
  BlendModeSection,
  DisabledSection,
} from '@/components/contrast/sections';

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
        {/* 凡例・基準説明 */}
        <LegendCard />
        <WcagStandardsCard />

        {/* 基本テキスト */}
        <BasicTextSection />

        {/* グラデーション背景 */}
        <GradientSection />

        {/* 画像背景 */}
        <ImageBackgroundSection />

        {/* UIコンポーネント - ボタン */}
        <ButtonSection />

        {/* UIコンポーネント - バッジ */}
        <BadgeSection />

        {/* フォーム要素 */}
        <FormSection />

        {/* 大きいテキスト */}
        <LargeTextSection />

        {/* 非テキスト - 境界線 */}
        <BorderSection />

        {/* 非テキスト - アイコン */}
        <IconSection />

        {/* プレースホルダー */}
        <PlaceholderSection />

        {/* リンク */}
        <LinkSection />

        {/* フォーカスリング */}
        <FocusRingSection />

        {/* エラーメッセージ */}
        <ErrorMessageSection />

        {/* エッジケース - 半透明色 */}
        <TranslucentSection />

        {/* エッジケース - opacityプロパティ */}
        <OpacitySection />

        {/* エッジケース - 疑似要素 */}
        <PseudoElementSection />

        {/* エッジケース - CSSフィルター */}
        <CssFilterSection />

        {/* エッジケース - mix-blend-mode */}
        <BlendModeSection />

        {/* 無効状態 */}
        <DisabledSection />
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
