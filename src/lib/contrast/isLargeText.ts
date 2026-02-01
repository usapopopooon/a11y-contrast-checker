import { isLargeText as _isLargeText } from '../../../lib/contrast-detector.mjs';

export const isLargeText: (fontSize: string, fontWeight: string) => boolean =
  _isLargeText;
