import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectFocusRingColorAsync } from './detectFocusRingColorAsync';

describe('detectFocusRingColorAsync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('非同期でoutline色を検知する', async () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(result).not.toBeNull();
    expect(result?.type).toBe('outline');
  });

  it('HTMLElement以外でnullを返す', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const result = await detectFocusRingColorAsync(svg);

    expect(result).toBeNull();
  });

  it('タイムアウトオプションを適用する', async () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'rgb(255, 0, 0)';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button, { timeout: 100 });

    await vi.advanceTimersByTimeAsync(150);

    const result = await promise;

    expect(result).not.toBeNull();
  });

  it('box-shadow色を検知する', async () => {
    const button = document.createElement('button');
    button.style.outline = 'none';
    button.style.boxShadow = '0 0 0 3px rgb(59, 130, 246)';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(result).not.toBeNull();
    expect(result?.type).toBe('box-shadow');
  });

  it('outline幅が0の場合はoutlineを検知しない', async () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '0';
    button.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(result).toBeNull();
  });

  it('outlineColorが透明の場合は検知しない', async () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'transparent';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(result).toBeNull();
  });

  it('デフォルトタイムアウトで動作する', async () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button);

    await vi.advanceTimersByTimeAsync(200);

    const result = await promise;

    expect(result).not.toBeNull();
    expect(result?.type).toBe('outline');
  });

  it('フォーカス後に元のフォーカス要素に戻す', async () => {
    const initialButton = document.createElement('button');
    initialButton.id = 'initial';
    const targetButton = document.createElement('button');
    targetButton.style.outlineWidth = '2px';
    targetButton.style.outlineStyle = 'solid';
    targetButton.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(initialButton);
    document.body.appendChild(targetButton);
    initialButton.focus();

    const promise = detectFocusRingColorAsync(targetButton, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    await promise;

    // body以外の要素にフォーカスがあった場合は復元される
    expect(document.activeElement).toBe(initialButton);
  });

  it('初期フォーカスがbodyの場合はblurのみ実行', async () => {
    const targetButton = document.createElement('button');
    targetButton.style.outlineWidth = '2px';
    targetButton.style.outlineStyle = 'solid';
    targetButton.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(targetButton);
    // 明示的にbodyにフォーカス
    document.body.focus();

    const promise = detectFocusRingColorAsync(targetButton, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    await promise;

    // bodyへのフォーカス復元は行われず、要素はblurされる
    expect(document.activeElement).toBe(document.body);
  });

  it('検出後に要素がblurされる', async () => {
    const targetButton = document.createElement('button');
    targetButton.style.outlineWidth = '2px';
    targetButton.style.outlineStyle = 'solid';
    targetButton.style.outlineColor = 'rgb(0, 0, 255)';
    document.body.appendChild(targetButton);

    const promise = detectFocusRingColorAsync(targetButton, { timeout: 50 });

    await vi.advanceTimersByTimeAsync(100);

    await promise;

    // 検出後、ターゲット要素はフォーカスを持たない
    expect(document.activeElement).not.toBe(targetButton);
  });

  it('空オプションでデフォルトタイムアウトを使用する', async () => {
    const button = document.createElement('button');
    button.style.outlineWidth = '2px';
    button.style.outlineStyle = 'solid';
    button.style.outlineColor = 'rgb(255, 0, 0)';
    document.body.appendChild(button);

    const promise = detectFocusRingColorAsync(button, {});

    await vi.advanceTimersByTimeAsync(200);

    const result = await promise;

    expect(result).not.toBeNull();
  });
});
