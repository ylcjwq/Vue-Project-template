import { expect, it } from 'vitest';
import { sum, multiply } from '@/utils/sum.ts';

it('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

it('multiplies 3 * 4 to equal 12', () => {
  expect(multiply(3, 4)).toBe(12);
});
