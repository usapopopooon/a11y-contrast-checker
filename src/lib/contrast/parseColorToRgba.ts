import { parseColorToRgba as _parseColorToRgba } from '../../../lib/contrast-detector.mjs';

export const parseColorToRgba: (
  color: string
) => { r: number; g: number; b: number; a: number } | null = _parseColorToRgba;
