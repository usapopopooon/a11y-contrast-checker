import { getLuminance as _getLuminance } from '../../../lib/contrast-detector.mjs';

export const getLuminance: (r: number, g: number, b: number) => number =
  _getLuminance;
