import { parseColorToRgb as _parseColorToRgb } from '../../../lib/contrast-detector.mjs';

export const parseColorToRgb: (
  color: string
) => { r: number; g: number; b: number } | null = _parseColorToRgb;
