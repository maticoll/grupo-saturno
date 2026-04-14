export const languages = ['es', 'en', 'zh'] as const;
export type Lang = typeof languages[number];
export const defaultLang: Lang = 'es';

// Import all translations statically to avoid top-level await issues
import esTranslations from './es.json';
import enTranslations from './en.json';
import zhTranslations from './zh.json';

type Translations = typeof esTranslations;

const translations: Record<Lang, Translations> = {
  es: esTranslations as Translations,
  en: enTranslations as Translations,
  zh: zhTranslations as Translations,
};

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (languages.includes(lang as Lang)) return lang as Lang;
  return defaultLang;
}

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
