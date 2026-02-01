import { detectViolations as _detectViolations } from '../../../lib/contrast-detector.mjs';
import type { Violation } from './types';

export const detectViolations: (options?: {
  includeText?: boolean;
  includeUI?: boolean;
  includeIcons?: boolean;
  includePlaceholders?: boolean;
  includeLinks?: boolean;
}) => Violation[] = _detectViolations;
