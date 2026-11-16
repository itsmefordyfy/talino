import { describe, expect, test } from '@jest/globals';

import { addPhotos, feedbackEmail, feedbackMailto, feedbackProblems, FEEDBACK_MAX_MESSAGE, FEEDBACK_MAX_PHOTOS } from './feedback';

describe('feedbackProblems', () => {
  test('needs a message', () => {
    expect(feedbackProblems('   ')).toEqual(['message_missing']);
  });
  test('caps the message', () => {
    expect(feedbackProblems('a'.repeat(FEEDBACK_MAX_MESSAGE + 1))).toEqual(['message_long']);
    expect(feedbackProblems('a'.repeat(FEEDBACK_MAX_MESSAGE))).toEqual([]);
  });
});

describe('feedbackEmail', () => {
  const device = { appVersion: '1.0 (3)', system: 'iOS 27.2', model: 'iPhone 18 Pro' };
  const at = new Date('2026-11-16T08:00:00.000Z');

  test('keeps the message first and adds the details under it', () => {
    const { subject, body } = feedbackEmail({ kind: 'bug', message: '  It crashes  ' }, device, 'en', at);
    expect(subject).toBe('Talino Feedback - Bug Report');
    expect(body).toBe('It crashes\n\n—\nType: Bug Report\nSent: 2026-11-16T08:00:00.000Z\nTalino 1.0 (3) · iOS 27.2 · iPhone 18 Pro · English');
  });
  test('leaves out an unknown model', () => {
    const { body } = feedbackEmail({ kind: 'feature', message: 'Dark charts' }, { ...device, model: null }, 'fil', at);
    expect(body).toContain('Talino 1.0 (3) · iOS 27.2 · Tagalog');
  });
});

describe('feedbackMailto', () => {
  test('encodes the subject and the body', () => {
    const url = feedbackMailto('support@fordytechsolutions.com', { subject: 'Talino Feedback - Other', body: 'Hi & bye\n—' });
    expect(url).toBe('mailto:support@fordytechsolutions.com?subject=Talino%20Feedback%20-%20Other&body=Hi%20%26%20bye%0A%E2%80%94');
  });
});

describe('feedbackEmail with photos', () => {
  const device = { appVersion: '1.0 (3)', system: 'iOS 27.2', model: 'iPhone 18 Pro' };
  const at = new Date('2026-11-16T08:00:00.000Z');
  test('says how many photos are attached, and says nothing when there are none', () => {
    const withPhotos = feedbackEmail({ kind: 'bug', message: 'Look', photos: ['a.jpg', 'b.jpg'] }, device, 'en', at).body;
    expect(withPhotos).toContain('Photos: 2 attached');
    expect(feedbackEmail({ kind: 'bug', message: 'Look', photos: [] }, device, 'en', at).body).not.toContain('Photos:');
    expect(feedbackEmail({ kind: 'bug', message: 'Look' }, device, 'en', at).body).not.toContain('Photos:');
  });
});

describe('addPhotos', () => {
  test('adds the picked photos after the ones already chosen, in the order picked', () => {
    expect(addPhotos(['a'], ['b', 'c'], FEEDBACK_MAX_PHOTOS)).toEqual(['a', 'b', 'c']);
  });
  test('attaches the same screenshot once, even picked twice or twice in one pick', () => {
    expect(addPhotos(['a', 'b'], ['b', 'c', 'c'], FEEDBACK_MAX_PHOTOS)).toEqual(['a', 'b', 'c']);
  });
  test('never goes past the limit, keeping the earlier ones', () => {
    expect(addPhotos(['a', 'b', 'c'], ['d', 'e', 'f'], 4)).toEqual(['a', 'b', 'c', 'd']);
    expect(addPhotos(['a', 'b'], ['c'], 2)).toEqual(['a', 'b']);
  });
  test('five is the most one message takes, as in the other apps', () => {
    expect(FEEDBACK_MAX_PHOTOS).toBe(5);
  });
  test('picking nothing changes nothing, and does not change the list it was given', () => {
    const current = ['a'];
    expect(addPhotos(current, [], FEEDBACK_MAX_PHOTOS)).toEqual(['a']);
    addPhotos(current, ['b'], FEEDBACK_MAX_PHOTOS);
    expect(current).toEqual(['a']);
  });
});
