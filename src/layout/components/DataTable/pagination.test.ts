import { describe, expect, it } from 'vitest';

import { normalizePage } from './pagination';

describe('normalizePage', () => {
  it('mantém uma página válida', () => {
    expect(normalizePage(1, 10, 30)).toBe(1);
  });

  it('volta para a última página existente quando os dados diminuem', () => {
    expect(normalizePage(3, 10, 15)).toBe(1);
    expect(normalizePage(2, 10, 0)).toBe(0);
  });
});
