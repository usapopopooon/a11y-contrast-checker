import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetectionOptions } from '@/lib/contrast';
import { useContrastDetection } from '@/hooks/useContrastDetection';
import { getCardBorderClass } from '@/utils/cardBorderClass';
import { ContrastBadges } from './ContrastBadges';

export interface TestCardProps<T extends HTMLElement> {
  title: string;
  expectedOk: boolean;
  expectedRatio: string;
  requiredRatio: string;
  limitation?: string;
  description?: string;
  detectionOptions?: DetectionOptions;
  children: (ref: React.RefObject<T | null>) => React.ReactNode;
}

/**
 * 共通テストカード（render prop パターン）
 */
export function TestCard<T extends HTMLElement>({
  title,
  expectedOk,
  expectedRatio,
  requiredRatio,
  limitation,
  description,
  detectionOptions,
  children,
}: TestCardProps<T>) {
  const ref = useRef<T>(null);
  const detection = useContrastDetection(ref, detectionOptions);
  const borderClass = getCardBorderClass(detection, requiredRatio, expectedOk);

  return (
    <Card className={borderClass}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ContrastBadges
          expectedOk={expectedOk}
          expectedRatio={expectedRatio}
          requiredRatio={requiredRatio}
          detection={detection}
          limitation={limitation}
        />
        {children(ref)}
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardContent>
    </Card>
  );
}
