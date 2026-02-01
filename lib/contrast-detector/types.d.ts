/**
 * WCAG 2.1 コントラスト比検出ライブラリ - 型定義
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface GradientInfo {
  isGradient: boolean;
  colors: string[];
}

export interface WcagResult {
  ratio: number;
  isLargeText: boolean;
  meetsAA: boolean;
  required: number;
}

export interface ViolationRect {
  x: number;
  y: number;
  width: number;
  height: number;
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
  opacity?: number;
  filter?: string;
  blendMode?: string;
  note?: string;
  rect: ViolationRect;
}

export interface DetectionOptions {
  includeText?: boolean;
  includeUI?: boolean;
  includeIcons?: boolean;
  includePlaceholders?: boolean;
  includeLinks?: boolean;
  includePseudoElements?: boolean;
  includeFilterWarnings?: boolean;
  includeBlendModeWarnings?: boolean;
}
