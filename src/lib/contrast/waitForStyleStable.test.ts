import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitForStyleStable } from './waitForStyleStable';

describe('waitForStyleStable', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('スタイルが安定するまで待つ', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const promise = waitForStyleStable(element, {
      timeout: 100,
      interval: 10,
      checkCount: 2,
    });

    await vi.advanceTimersByTimeAsync(150);

    await expect(promise).resolves.toBeUndefined();

    document.body.removeChild(element);
  });

  it('タイムアウトで解決する', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const promise = waitForStyleStable(element, {
      timeout: 50,
      interval: 10,
      checkCount: 10,
    });

    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBeUndefined();

    document.body.removeChild(element);
  });

  it('デフォルトオプションで動作する', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const promise = waitForStyleStable(element);

    await vi.advanceTimersByTimeAsync(500);

    await expect(promise).resolves.toBeUndefined();

    document.body.removeChild(element);
  });
});
