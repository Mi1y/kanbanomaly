import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { translations } from './translator';

export type Language = 'en' | 'pl' | 'de';

function detectBrowserLanguage(): Language {
  if (!browser) return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('pl')) return 'pl';
  if (browserLang.startsWith('de')) return 'de';
  return 'en';
}

function getInitialLanguage(): Language {
  if (!browser) return 'en';
  
  const saved = localStorage.getItem('language') as Language;
  if (saved && ['en', 'pl', 'de'].includes(saved)) {
    return saved;
  }
  
  return detectBrowserLanguage();
}

export const currentLanguage = writable<Language>(getInitialLanguage());

if (browser) {
  currentLanguage.subscribe(lang => {
    localStorage.setItem('language', lang);
  });
}

export function setLanguage(lang: Language) {
  currentLanguage.set(lang);
}
// export const translate = writable<Record<string, string>>({});
export const translate = writable<any>({});

currentLanguage.subscribe(lang => {
  translate.set(translations[lang]);
});

// for ts translate
export function getTranslation(key: string, category?: string): string {
  const t = get(translate);
  if (category) {
    return t[category]?.[key] || key;
  }
  return t[key] || key;
}
