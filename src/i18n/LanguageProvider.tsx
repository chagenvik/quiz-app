import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import en from './en.json';
import nb from './nb.json';

export const LANGUAGE_STORAGE_KEY = 'quiz-app.language';

export type Language = 'nb' | 'en';
type Dictionary = Record<string, string>;

const dictionaries: Record<Language, Dictionary> = {
  nb,
  en,
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function normalizeLanguage(value?: string | null): Language {
  const normalized = value?.toLowerCase() ?? '';

  if (
    normalized === 'nb' ||
    normalized === 'nn' ||
    normalized === 'no' ||
    normalized.startsWith('nb-') ||
    normalized.startsWith('nn-') ||
    normalized.startsWith('no-')
  ) {
    return 'nb';
  }

  return 'en';
}

function resolveInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (storedLanguage) {
    return normalizeLanguage(storedLanguage);
  }

  return normalizeLanguage(window.navigator.language);
}

function translate(language: Language, key: string): string {
  return dictionaries[language][key] ?? key;
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(resolveInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  }, []);

  const t = useCallback((key: string) => translate(language, key), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);

  if (!value) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }

  return value;
}

export function useT() {
  return useLanguage().t;
}
