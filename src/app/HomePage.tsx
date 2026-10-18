import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { modules } from '../modules/registry';

export function HomePage() {
  const t = useT();

  return (
    <>
      <section className="hero">
        <span className="hero__pill">🎉 Phase 1 scaffold</span>
        <h2>{t('home.title')}</h2>
        <p>{t('home.description')}</p>
      </section>

      <section className="module-grid" aria-label={t('home.title')}>
        {modules.map((module) => (
          <article className="module-card" key={module.id}>
            <span className="module-card__icon" aria-hidden="true">
              {module.icon}
            </span>
            <div>
              <h3 className="module-card__title">{t(module.nameKey)}</h3>
              <p className="module-card__description">{t(module.descKey)}</p>
            </div>
            <div className="module-card__status">
              <span aria-hidden="true">●</span>
              <span>{t('home.statusReady')}</span>
            </div>
            <Link className="button-link" to={module.route}>
              {t('home.openModule')}
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
