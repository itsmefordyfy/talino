import { describe, expect, test } from '@jest/globals';

import { AUDIO_VOICE, audioFileName, formatClock, lessonAudioUrl, lessonPeaksUrl, listenPlan, nextSpeed, parsePeaks, playbackRate, recordingVoice, resamplePeaks } from './lesson-audio';

describe('lessonAudioUrl', () => {
  test('is the origin, the voice and the lesson, whatever the origin ends with', () => {
    expect(lessonAudioUrl('https://audio.example.com', 'developer-03')).toBe(`https://audio.example.com/${AUDIO_VOICE}/developer-03.m4a`);
    expect(lessonAudioUrl('https://audio.example.com/', 'developer-03')).toBe(`https://audio.example.com/${AUDIO_VOICE}/developer-03.m4a`);
  });
  test('there is no audio without an origin', () => {
    expect(lessonAudioUrl('', 'developer-03')).toBeNull();
    expect(lessonAudioUrl(undefined, 'developer-03')).toBeNull();
  });
  test('never builds an address from an odd lesson id or an insecure origin', () => {
    expect(lessonAudioUrl('https://audio.example.com', '../secret')).toBeNull();
    expect(lessonAudioUrl('https://audio.example.com', 'a/b')).toBeNull();
    expect(lessonAudioUrl('http://audio.example.com', 'developer-03')).toBeNull();
  });
  test('plain http to a computer on the same Wi-Fi is allowed only while developing', () => {
    expect(lessonAudioUrl('http://192.168.100.247:8099', 'starter-01', { development: true })).toBe(`http://192.168.100.247:8099/${AUDIO_VOICE}/starter-01.m4a`);
    expect(lessonAudioUrl('http://10.0.0.5:8099', 'starter-01', { development: true })).not.toBeNull();
    expect(lessonAudioUrl('http://192.168.100.247:8099', 'starter-01')).toBeNull();
    expect(lessonAudioUrl('http://8.8.8.8:8099', 'starter-01', { development: true })).toBeNull();
    expect(lessonAudioUrl('http://192.168.100.247.evil.example', 'starter-01', { development: true })).toBeNull();
  });
  test('plain http is allowed only for a machine on this computer (testing)', () => {
    expect(lessonAudioUrl('http://localhost:8099', 'starter-01')).toBe(`http://localhost:8099/${AUDIO_VOICE}/starter-01.m4a`);
    expect(lessonAudioUrl('http://127.0.0.1:8099', 'starter-01')).not.toBeNull();
  });
});

describe('audioFileName', () => {
  test('one file per voice and lesson, so a new voice never plays an old recording', () => {
    expect(audioFileName('starter-01')).toBe(`${AUDIO_VOICE}-starter-01.m4a`);
  });
});

describe('listenPlan', () => {
  test('a saved recording always plays, online or not', () => {
    expect(listenPlan({ hasOrigin: true, cached: true, online: false })).toBe('play-saved');
    expect(listenPlan({ hasOrigin: false, cached: true, online: true })).toBe('play-saved');
  });
  test('a recording that is not saved is downloaded when there is a place to get it and a connection', () => {
    expect(listenPlan({ hasOrigin: true, cached: false, online: true })).toBe('download');
  });
  test('otherwise the phone reads the lesson', () => {
    expect(listenPlan({ hasOrigin: true, cached: false, online: false })).toBe('phone-voice');
    expect(listenPlan({ hasOrigin: false, cached: false, online: true })).toBe('phone-voice');
  });
});

describe('playbackRate', () => {
  test('follows the reading-speed setting, within what sounds natural', () => {
    expect(playbackRate(1)).toBe(1);
    expect(playbackRate(0.5)).toBe(0.8);
    expect(playbackRate(2)).toBe(1.2);
    expect(playbackRate(Number.NaN)).toBe(1);
  });
});

