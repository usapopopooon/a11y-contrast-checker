import { getWorstGradientBackground as _getWorstGradientBackground } from '../../../lib/contrast-detector.mjs';

export const getWorstGradientBackground: (
  foregroundColor: string,
  gradientColors: string[]
) => string = _getWorstGradientBackground;
