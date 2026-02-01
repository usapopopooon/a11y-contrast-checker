import { CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react';
import type { DetectionResult } from '@/lib/contrast';
import { detectionTypeLabels } from '@/constants/detectionTypeLabels';

// ============================================================
// 型定義
// ============================================================

export interface ContrastBadgesProps {
  readonly expectedOk: boolean;
  readonly expectedRatio: string;
  readonly requiredRatio: string;
  readonly detection: DetectionResult | null;
  readonly limitation?: string;
}

/** バッジの状態 */
type BadgeState = 'ok' | 'ng' | 'pending';

/** バッジスタイル設定 */
interface BadgeStyle {
  readonly className: string;
}

// ============================================================
// 定数（イミュータブル）
// ============================================================

/** 期待値バッジのスタイル */
const EXPECTED_BADGE_STYLES: Readonly<Record<'ok' | 'ng', BadgeStyle>> =
  Object.freeze({
    ok: { className: 'bg-green-100 text-green-800 border border-green-200' },
    ng: { className: 'bg-red-100 text-red-800 border border-red-200' },
  });

/** 検知結果バッジのスタイル */
const DETECTION_BADGE_STYLES: Readonly<Record<BadgeState, BadgeStyle>> =
  Object.freeze({
    ok: { className: 'bg-blue-100 text-blue-800 border border-blue-200' },
    ng: { className: 'bg-orange-100 text-orange-800 border border-orange-200' },
    pending: { className: 'bg-gray-100 text-gray-700 border border-gray-200' },
  });

const BADGE_BASE_CLASS =
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium';

// ============================================================
// 純粋関数
// ============================================================

/**
 * 基準値をパース（純粋関数）
 */
const parseRequired = (requiredRatio: string): number => {
  const num = parseFloat(requiredRatio);
  return isNaN(num) ? 0 : num;
};

/**
 * 検知結果が基準をクリアしているか判定（純粋関数）
 */
const isDetectionOk = (
  detection: DetectionResult | null,
  requiredNum: number
): boolean | null => (detection ? detection.ratio >= requiredNum : null);

/**
 * 検知状態を取得（純粋関数）
 */
const getDetectionState = (detectedOk: boolean | null): BadgeState => {
  if (detectedOk === null) return 'pending';
  return detectedOk ? 'ok' : 'ng';
};

/**
 * 検知タイプのラベルを取得（純粋関数）
 */
const getTypeLabel = (type: DetectionResult['type']): string =>
  detectionTypeLabels[type] ?? type;

// ============================================================
// サブコンポーネント（純粋関数コンポーネント）
// ============================================================

/** 期待値バッジ */
const ExpectedBadge = ({
  expectedOk,
  expectedRatio,
}: {
  readonly expectedOk: boolean;
  readonly expectedRatio: string;
}) => {
  const style = EXPECTED_BADGE_STYLES[expectedOk ? 'ok' : 'ng'];
  const Icon = expectedOk ? CheckCircle2 : XCircle;

  return (
    <div className={`${BADGE_BASE_CLASS} ${style.className}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>期待: {expectedOk ? 'OK' : 'NG'}</span>
      <span>({expectedRatio})</span>
    </div>
  );
};

/** 検知結果バッジ */
const DetectionBadge = ({
  detection,
  detectedOk,
}: {
  readonly detection: DetectionResult | null;
  readonly detectedOk: boolean | null;
}) => {
  const state = getDetectionState(detectedOk);
  const style = DETECTION_BADGE_STYLES[state];

  return (
    <div className={`${BADGE_BASE_CLASS} ${style.className}`}>
      <Eye className="w-3.5 h-3.5" />
      <span>検知:</span>
      {detection ? (
        <>
          <span>{detectedOk ? 'OK' : 'NG'}</span>
          <span>({detection.ratio}:1)</span>
          <span>[{getTypeLabel(detection.type)}]</span>
        </>
      ) : (
        <span>-</span>
      )}
    </div>
  );
};

/** 基準表示 */
const RequirementLabel = ({
  requiredRatio,
}: {
  readonly requiredRatio: string;
}) => <span className="text-xs text-gray-500">基準: {requiredRatio}:1</span>;

/** 制限事項表示 */
const LimitationLabel = ({
  limitation,
}: {
  readonly limitation: string | undefined;
}) =>
  limitation ? (
    <span className="text-xs text-amber-600 flex items-center gap-1">
      <AlertTriangle className="w-3 h-3" />
      {limitation}
    </span>
  ) : null;

// ============================================================
// メインコンポーネント
// ============================================================

/**
 * 期待値と検知結果を表示するコンポーネント
 */
export const ContrastBadges = ({
  expectedOk,
  expectedRatio,
  requiredRatio,
  detection,
  limitation,
}: ContrastBadgesProps) => {
  const requiredNum = parseRequired(requiredRatio);
  const detectedOk = isDetectionOk(detection, requiredNum);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <ExpectedBadge expectedOk={expectedOk} expectedRatio={expectedRatio} />
      <DetectionBadge detection={detection} detectedOk={detectedOk} />
      <RequirementLabel requiredRatio={requiredRatio} />
      <LimitationLabel limitation={limitation} />
    </div>
  );
};

// ============================================================
// エクスポート（テスト用）
// ============================================================

// eslint-disable-next-line react-refresh/only-export-components
export const _internal = {
  parseRequired,
  isDetectionOk,
  getDetectionState,
  getTypeLabel,
  EXPECTED_BADGE_STYLES,
  DETECTION_BADGE_STYLES,
} as const;
