import { errorCodes } from '@surplusdrop/shared';
import { describe, expect, it } from 'vitest';
import { errorCopy } from './errors';

describe('errorCopy', () => {
  it('has a message and a next action for every API error code', () => {
    for (const code of errorCodes) {
      expect(errorCopy[code].message, code).not.toBe('');
      expect(errorCopy[code].action, code).not.toBe('');
    }
  });
});
