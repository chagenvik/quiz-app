import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { HomePage } from './HomePage';
import { useT } from '../i18n/LanguageProvider';
import { modules } from '../modules/registry';

export function App() {
  const t = useT();

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        {modules.map(({ id, route, component: Component }) => (
          <Route
            key={id}
            path={`${route.slice(1)}/*`}
            element={
              <Suspense fallback={<div className="loading-panel">{t('common.loadingModule')}</div>}>
                <Component />
              </Suspense>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
