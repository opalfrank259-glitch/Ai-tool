/**
 * Sharpness and Blur Score Estimation
 * Uses variance of high-frequency luminance differences as a lightweight proxy for sharpness
 */

export function calculateVarianceOfLaplacian(pixelLuminances: number[]): {
  sharpnessScore: number;
  isAcceptablySharp: boolean;
  status: 'sharp' | 'acceptable' | 'blurry';
} {
  if (pixelLuminances.length < 4) {
    return { sharpnessScore: 0, isAcceptablySharp: false, status: 'blurry' };
  }

  // Calculate mean
  const sum = pixelLuminances.reduce((acc, val) => acc + val, 0);
  const mean = sum / pixelLuminances.length;

  // Calculate variance
  const variance = pixelLuminances.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / pixelLuminances.length;
  const sharpnessScore = Math.round(variance * 10) / 10;

  let status: 'sharp' | 'acceptable' | 'blurry' = 'blurry';
  if (sharpnessScore >= 100) {
    status = 'sharp';
  } else if (sharpnessScore >= 40) {
    status = 'acceptable';
  }

  return {
    sharpnessScore,
    isAcceptablySharp: sharpnessScore >= 40,
    status,
  };
}
