import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type Language } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('flowiq-language') as Language) || 'en';
  });

  const isRTL = lang === 'ar';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', dir);
    root.setAttribute('lang', lang);
  }, [lang, dir]);

  const setLang = useCallback((newLang: Language) => {
    localStorage.setItem('flowiq-language', newLang);
    setLangState(newLang);
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let current: any = translations[lang];
    for (const k of keys) {
      if (current == null) return key;
      current = current[k];
    }
    return typeof current === 'string' ? current : key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
