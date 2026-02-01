import { detectTextViolations } from './detectTextViolations.mjs';
import { detectUIComponentViolations } from './detectUIComponentViolations.mjs';
import { detectIconViolations } from './detectIconViolations.mjs';
import { detectPlaceholderViolations } from './detectPlaceholderViolations.mjs';
import { detectLinkViolations } from './detectLinkViolations.mjs';
import { detectPseudoElementViolations } from './detectPseudoElementViolations.mjs';
import { detectFilterWarnings } from './detectFilterWarnings.mjs';
import { detectBlendModeWarnings } from './detectBlendModeWarnings.mjs';

/**
 * ページ全体のコントラスト違反を検出（テキスト + 非テキスト）
 */
export function detectViolations(options = {}) {
  const {
    includeText = true,
    includeUI = true,
    includeIcons = true,
    includePlaceholders = true,
    includeLinks = true,
    includePseudoElements = false,
    includeFilterWarnings = false,
    includeBlendModeWarnings = false,
  } = options;

  const violations = [];

  if (includeText) {
    violations.push(...detectTextViolations());
  }

  if (includeUI) {
    violations.push(...detectUIComponentViolations());
  }

  if (includeIcons) {
    violations.push(...detectIconViolations());
  }

  if (includePlaceholders) {
    violations.push(...detectPlaceholderViolations());
  }

  if (includeLinks) {
    violations.push(...detectLinkViolations());
  }

  if (includePseudoElements) {
    violations.push(...detectPseudoElementViolations());
  }

  if (includeFilterWarnings) {
    violations.push(...detectFilterWarnings());
  }

  if (includeBlendModeWarnings) {
    violations.push(...detectBlendModeWarnings());
  }

  return violations;
}
