import { getContrastRatio as _getContrastRatio } from '../../../lib/contrast-detector.mjs';

export const getContrastRatio: (color1: string, color2: string) => number =
  _getContrastRatio;
