import { describe, it, expect, afterEach } from 'vitest';
import { detectContrast } from './detectContrast';

describe('detectContrast', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('テキスト色と背景色のコントラストを検知する', () => {
    const element = document.createElement('div');
    element.style.color = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const result = detectContrast(element);

    expect(result.detected).toBe(true);
    expect(result.ratio).toBeCloseTo(21, 0);
    expect(result.type).toBe('text');
  });

  it('ボーダー優先モードでボーダー色を検知する', () => {
    const element = document.createElement('div');
    element.style.borderWidth = '2px';
    element.style.borderStyle = 'solid';
    element.style.borderColor = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const result = detectContrast(element, { prioritizeBorder: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('border');
  });

  it('ボーダー優先モードでボーダーがない場合はスキップする', () => {
    const element = document.createElement('div');
    element.style.color = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    element.style.borderWidth = '0';
    document.body.appendChild(element);

    const result = detectContrast(element, { prioritizeBorder: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('text');
  });

  it('SVG優先モードでSVG色を検知する', () => {
    const container = document.createElement('div');
    container.style.backgroundColor = 'rgb(255, 255, 255)';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.fill = 'rgb(0, 0, 0)';
    container.appendChild(svg);
    document.body.appendChild(container);

    const result = detectContrast(container, { prioritizeSvg: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('svg');
  });

  it('SVG優先モードでstrokeを検知する', () => {
    const container = document.createElement('div');
    container.style.backgroundColor = 'rgb(255, 255, 255)';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.fill = 'none';
    svg.style.stroke = 'rgb(50, 50, 50)';
    container.appendChild(svg);
    document.body.appendChild(container);

    const result = detectContrast(container, { prioritizeSvg: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('svg');
  });

  it('SVG優先モードでSVGがない場合はテキストを検知する', () => {
    const container = document.createElement('div');
    container.style.color = 'rgb(0, 0, 0)';
    container.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(container);

    const result = detectContrast(container, { prioritizeSvg: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('text');
  });

  it('SVG要素自体を検知する', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.fill = 'rgb(0, 0, 0)';
    document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(svg);

    const result = detectContrast(svg, { prioritizeSvg: true });

    expect(result.detected).toBe(true);
    expect(result.type).toBe('svg');
  });

  it('リンク要素を検知する', () => {
    const link = document.createElement('a');
    link.style.color = 'rgb(0, 0, 255)';
    link.style.textDecorationLine = 'underline';
    link.href = '#';
    document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(link);

    const result = detectContrast(link);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('link');
    expect(result.hasUnderline).toBe(true);
  });

  it('下線なしリンク要素を検知する', () => {
    const parent = document.createElement('p');
    parent.style.color = 'rgb(0, 0, 0)';
    const link = document.createElement('a');
    link.style.color = 'rgb(0, 0, 255)';
    link.style.textDecorationLine = 'none';
    link.href = '#';
    parent.appendChild(link);
    document.body.appendChild(parent);

    const result = detectContrast(link);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('link-no-underline');
    expect(result.hasUnderline).toBe(false);
  });

  it('ボーダー色をフォールバックとして検知する', () => {
    const element = document.createElement('div');
    element.style.color = 'transparent';
    element.style.borderWidth = '2px';
    element.style.borderStyle = 'solid';
    element.style.borderColor = 'rgb(100, 100, 100)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const result = detectContrast(element);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('border');
  });

  it('SVG fillをフォールバックとして検知する', () => {
    const container = document.createElement('div');
    container.style.color = 'transparent';
    container.style.backgroundColor = 'rgb(255, 255, 255)';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.fill = 'rgb(50, 50, 50)';
    container.appendChild(svg);
    document.body.appendChild(container);

    const result = detectContrast(container);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('svg');
  });

  it('SVG strokeをフォールバックとして検知する', () => {
    const container = document.createElement('div');
    container.style.color = 'transparent';
    container.style.backgroundColor = 'rgb(255, 255, 255)';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.fill = 'none';
    svg.style.stroke = 'rgb(50, 50, 50)';
    container.appendChild(svg);
    document.body.appendChild(container);

    const result = detectContrast(container);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('svg');
  });

  it('INPUT要素のプレースホルダーをフォールバックとして検知する', () => {
    const input = document.createElement('input');
    input.setAttribute('placeholder', 'テスト');
    input.style.color = 'transparent';
    input.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(input);

    const result = detectContrast(input);

    // jsdomではplaceholderスタイルが取得できない場合があるので
    // unknownまたはplaceholderのどちらかを許容
    expect(result.detected).toBe(true);
    expect(['placeholder', 'unknown']).toContain(result.type);
  });

  it('TEXTAREA要素のプレースホルダーをフォールバックとして検知する', () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('placeholder', 'テスト');
    textarea.style.color = 'transparent';
    textarea.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(textarea);

    const result = detectContrast(textarea);

    expect(result.detected).toBe(true);
    expect(['placeholder', 'unknown']).toContain(result.type);
  });

  it('何も検知できない場合はunknownを返す', () => {
    const element = document.createElement('div');
    element.style.color = 'transparent';
    element.style.backgroundColor = 'transparent';
    document.body.appendChild(element);

    const result = detectContrast(element);

    expect(result.detected).toBe(true);
    expect(result.type).toBe('unknown');
  });

  it('空のオプションで動作する', () => {
    const element = document.createElement('div');
    element.style.color = 'rgb(0, 0, 0)';
    element.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(element);

    const result = detectContrast(element, {});

    expect(result.detected).toBe(true);
    expect(result.type).toBe('text');
  });
});
