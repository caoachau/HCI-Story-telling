import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CONTENT_EVIDENCE, approvedMedia, approvedPeople, approvedObjects, approvedActivity, approvedRules, approvedComparisons, confirmedAccess } from '../src/experience/content.ts';
import { CON_CHIM_EN, MEMORIAL_EN, CON_CHIM_LAYERS_EN } from '../src/experience/englishStories.ts';

globalThis.location = { href: 'https://example.test/heritage/index.html' };
const source = { label: 'TEST ONLY reference', url: 'https://example.test/reference' };
const copy = { vi: 'Dữ liệu kiểm thử', en: 'Test fixture only' };
const review = { reviewer: 'TEST ONLY reviewer', reviewedAt: '2026-10-28' };
const site = CONTENT_EVIDENCE['con-chim'];
const original = structuredClone(site);
try {
  // No fabricated recordings, community permissions or local logistics are shipped.
  for (const id of Object.keys(CONTENT_EVIDENCE)) {
    assert.equal(approvedMedia(id).length, 0);
    assert.equal(approvedPeople(id).length, 0);
    assert.equal(confirmedAccess(id), null);
  }
  const media = { id: 'test', title: copy, url: '/test.mp4', transcript: copy, captions: { vi: '/vi.vtt', en: '/en.vtt' }, narrator: 'TEST ONLY narrator', recordedAt: '2026-10-20', permissionReference: 'TEST ONLY consent', source, ...review };
  site.media = [media]; assert.equal(approvedMedia('con-chim').length, 1);
  for (const patch of [{ permissionReference: '' }, { recordedAt: '2026-02-31' }, { url: 'javascript:alert(1)' }, { transcript: { vi: 'test', en: '' } }, { captions: { vi: '/vi.vtt', en: '' } }, { source: { ...source, url: 'javascript:alert(1)' } }]) {
    site.media = [{ ...media, ...patch }]; assert.equal(approvedMedia('con-chim').length, 0, JSON.stringify(patch));
  }
  site.people = [{ id: 'test', name: copy, role: copy, account: copy, source, permissionReference: ' ', ...review }];
  assert.equal(approvedPeople('con-chim').length, 0); site.people[0].permissionReference = 'TEST ONLY consent'; assert.equal(approvedPeople('con-chim').length, 1);
  site.objects = { test: { name: copy, usedBy: copy, use: copy, displayReason: copy, source, ...review } };
  assert.equal(approvedObjects('con-chim').length, 1); site.objects.test.displayReason = { ...copy, en: '' }; assert.equal(approvedObjects('con-chim').length, 0);
  site.activity = { host: copy, contact: copy, schedule: copy, conditions: copy, source, ...review };
  assert.ok(approvedActivity('con-chim')); site.activity.reviewedAt = ''; assert.equal(approvedActivity('con-chim'), null);
  site.localRules = [{ action: copy, reason: copy, scope: copy, source, approvedBy: 'TEST ONLY host', approvedAt: '2026-10-20' }];
  assert.equal(approvedRules('con-chim').length, 1); site.localRules[0].approvedBy = ''; assert.equal(approvedRules('con-chim').length, 0);
  site.historicalPairs = [{ id: 'test', past: { image: '/a.jpg', label: copy, description: copy, year: '2000', source, rights: 'TEST ONLY' }, present: { image: '/b.jpg', label: copy, description: copy, source, rights: 'TEST ONLY' }, ...review }];
  assert.equal(approvedComparisons('con-chim').length, 1); site.historicalPairs[0].present.image = '/a.jpg'; assert.equal(approvedComparisons('con-chim').length, 0);
} finally { CONTENT_EVIDENCE['con-chim'] = original; }
console.log('PASS reviewed-content gates reject missing consent, invalid dates, unsafe URLs, missing translations and duplicate comparison images.');

const exported = JSON.parse(fs.readFileSync(new URL('../preview/locale-source.json', import.meta.url), 'utf8'));
for (const [items, translated] of [[exported.conChim, CON_CHIM_EN], [exported.memorial, MEMORIAL_EN]]) for (const item of items) {
  const value = translated[item.id]; assert.ok(value?.title && value.question && value.summary.length && value.detail, item.id);
}
for (const [id, layer] of Object.entries(exported.layers)) {
  for (const question of layer.questions) assert.ok(CON_CHIM_LAYERS_EN[id]?.questions[question.id]?.every(Boolean), `${id}:question:${question.id}`);
  for (const point of layer.points) assert.ok(CON_CHIM_LAYERS_EN[id]?.points[point.id]?.every(Boolean), `${id}:point:${point.id}`);
}
console.log(`PASS English coverage: ${exported.conChim.length} Con Chim stories, ${exported.memorial.length} memorial stories, and every native question/image point ID.`);
