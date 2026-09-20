import en from './locales/en.js';
import tr from './locales/tr.js';

export const locales = { en, tr };

const validLanguages = new Set(Object.keys(locales));

const isLanguage = (value) => validLanguages.has(value);

const normalizeLanguage = (value) => {
  if (typeof value !== 'string') return null;
  const language = value.toLowerCase().slice(0, 2);
  return isLanguage(language) ? language : null;
};

export function flattenKeys(value, prefix = '') {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenKeys(item, `${prefix}.${index}`));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).sort().flatMap((key) => (
      flattenKeys(value[key], prefix ? `${prefix}.${key}` : key)
    ));
  }

  return prefix ? [prefix] : [];
}

export function resolveLanguage({
  search = '',
  storedLanguage = null,
  timeZone = '',
  languages = [],
} = {}) {
  const requested = normalizeLanguage(new URLSearchParams(search).get('lang'));
  if (requested) return requested;

  const stored = normalizeLanguage(storedLanguage);
  if (stored) return stored;

  if (timeZone === 'Europe/Istanbul') return 'tr';

  const browserLanguages = Array.isArray(languages) ? languages : [];
  if (browserLanguages.some((language) => String(language).toLowerCase().startsWith('tr'))) {
    return 'tr';
  }

  return 'en';
}

const readStoredLanguage = () => {
  try {
    return window.localStorage.getItem('language');
  } catch {
    return null;
  }
};

const getSystemContext = () => {
  let timeZone = '';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    timeZone = '';
  }

  const languages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language];

  return { timeZone, languages };
};

const getValue = (dictionary, key) => key.split('.').reduce((value, part) => value?.[part], dictionary);

const setMetaContent = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.setAttribute('content', value);
};

const currentShareUrl = (language) => {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', language);
  return `${url.origin}${url.pathname}${url.search}${url.hash}`;
};

const updateLanguageUrl = (language) => {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', language);
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
};

const updateJsonLd = (locale) => {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script) return;

  try {
    const jsonLd = JSON.parse(script.textContent);
    jsonLd.description = locale.meta.jsonLdDescription;
    jsonLd.inLanguage = locale.meta.lang;
    script.textContent = JSON.stringify(jsonLd, null, 2);
  } catch {
    // Leave the static JSON-LD untouched if a future edit makes it invalid.
  }
};

const applyTranslations = (language) => {
  const locale = locales[language];
  const translate = (key) => getValue(locale, key) ?? key;

  document.documentElement.lang = locale.meta.lang;
  document.documentElement.dataset.language = language;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
  });

  const pageTitleKey = document.documentElement.dataset.pageTitleKey;
  document.title = pageTitleKey ? translate(pageTitleKey) : locale.meta.title;
  setMetaContent('meta[name="description"]', locale.meta.description);
  setMetaContent('meta[name="keywords"]', locale.meta.keywords);
  setMetaContent('meta[property="og:title"]', locale.meta.ogTitle);
  setMetaContent('meta[property="og:description"]', locale.meta.ogDescription);
  setMetaContent('meta[property="og:locale"]', locale.meta.ogLocale);
  setMetaContent('meta[property="og:url"]', currentShareUrl(language));
  setMetaContent('meta[name="twitter:title"]', locale.meta.ogTitle);
  setMetaContent('meta[name="twitter:description"]', locale.meta.ogDescription);
  updateJsonLd(locale);

  const languageToggle = document.querySelector('#language-toggle');
  if (languageToggle) {
    languageToggle.setAttribute('aria-pressed', String(language === 'tr'));
    languageToggle.setAttribute(
      'aria-label',
      translate(language === 'tr' ? 'accessibility.switchToEnglish' : 'accessibility.switchToTurkish'),
    );
  }

  document.documentElement.removeAttribute('data-locale-pending');
  window.portfolioI18n = {
    language,
    t: translate,
  };
  window.dispatchEvent(new CustomEvent('portfolio:language-changed', { detail: { language } }));
};

const saveLanguage = (language) => {
  try {
    window.localStorage.setItem('language', language);
  } catch {
    // The current language still applies when storage is unavailable.
  }
};

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const initialLanguage = normalizeLanguage(window.__initialLanguage)
    || resolveLanguage({ search: window.location.search, storedLanguage: readStoredLanguage(), ...getSystemContext() });

  applyTranslations(initialLanguage);

  document.querySelector('#language-toggle')?.addEventListener('click', () => {
    const nextLanguage = document.documentElement.dataset.language === 'tr' ? 'en' : 'tr';
    saveLanguage(nextLanguage);
    updateLanguageUrl(nextLanguage);
    applyTranslations(nextLanguage);
  });
}
