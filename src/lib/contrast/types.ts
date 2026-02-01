/**
 * WCAG コントラスト関連の型定義
 */

export interface WcagResult {
  ratio: number;
  isLargeText: boolean;
  meetsAA: boolean;
  required: number;
}

export interface Violation {
  type?: string;
  selector: string;
  text: string;
  color: string;
  backgroundColor: string;
  ratio: number;
  required: number;
  fontSize?: string;
  note?: string;
  rect: { x: number; y: number; width: number; height: number };
}

export interface DetectionResult {
  detected: boolean;
  ratio: number;
  color: string;
  bgColor: string;
  type:
    | 'text'
    | 'border'
    | 'svg'
    | 'placeholder'
    | 'focus-ring'
    | 'gradient'
    | 'link'
    | 'link-no-underline'
    | 'unknown';
  /** リンクの下線有無（リンクの場合のみ） */
  hasUnderline?: boolean;
}

export interface DetectionOptions {
  /** プレースホルダーを優先的に検知（placeholder属性がある場合） */
  prioritizePlaceholder?: boolean;
  /** フォーカスリングを検知（ボタンやインプットの場合） */
  detectFocusRing?: boolean;
  /** フォーカスリング検知時の待機時間（ms） */
  focusRingDelay?: number;
  /** ボーダーを優先的に検知 */
  prioritizeBorder?: boolean;
  /** SVGを優先的に検知 */
  prioritizeSvg?: boolean;
}

export interface GradientInfo {
  isGradient: boolean;
  colors: string[];
}
