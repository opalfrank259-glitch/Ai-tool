/**
 * Aspect Ratio Verification and Calculator
 */

export interface AspectCheckResult {
  actualRatio: number;
  expectedRatio: number;
  ratioMatches: boolean;
  deviationPercent: number;
  nearestStandard: string;
}

export const STANDARD_RATIOS: Record<string, { w: number; h: number; label: string }> = {
  '1:1': { w: 1, h: 1, label: 'Square (Instagram Post / 1080x1080)' },
  '9:16': { w: 9, h: 16, label: 'Story / Reel / WhatsApp Status (1080x1920)' },
  '4:5': { w: 4, h: 5, label: 'Portrait (Instagram Feed / 1080x1350)' },
  '16:9': { w: 16, h: 9, label: 'Landscape (YouTube Thumbnail / 1280x720)' },
  '1:1.414': { w: 1, h: 1.414, label: 'ISO Paper (A4 / A3 Posters)' },
  '3.5:2': { w: 3.5, h: 2, label: 'Visiting / Business Card (3.5x2 in)' },
};

export function checkAspectRatio(
  width: number,
  height: number,
  expectedRatioKey: string = '1:1',
  tolerancePercentage: number = 3
): AspectCheckResult {
  if (width <= 0 || height <= 0) {
    return {
      actualRatio: 0,
      expectedRatio: 1,
      ratioMatches: false,
      deviationPercent: 100,
      nearestStandard: 'Unknown',
    };
  }

  const actualRatio = width / height;
  const target = STANDARD_RATIOS[expectedRatioKey] || { w: 1, h: 1, label: 'Custom' };
  const expectedRatio = target.w / target.h;

  const deviation = Math.abs((actualRatio - expectedRatio) / expectedRatio) * 100;
  const ratioMatches = deviation <= tolerancePercentage;

  // find nearest standard
  let minDiff = Infinity;
  let nearestStandard = '1:1';
  for (const [key, val] of Object.entries(STANDARD_RATIOS)) {
    const r = val.w / val.h;
    const diff = Math.abs(actualRatio - r);
    if (diff < minDiff) {
      minDiff = diff;
      nearestStandard = key;
    }
  }

  return {
    actualRatio: Math.round(actualRatio * 1000) / 1000,
    expectedRatio: Math.round(expectedRatio * 1000) / 1000,
    ratioMatches,
    deviationPercent: Math.round(deviation * 10) / 10,
    nearestStandard,
  };
}
