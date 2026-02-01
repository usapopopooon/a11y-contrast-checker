import { getContrastRatioWithOpacity as _getContrastRatioWithOpacity } from '../../../lib/contrast-detector.mjs';

export const getContrastRatioWithOpacity: (
  color1: string,
  color2: string,
  opacity: number
) => number = _getContrastRatioWithOpacity;
