/**
 * 要素のスタイルが安定するまで待つ
 */
export const waitForStyleStable = (
  element: Element,
  options: { timeout?: number; interval?: number; checkCount?: number } = {}
): Promise<void> => {
  const { timeout = 300, interval = 30, checkCount = 3 } = options;

  return new Promise((resolve) => {
    let lastStyle = '';
    let stableCount = 0;
    let elapsed = 0;

    const check = () => {
      const style = getComputedStyle(element);
      const currentStyle = [
        style.color,
        style.backgroundColor,
        style.borderColor,
        style.outlineColor,
        style.boxShadow,
      ].join('|');

      if (currentStyle === lastStyle) {
        stableCount++;
        if (stableCount >= checkCount) {
          resolve();
          return;
        }
      } else {
        stableCount = 0;
        lastStyle = currentStyle;
      }

      elapsed += interval;
      if (elapsed >= timeout) {
        resolve();
        return;
      }

      setTimeout(check, interval);
    };

    requestAnimationFrame(() => {
      lastStyle = '';
      check();
    });
  });
};
