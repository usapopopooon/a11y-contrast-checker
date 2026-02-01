import { blendColors as _blendColors } from '../../../lib/contrast-detector.mjs';

export const blendColors: (
  fg: { r: number; g: number; b: number; a?: number },
  bg: { r: number; g: number; b: number }
) => { r: number; g: number; b: number } = _blendColors;
