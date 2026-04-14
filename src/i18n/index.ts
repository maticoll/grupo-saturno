export const languages = ['es', 'en', 'zh'] as const;
export type Lang = typeof languages[number];
export const defaultLang: Lang = 'es';

// Import all translations statically to avoid top-level await issues
import esTranslations from './es.json';
import enTranslations from './en.json';
import zhTranslations from './zh.json';

const translations = {
  es: esTranslations,
  en: enTranslations,
  zh: zhTranslations,
} satisfies Record<Lang, typeof esTranslations>;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (languages.includes(lang as Lang)) return lang as Lang;
  return defaultLang;
}

/**
 * Returns a translation function for the given locale.
 * For array/object keys, returns a JSON-serialised string — caller must JSON.parse().
 */
export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = translations[lang];
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    if (value === undefined) {
      // Fallback to Spanish
      let fallback: unknown = translations[defaultLang];
      for (const k of keys) {
        fallback = (fallback as Record<string, unknown>)?.[k];
      }
      // Return raw value if array or object (for component iteration)
      if (Array.isArray(fallback) || (typeof fallback === 'object' && fallback !== null)) {
        return JSON.stringify(fallback);
      }
      return String(fallback ?? key);
    }
    // Return raw value if array or object (for component iteration)
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      return JSON.stringify(value);
    }
    return String(value);
  };
}
