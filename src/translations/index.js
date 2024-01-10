const dictionaries = {
  de: () => import('./de.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
  es: () => import('./es.json').then((module) => module.default),
};

export const getTranslations = async (locale) => dictionaries[locale]();
