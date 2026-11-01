import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateContrastRatio, evaluateWcagCompliance } from './contrast';
import { checkAspectRatio } from './aspect';
import { checkSafeMargins } from './margins';
import { findClosestColor, evaluateDesignPaletteHarmony } from './palette';
import { calculateVarianceOfLaplacian } from './blur';

test('contrast ratio calculates black on white as 21:1', () => {
  const ratio = calculateContrastRatio('#000000', '#ffffff');
  assert.equal(ratio, 21);
  const evalResult = evaluateWcagCompliance(ratio);
  assert.equal(evalResult.aaNormal, true);
  assert.equal(evalResult.aaaNormal, true);
  assert.equal(evalResult.rating, 'aaa');
});

test('contrast ratio flags low contrast yellow on white as fail', () => {
  const ratio = calculateContrastRatio('#ffff00', '#ffffff');
  assert.ok(ratio < 3.0);
  const evalResult = evaluateWcagCompliance(ratio);
  assert.equal(evalResult.aaNormal, false);
  assert.equal(evalResult.rating, 'fail');
});

test('aspect ratio verification works for standard Instagram 1080x1080', () => {
  const check = checkAspectRatio(1080, 1080, '1:1');
  assert.equal(check.ratioMatches, true);
  assert.equal(check.deviationPercent, 0);
  assert.equal(check.nearestStandard, '1:1');
});

test('aspect ratio flags mismatched 1200x600 when expecting 1:1', () => {
  const check = checkAspectRatio(1200, 600, '1:1');
  assert.equal(check.ratioMatches, false);
  assert.ok(check.deviationPercent > 50);
});

test('safe margins detects elements too close to edge', () => {
  // Content starting at x=10 on 1000px canvas is 1% margin -> unsafe
  const result = checkSafeMargins({ x: 10, y: 100, width: 800, height: 600 }, 1000, 1000, 5);
  assert.equal(result.isSafe, false);
  assert.ok(result.warnings.length > 0);
  assert.equal(result.leftMarginPercent, 1);
});

test('safe margins passes when content is well inside safe zone', () => {
  const result = checkSafeMargins({ x: 80, y: 80, width: 840, height: 840 }, 1000, 1000, 5);
  assert.equal(result.isSafe, true);
  assert.equal(result.warnings.length, 0);
});

test('palette adherence checks extracted colors against brand palette', () => {
  const approved = ['#1e293b', '#f59e0b', '#ffffff'];
  const extracted = ['#1e293a', '#f59e0c', '#ffffff']; // extremely close
  const harmony = evaluateDesignPaletteHarmony(extracted, approved);
  assert.equal(harmony.matchedCount, 3);
  assert.equal(harmony.adherencePercentage, 100);
});

test('blur sharpness metric scores high variance as sharp', () => {
  const highVariance = [0, 255, 0, 255, 0, 255, 0, 255];
  const res = calculateVarianceOfLaplacian(highVariance);
  assert.equal(res.status, 'sharp');
  assert.equal(res.isAcceptablySharp, true);
});

test('PhotopeaAdapter produces correct embed URL and document info', async () => {
  const { PhotopeaAdapter } = await import('../editor/EditorAdapter');
  const adapter = new PhotopeaAdapter();
  assert.equal(adapter.name, 'photopea');
  const embedUrl = adapter.getEmbedUrl();
  assert.ok(embedUrl.includes('photopea.com'));
  const docInfo = await adapter.getDocumentInfo();
  assert.equal(docInfo?.width, 1080);
  assert.equal(docInfo?.height, 1080);
  assert.equal(docInfo?.dpi, 300);
});

