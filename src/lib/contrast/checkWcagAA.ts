import { checkWcagAA as _checkWcagAA } from '../../../lib/contrast-detector.mjs';
import type { WcagResult } from './types';

export const checkWcagAA: (
  ratio: number,
  fontSize: string,
  fontWeight: string
) => WcagResult = _checkWcagAA;
