import { describe, expect, test } from '@jest/globals';

import { ApiError } from '@/lib/api';

import { parseReview } from '../lib/ai';
import { parseContent } from '../lib/document';
import { aiErrorKey, readImproved, readReview } from './ai-client';

const content = parseContent({ summary: 'Builds apps.', skills: ['React'], experience: [{ id: 'a', title: 'Dev', bullets: ['Built it', 'Fixed it'] }] });

describe('readReview', () => {
  test('accepts exactly what the server\'s parser produces, after a trip through JSON', () => {
    const review = parseReview(
      JSON.stringify({ verdict: 'Fine.', weak: [{ section: 'skills', advice: 'Add more.' }], suggestions: [{ section: 'summary', after: 'Builds apps with React.', reason: 'Names a tool.' }, { section: 'experience', id: 'a', index: 1, after: 'Fixed the bugs', reason: 'Clearer.' }], skills: [], questions: ['Which tools?'] }),
      content,
    );
    expect(review).not.toBeNull();
    expect(readReview(JSON.parse(JSON.stringify(review)))).toEqual(review);
  });

  test('refuses anything that is not review-shaped, and drops malformed suggestions', () => {
    expect(readReview(null)).toBeNull();
    expect(readReview({ verdict: '', suggestions: [] })).toBeNull();
    expect(readReview({ verdict: 'ok', suggestions: 'nope' })).toBeNull();
    const review = readReview({ verdict: 'ok', weak: [], questions: [], suggestions: [{ key: 'k', kind: 'skill', skill: 'SQL', evidence: 'e', reason: 'r' }, { kind: 'rewrite' }, { key: 'x', kind: 'weird' }] });
    expect(review?.suggestions).toHaveLength(1);
  });
});

describe('readImproved', () => {
  test('needs bullets', () => {
    expect(readImproved({ bullets: ['A', 'B'], reason: 'r', questions: ['q'] })).toEqual({ bullets: ['A', 'B'], reason: 'r', questions: ['q'] });
    expect(readImproved({ bullets: [] })).toBeNull();
    expect(readImproved(undefined)).toBeNull();
  });
});

describe('aiErrorKey', () => {
  test('maps the server\'s codes to what the learner is told; anything unknown is "unknown"', () => {
    expect(aiErrorKey(new ApiError('network'))).toBe('offline');
    for (const code of ['unavailable', 'all_access_required', 'resume_limit', 'busy', 'file_too_large', 'unsupported_file', 'unreadable_file'] as const) expect(aiErrorKey(new ApiError(code, 400))).toBe(code);
    expect(aiErrorKey(new ApiError('quota_unavailable', 503))).toBe('busy');
    expect(aiErrorKey(new ApiError('chat_in_progress', 409))).toBe('busy');
    expect(aiErrorKey(new ApiError('weird', 500))).toBe('unknown');
    expect(aiErrorKey(new Error('x'))).toBe('unknown');
  });
});
