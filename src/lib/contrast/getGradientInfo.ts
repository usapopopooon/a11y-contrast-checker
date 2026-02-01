import { getGradientInfo as _getGradientInfo } from '../../../lib/contrast-detector.mjs';
import type { GradientInfo } from './types';

export const getGradientInfo: (element: Element) => GradientInfo =
  _getGradientInfo;
