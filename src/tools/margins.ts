/**
 * Safe Margins and Bleed Boundary Tool
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MarginCheckResult {
  topMarginPercent: number;
  bottomMarginPercent: number;
  leftMarginPercent: number;
  rightMarginPercent: number;
  minMarginPercent: number;
  isSafe: boolean; // meets minimum threshold (e.g. 5% safe area)
  warnings: string[];
}

export function checkSafeMargins(
  contentBox: BoundingBox,
  canvasWidth: number,
  canvasHeight: number,
  minSafePercent: number = 5
): MarginCheckResult {
  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return {
      topMarginPercent: 0,
      bottomMarginPercent: 0,
      leftMarginPercent: 0,
      rightMarginPercent: 0,
      minMarginPercent: 0,
      isSafe: false,
      warnings: ['Invalid canvas dimensions.'],
    };
  }

  const leftMarginPercent = (contentBox.x / canvasWidth) * 100;
  const topMarginPercent = (contentBox.y / canvasHeight) * 100;
  const rightMarginPercent = ((canvasWidth - (contentBox.x + contentBox.width)) / canvasWidth) * 100;
  const bottomMarginPercent = ((canvasHeight - (contentBox.y + contentBox.height)) / canvasHeight) * 100;

  const minMarginPercent = Math.min(
    leftMarginPercent,
    topMarginPercent,
    rightMarginPercent,
    bottomMarginPercent
  );

  const warnings: string[] = [];
  if (leftMarginPercent < minSafePercent) {
    warnings.push(`Left margin is only ${leftMarginPercent.toFixed(1)}% (minimum recommended: ${minSafePercent}%). Text or logo may get cut off.`);
  }
  if (rightMarginPercent < minSafePercent) {
    warnings.push(`Right margin is only ${rightMarginPercent.toFixed(1)}% (minimum recommended: ${minSafePercent}%).`);
  }
  if (topMarginPercent < minSafePercent) {
    warnings.push(`Top margin is only ${topMarginPercent.toFixed(1)}% (minimum recommended: ${minSafePercent}%).`);
  }
  if (bottomMarginPercent < minSafePercent) {
    warnings.push(`Bottom margin is only ${bottomMarginPercent.toFixed(1)}% (minimum recommended: ${minSafePercent}%). Essential contact info or CTA may be trimmed.`);
  }

  return {
    topMarginPercent: Math.round(topMarginPercent * 10) / 10,
    bottomMarginPercent: Math.round(bottomMarginPercent * 10) / 10,
    leftMarginPercent: Math.round(leftMarginPercent * 10) / 10,
    rightMarginPercent: Math.round(rightMarginPercent * 10) / 10,
    minMarginPercent: Math.round(minMarginPercent * 10) / 10,
    isSafe: minMarginPercent >= minSafePercent,
    warnings,
  };
}
