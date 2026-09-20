import test from 'node:test';
import assert from 'node:assert/strict';

import en from '../locales/en.js';
import tr from '../locales/tr.js';
import { flattenKeys, resolveLanguage } from '../localization.js';

const baseContext = {
  search: '',
  storedLanguage: null,
  timeZone: 'America/New_York',
  languages: ['en-US'],
};

test('explicit URL language has highest priority', () => {
  assert.equal(resolveLanguage({ ...baseContext, search: '?lang=tr', storedLanguage: 'en', timeZone: 'America/New_York', languages: ['en-US'] }), 'tr');
  assert.equal(resolveLanguage({ ...baseContext, search: '?lang=en', storedLanguage: 'tr', timeZone: 'Europe/Istanbul', languages: ['tr-TR'] }), 'en');
});

test('manual language wins over environment fallbacks', () => {
  assert.equal(resolveLanguage({ ...baseContext, storedLanguage: 'tr', timeZone: 'Europe/Istanbul', languages: ['en-US'] }), 'tr');
  assert.equal(resolveLanguage({ ...baseContext, storedLanguage: 'en', timeZone: 'Europe/Istanbul', languages: ['tr-TR'] }), 'en');
});

test('Turkey timezone and Turkish browser language are deterministic fallbacks', () => {
  assert.equal(resolveLanguage({ ...baseContext, timeZone: 'Europe/Istanbul' }), 'tr');
  assert.equal(resolveLanguage({ ...baseContext, languages: ['tr-TR', 'en-US'] }), 'tr');
  assert.equal(resolveLanguage({ ...baseContext, languages: ['en-GB', 'de-DE'] }), 'en');
});

test('English and Turkish dictionaries keep the same translation keys', () => {
  assert.deepEqual(flattenKeys(en), flattenKeys(tr));
});
