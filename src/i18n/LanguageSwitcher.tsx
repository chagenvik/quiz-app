import { useLanguage, useT, type Language } from './LanguageProvider';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'nb', label: 'NO' },
  { value: 'en', label: 'EN' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const t = useT();

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t('nav.language')}
    >
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={language === option.value ? 'is-active' : undefined}
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
