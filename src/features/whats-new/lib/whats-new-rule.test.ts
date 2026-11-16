import { describe, expect, it } from '@jest/globals';

import { notesToShow, compareVersions, RELEASE_NOTES } from './release-notes';
import { whatsNewAction } from './whats-new-rule';

const base = { version: '1.1', lastSeen: '1.0', onboarded: true, hasNotes: true, pathname: '/' };

describe('whatsNewAction', () => {
  it('shows the notes once after an update, on Home', () => {
    expect(whatsNewAction(base)).toBe('show');
  });
  it('waits while another screen is up', () => {
    expect(whatsNewAction({ ...base, pathname: '/lesson/x' })).toBe('wait');
  });
  it('does nothing once the version is seen', () => {
    expect(whatsNewAction({ ...base, lastSeen: '1.1' })).toBe('none');
  });
  it('marks a fresh install as up to date without showing anything', () => {
    expect(whatsNewAction({ ...base, lastSeen: null, onboarded: false })).toBe('mark');
  });
  it('leaves an install that is mid-welcome with a saved version alone', () => {
    expect(whatsNewAction({ ...base, onboarded: false })).toBe('none');
  });
  it('shows the notes once to an install from before this feature that has been used', () => {
    expect(whatsNewAction({ ...base, lastSeen: null })).toBe('show');
  });
  it('writes nothing for a version with no notes', () => {
    expect(whatsNewAction({ ...base, hasNotes: false })).toBe('none');
  });
  it('does nothing without a version', () => {
    expect(whatsNewAction({ ...base, version: '' })).toBe('none');
  });
});

describe('release notes', () => {
  it('compares versions as numbers', () => {
    expect(compareVersions('1.10', '1.9')).toBeGreaterThan(0);
  });
  it('shows the newest notes for a version that has none', () => {
    const newest = Object.keys(RELEASE_NOTES).sort(compareVersions).at(-1);
    expect(notesToShow('0.0').version).toBe(newest);
  });
  it('has notes for the app version in app.json', () => {
    const { version } = require('../../../../app.json').expo as { version: string };
    expect(RELEASE_NOTES[version]?.length ?? 0).toBeGreaterThan(0);
  });
});
