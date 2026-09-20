import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildMailtoUrl,
  copyEmailToClipboard,
} from '../email-actions.js';

const email = 'dogukannakin@gmail.com';

test('copyEmailToClipboard writes the email when Clipboard API succeeds', async () => {
  let copiedValue = null;
  let fallbackCalled = false;

  const result = await copyEmailToClipboard({
    email,
    clipboard: {
      writeText: async (value) => {
        copiedValue = value;
      },
    },
    onFallback: () => {
      fallbackCalled = true;
    },
  });

  assert.deepEqual(result, { copied: true, fallback: false });
  assert.equal(copiedValue, email);
  assert.equal(fallbackCalled, false);
});

test('copyEmailToClipboard falls back to mailto when Clipboard API is unavailable', async () => {
  let fallbackUrl = null;

  const result = await copyEmailToClipboard({
    email,
    clipboard: null,
    onFallback: (url) => {
      fallbackUrl = url;
    },
  });

  assert.deepEqual(result, { copied: false, fallback: true });
  assert.equal(fallbackUrl, buildMailtoUrl(email));
});

test('copyEmailToClipboard falls back when Clipboard API rejects', async () => {
  let fallbackUrl = null;

  const result = await copyEmailToClipboard({
    email,
    clipboard: {
      writeText: async () => {
        throw new Error('Clipboard denied');
      },
    },
    onFallback: (url) => {
      fallbackUrl = url;
    },
  });

  assert.deepEqual(result, { copied: false, fallback: true });
  assert.equal(fallbackUrl, buildMailtoUrl(email));
});
