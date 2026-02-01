import { getContrastRatioFromLuminance as _getContrastRatioFromLuminance } from '../../../lib/contrast-detector.mjs';

export const getContrastRatioFromLuminance: (l1: number, l2: number) => number =
  _getContrastRatioFromLuminance;
