import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as Sentry from '@sentry/react-native';

import { reportError } from './monitoring';

const captureException = Sentry.captureException as jest.Mock;

describe('reportError', () => {
  beforeEach(() => {
    captureException.mockClear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sends the error to Sentry tagged with its feature and its non-personal details', () => {
    const error = new Error('lesson_audio failed');
    reportError(error, 'courses', { step: 'lesson_audio' });
    expect(captureException).toHaveBeenCalledWith(error, { tags: { feature: 'courses' }, extra: { step: 'lesson_audio' } });
  });

  test('wraps something that is not an Error so Sentry still gets a stack and a message', () => {
    reportError('boom', 'app');
    const sent = captureException.mock.calls[0][0] as Error;
    expect(sent).toBeInstanceOf(Error);
    expect(sent.message).toBe('boom');
  });
});