describe('waveform helpers', () => {
  const wave = Array.from({ length: 96 }, (_, index) => (index % 10) / 10);
  test('the waveform file sits next to the recording', () => {
    expect(lessonPeaksUrl('https://a.example.com', 'starter-01')).toBe(`https://a.example.com/${AUDIO_VOICE}/starter-01.peaks.json`);
    expect(lessonPeaksUrl('', 'starter-01')).toBeNull();
  });
  test('parsePeaks accepts a real waveform and refuses everything else', () => {
    expect(parsePeaks({ peaks: wave })).toEqual(wave);
    expect(parsePeaks({ peaks: [0.5] })).toBeNull();
    expect(parsePeaks({ peaks: wave.map((value, index) => (index === 3 ? 2 : value)) })).toBeNull();
    expect(parsePeaks({ peaks: wave.map(String) })).toBeNull();
    expect(parsePeaks(null)).toBeNull();
    expect(parsePeaks('x')).toBeNull();
  });
  test('resamplePeaks gives the bars asked for, keeping the loudest of each slice', () => {
    expect(resamplePeaks([0.1, 0.9, 0.2, 0.3], 2)).toEqual([0.9, 0.3]);
    expect(resamplePeaks(wave, 48)).toHaveLength(48);
    expect(resamplePeaks([0.5, 0.6], 4)).toHaveLength(4);
    expect(resamplePeaks(wave, 0)).toEqual([]);
  });
  test('formatClock', () => {
    expect(formatClock(185.7)).toBe('3:05');
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(-4)).toBe('0:00');
    expect(formatClock(Number.NaN)).toBe('0:00');
  });
  test('nextSpeed steps through the speeds and wraps', () => {
    expect(nextSpeed(1)).toBe(1.1);
    expect(nextSpeed(1.2)).toBe(0.8);
    expect(nextSpeed(0.97)).toBe(1.1);
  });
});

describe('the coach’s voice', () => {
  test('Tala’s recordings are looked up under her voice, Tali’s stay where they were', () => {
    expect(lessonAudioUrl('https://audio.example.com', 'starter-01', { voice: 'af_heart' })).toBe('https://audio.example.com/af_heart/starter-01.m4a');
    expect(lessonAudioUrl('https://audio.example.com', 'starter-01')).toBe(`https://audio.example.com/${AUDIO_VOICE}/starter-01.m4a`);
    expect(lessonPeaksUrl('https://audio.example.com', 'starter-01', { voice: 'af_heart' })).toBe('https://audio.example.com/af_heart/starter-01.peaks.json');
  });

  test('a voice that is not a plain lowercase id never reaches an address', () => {
    expect(lessonAudioUrl('https://audio.example.com', 'starter-01', { voice: '../x' })).toBeNull();
    expect(lessonAudioUrl('https://audio.example.com', 'starter-01', { voice: 'Achird' })).toBeNull();
    expect(lessonAudioUrl('https://audio.example.com', 'starter-01', { voice: 'a' })).toBeNull();
    expect(lessonAudioUrl('https://audio.example.com', 'starter-01', { voice: 'af_heart/../../x' })).toBeNull();
  });

  test('each voice is saved under its own file name, so switching coach never plays the other voice', () => {
    expect(audioFileName('starter-01', 'af_heart')).toBe('af_heart-starter-01.m4a');
    expect(audioFileName('starter-01')).toBe(`${AUDIO_VOICE}-starter-01.m4a`);
    expect(audioFileName('starter-01', 'af_heart')).not.toBe(audioFileName('starter-01'));
  });

  test('a Tagalog recording lives in its own folder, so an English one is never played under Tagalog text (and the saved place is per language)', () => {
    expect(recordingVoice('am_puck', 'en')).toBe('am_puck');
    expect(recordingVoice('am_puck', 'fil')).toBe('am_puck_fil');
    expect(lessonAudioUrl('https://audio.example.com', 'starter-01', { voice: recordingVoice('af_heart', 'fil') })).toBe('https://audio.example.com/af_heart_fil/starter-01.m4a');
    expect(audioFileName('starter-01', recordingVoice('am_puck', 'fil'))).not.toBe(audioFileName('starter-01', 'am_puck'));
  });
});
