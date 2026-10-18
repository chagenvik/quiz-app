import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  LANGUAGE_STORAGE_KEY,
  LanguageProvider,
  normalizeLanguage,
  useLanguage,
  useT,
} from './LanguageProvider';

function Probe() {
  const t = useT();
  const { setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <button type="button" onClick={() => setLanguage('en')}>
        switch
      </button>
    </div>
  );
}

describe('useT', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders the active translation and persists updates', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'nb');

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Velg en quizmodul' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'switch' }));

    expect(
      screen.getByRole('heading', { name: 'Choose a quiz module' }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  it('normalizes norwegian browser languages to nb', () => {
    expect(normalizeLanguage('nb-NO')).toBe('nb');
    expect(normalizeLanguage('nn-NO')).toBe('nb');
    expect(normalizeLanguage('no')).toBe('nb');
    expect(normalizeLanguage('en-GB')).toBe('en');
  });
});
