import { describe, it, expect } from 'vitest';
import { getSelector } from './getSelector';

describe('getSelector', () => {
  it('IDを持つ要素は#idを返す', () => {
    const element = document.createElement('div');
    element.id = 'test-id';
    document.body.appendChild(element);

    expect(getSelector(element)).toBe('#test-id');

    document.body.removeChild(element);
  });

  it('クラスを持つ要素はタグ.classを含む', () => {
    const element = document.createElement('div');
    element.className = 'test-class';
    document.body.appendChild(element);

    const selector = getSelector(element);
    expect(selector).toContain('div.test-class');

    document.body.removeChild(element);
  });

  it('複数クラスは最初の2つのみ含む', () => {
    const element = document.createElement('div');
    element.className = 'class1 class2 class3';
    document.body.appendChild(element);

    const selector = getSelector(element);
    expect(selector).toContain('class1');
    expect(selector).toContain('class2');
    expect(selector).not.toContain('class3');

    document.body.removeChild(element);
  });

  it('親要素を含むセレクタを生成する', () => {
    const parent = document.createElement('div');
    parent.className = 'parent';
    const child = document.createElement('span');
    child.className = 'child';
    parent.appendChild(child);
    document.body.appendChild(parent);

    const selector = getSelector(child);
    expect(selector).toContain('div.parent');
    expect(selector).toContain('span.child');
    expect(selector).toContain(' > ');

    document.body.removeChild(parent);
  });

  it('IDがあれば親は含まない', () => {
    const parent = document.createElement('div');
    parent.className = 'parent';
    const child = document.createElement('span');
    child.id = 'child-id';
    parent.appendChild(child);
    document.body.appendChild(parent);

    const selector = getSelector(child);
    expect(selector).toBe('#child-id');
    expect(selector).not.toContain('parent');

    document.body.removeChild(parent);
  });
});
