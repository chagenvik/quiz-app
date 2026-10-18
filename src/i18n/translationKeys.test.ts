import { describe, expect, it } from 'vitest';
import en from './en.json';
import nb from './nb.json';

function collectKeys(dictionary: Record<string, string>) {
  return Object.keys(dictionary).sort();
}

describe('translation dictionaries', () => {
  it('keep the same keys in nb and en', () => {
    expect(collectKeys(nb)).toEqual(collectKeys(en));
  });
});
