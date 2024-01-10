'use client';

import useTranslations, {
  UseTranslationsReturn,
} from '@/hooks/useTranslations';
import { ReactNode, createContext } from 'react';
import { Header } from '../header';

export const I18nContext = createContext<UseTranslationsReturn>({
  t: (key: string) => key,
  currentLanguage: 'en',
  changeLanguage: () => {},
});

export function Page({ children }: { children: ReactNode }) {
  const translations = useTranslations();

  return (
    <I18nContext.Provider value={translations}>
      <div className='flex h-screen flex-col'>
        <Header />
        <main className='flex flex-grow justify-between'>{children}</main>
      </div>
    </I18nContext.Provider>
  );
}
