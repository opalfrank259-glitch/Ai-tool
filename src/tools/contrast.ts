/**
 * WCAG 2.1 Contrast Ratio Calculator
 * Reference: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace(/^#/, '');
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return { r, g, b };
}

export function relativeLuminance(rgb: RGB): number {
  const normalize = (val: number) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = normalize(rgb.r);
  const g = normalize(rgb.g);
  const b = normalize(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function calculateContrastRatio(fg: RGB | string, bg: RGB | string): number {
  const fgRgb = typeof fg === 'string' ? hexToRgb(fg) : fg;
  const bgRgb = typeof bg === 'string' ? hexToRgb(bg) : bg;
  const l1 = relativeLuminance(fgRgb);
  const l2 = relativeLuminance(bgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function evaluateWcagCompliance(ratio: number): {
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  rating: 'fail' | 'aa-large' | 'aa' | 'aaa';
} {
  const aaLarge = ratio >= 3.0;
  const aaNormal = ratio >= 4.5;
  const aaaLarge = ratio >= 4.5;
  const aaaNormal = ratio >= 7.0;

  let rating: 'fail' | 'aa-large' | 'aa' | 'aaa' = 'fail';
  if (aaaNormal) rating = 'aaa';
  else if (aaNormal) rating = 'aa';
  else if (aaLarge) rating = 'aa-large';

  return { aaNormal, aaLarge, aaaNormal, aaaLarge, rating };
}
