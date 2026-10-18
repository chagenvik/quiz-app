import { Link, Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { useT } from '../i18n/LanguageProvider';

export function AppShell() {
  const t = useT();

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar__inner">
          <Link className="brand" to="/">
            <span className="brand__badge" aria-hidden="true">
              ✨
            </span>
            <div>
              <p className="brand__eyebrow">{t('nav.home')}</p>
              <h1 className="brand__title">{t('app.title')}</h1>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
