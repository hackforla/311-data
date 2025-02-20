import { describe, expect, test } from 'vitest';
import { isEmpty } from '@utils';

describe('isEmpty', () => {
  test('nullish value', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  test('empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  test('empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  test('non-empty array', () => {
    expect(isEmpty([1, 2])).toBe(false);
  });
});
