import { describe, it, expect } from 'vitest';
import { calcRetryDelay } from './calcRetryDelay';
import { DEFAULT_RETRY_CONFIG } from './constants';

describe('calcRetryDelay', () => {
  const config = DEFAULT_RETRY_CONFIG;

  it('リトライ回数0の場合、delayMultiplier * 1を返す', () => {
    expect(calcRetryDelay(0, config)).toBe(150);
  });

  it('リトライ回数1の場合、delayMultiplier * 2を返す', () => {
    expect(calcRetryDelay(1, config)).toBe(300);
  });

  it('リトライ回数2の場合、delayMultiplier * 3を返す', () => {
    expect(calcRetryDelay(2, config)).toBe(450);
  });

  it('カスタム設定で正しく計算される', () => {
    const customConfig = { ...config, delayMultiplier: 100 };
    expect(calcRetryDelay(0, customConfig)).toBe(100);
    expect(calcRetryDelay(1, customConfig)).toBe(200);
    expect(calcRetryDelay(2, customConfig)).toBe(300);
  });

  it('大きいリトライ回数でも正しく計算される', () => {
    expect(calcRetryDelay(10, config)).toBe(150 * 11);
  });
});
