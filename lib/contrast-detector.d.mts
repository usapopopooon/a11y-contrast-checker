/**
 * WCAG 2.1 コントラスト比検出ライブラリ
 * TypeScript型定義
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

// 基本色関数
export function getLuminance(r: number, g: number, b: number): number;
export function getContrastRatioFromLuminance(l1: number, l2: number): number;
export function parseColorToRgba(color: string): RGBA | null;
export function parseColorToRgb(color: string): RGB | null;
export function blendColors(
  fg: { r: number; g: number; b: number; a?: number },
  bg: { r: number; g: number; b: number }
): RGB;
export function getEffectiveOpacity(element: Element): number;
export function getColorAlpha(color: string): number;

// グラデーション関数
export function extractGradientColors(gradient: string): string[];
export function getGradientInfo(element: Element): GradientInfo;
export function getGrayscaleValue(r: number, g: number, b: number): number;
export function getColorGrayscale(color: string): number;
export function getWorstGradientBackground(
  foregroundColor: string,
  gradientColors: string[]
): string;
export function getBackgroundColor(element: Element): string;

// コントラスト比関数
export function getContrastRatio(color1: string, color2: string): number;
export function getContrastRatioWithOpacity(
  color1: string,
  color2: string,
  opacity: number
): number;

// WCAG判定関数
export function isLargeText(fontSize: string, fontWeight: string): boolean;
export function checkWcagAA(
  ratio: number,
  fontSize: string,
  fontWeight: string
): WcagResult;
export function getSelector(element: Element): string;

// 違反検出関数
export function detectTextViolations(): Violation[];
export function detectUIComponentViolations(): Violation[];
export function detectIconViolations(): Violation[];
export function detectPlaceholderViolations(): Violation[];
export function detectLinkViolations(): Violation[];
export function detectPseudoElementViolations(): Violation[];
export function detectFilterWarnings(): Violation[];
export function detectBlendModeWarnings(): Violation[];
export function detectViolations(options?: DetectionOptions): Violation[];
