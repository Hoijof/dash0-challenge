'use client';

import { Languages } from '@/hooks/useTranslations';
import { useRouter, usePathname } from 'next/navigation';
import { useContext } from 'react';
import { I18nContext } from '../page';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { currentLanguage, t, changeLanguage } = useContext(I18nContext);

  const navigateToHistogram = () => {
    router.push('/histogram');
  };

  const navigateToVisualize = () => {
    router.push('/visualize');
  };

  const isRouteSelected = (route: string) => {
    return pathname === route ? 'bg-white text-blue-500' : '';
  };

  return (
    <header className='flex items-center justify-center bg-blue-500 py-4 text-center text-2xl text-white'>
      <nav className='flex w-full flex-row justify-between pl-4 pr-4'>
        <div className='flex flex-row justify-center'>
          <ul className='flex'>
            <li>
              <button
                onClick={navigateToHistogram}
                className={`mr-4 ${isRouteSelected('/histogram')}`}
              >
                {t('histogram')}
              </button>
            </li>
            <li>
              <button
                onClick={navigateToVisualize}
                className={isRouteSelected('/visualize')}
              >
                {t('table')}
              </button>
            </li>
          </ul>
        </div>
        <div className='flex-row justify-end'>
          <ul className='ml-2 flex'>
            {Object.values(Languages).map((language, index) => (
              <li key={language} className='pl-2'>
                <button
                  onClick={() => changeLanguage(language)}
                  className={currentLanguage === language ? 'font-bold' : ''}
                >
                  {language}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
