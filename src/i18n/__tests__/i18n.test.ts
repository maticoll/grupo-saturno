import { describe, it, expect } from 'vitest';
import es from '../es.json';
import en from '../en.json';
import zh from '../zh.json';

function getLeafKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) return [fullKey];
    if (typeof value === 'object' && value !== null) return getLeafKeys(value as object, fullKey);
    return [fullKey];
  });
}

describe('i18n completeness', () => {
  const esKeys = getLeafKeys(es).filter(k => !k.startsWith('_'));
  const enKeys = getLeafKeys(en).filter(k => !k.startsWith('_'));
  const zhKeys = getLeafKeys(zh).filter(k => !k.startsWith('_'));

  it('EN has all keys from ES', () => {
    const missing = esKeys.filter(k => !enKeys.includes(k));
    expect(missing, `Missing in EN: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('ZH has all keys from ES', () => {
    const missing = esKeys.filter(k => !zhKeys.includes(k));
    expect(missing, `Missing in ZH: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('no empty string values in ES', () => {
    const empty = esKeys.filter(k => {
      const keys = k.split('.');
      let v: unknown = es;
      for (const key of keys) v = (v as Record<string, unknown>)?.[key];
      return v === '';
    });
    expect(empty, `Empty keys in ES: ${empty.join(', ')}`).toHaveLength(0);
  });
});
