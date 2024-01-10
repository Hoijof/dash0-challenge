import { useCallback, useEffect, useState } from 'react';

import { getTranslations } from '@/translations';

export enum Languages {
  EN = 'en',
  ES = 'es',
  DE = 'de',
}

const FALLBACK_LANGUAGE = Languages.EN;

export type TranslationFile = {
  [key: string]: string;
} | null;

export type UseTranslationsReturn = {
  currentLanguage: string;
  t: (key: string) => string;
  changeLanguage: (language: string) => void;
};

const useTranslations = (
  defaultLanguage: string = Languages.EN,
  forceDefault: boolean = false
): UseTranslationsReturn => {
  const browserLanguage = navigator.language.split('-')[0];
  const [currentLanguage, setCurrentLanguage] = useState(
    forceDefault ? defaultLanguage : browserLanguage
  );
  const [currentTranslations, setCurrentTranslations] =
    useState<TranslationFile>(null);

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  useEffect(() => {
    const fetchData = async () => {
      let translations = await getTranslations(currentLanguage);

      if (Object.keys(translations).length === 0) {
        setCurrentLanguage(FALLBACK_LANGUAGE);
        translations = await getTranslations(FALLBACK_LANGUAGE);
      }
      
      setCurrentTranslations(translations);
    };

    fetchData();
  }, [browserLanguage, currentLanguage, currentTranslations]);

  const translate = useCallback(
    (key: string): string => {
      if (!currentTranslations || !currentTranslations[key]) {
        return key;
      }
      
      return currentTranslations[key];
    },
    [currentTranslations]
  );

  return {
    currentLanguage,
    t: translate,
    changeLanguage,
  };
};

export default useTranslations;
