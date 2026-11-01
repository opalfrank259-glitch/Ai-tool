/**
 * Palette Matching & Color Distance Calculator
 */

import { hexToRgb, RGB } from './contrast';

export interface PaletteMatchResult {
  closestApprovedColor: string;
  distance: number;
  isWithinTolerance: boolean;
}

// Simple Euclidean RGB distance
export function rgbDistance(c1: RGB, c2: RGB): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function findClosestColor(colorHex: string, approvedPalette: string[], maxTolerance: number = 65): PaletteMatchResult {
  const targetRgb = hexToRgb(colorHex);
  let minDistance = Infinity;
  let closestColor = approvedPalette[0] || colorHex;

  for (const approvedHex of approvedPalette) {
    const dist = rgbDistance(targetRgb, hexToRgb(approvedHex));
    if (dist < minDistance) {
      minDistance = dist;
      closestColor = approvedHex;
    }
  }

  return {
    closestApprovedColor: closestColor,
    distance: Math.round(minDistance * 10) / 10,
    isWithinTolerance: minDistance <= maxTolerance,
  };
}

export function evaluateDesignPaletteHarmony(
  extractedColors: string[],
  approvedPalette: string[]
): {
  matchedCount: number;
  unmatchedCount: number;
  adherencePercentage: number;
  details: PaletteMatchResult[];
} {
  if (extractedColors.length === 0 || approvedPalette.length === 0) {
    return {
      matchedCount: 0,
      unmatchedCount: 0,
      adherencePercentage: 100,
      details: [],
    };
  }

  const details = extractedColors.map(c => findClosestColor(c, approvedPalette));
  const matchedCount = details.filter(d => d.isWithinTolerance).length;
  const adherencePercentage = Math.round((matchedCount / details.length) * 100);

  return {
    matchedCount,
    unmatchedCount: details.length - matchedCount,
    adherencePercentage,
    details,
  };
}
