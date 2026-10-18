import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LANGUAGE_STORAGE_KEY, LanguageProvider } from '../../i18n/LanguageProvider';
import AtlasPage from './AtlasPage';

type MockMapViewProps = {
  mode: 'pickCountry' | 'placePin';
  onCountryPick?: (selection: { iso2: string; numericId: string; source: 'polygon' }) => void;
  onPinPlace?: (point: { lat: number; lon: number }) => void;
  labelsByIso2?: Record<string, string>;
  activeIso2?: Set<string>;
};

vi.mock('./map', () => ({
  MapView: ({
    mode,
    onCountryPick,
    onPinPlace,
    labelsByIso2 = {},
    activeIso2,
  }: MockMapViewProps) => {
    const choices = Object.entries(labelsByIso2).filter(([iso2]) => {
      if (!(activeIso2 instanceof Set)) {
        return true;
      }

      return activeIso2.has(iso2);
    });

    return (
      <div data-testid={`mock-map-${String(mode)}`}>
        {mode === 'pickCountry'
          ? choices.map(([iso2, label]) => (
              <button
                key={iso2}
                type="button"
                onClick={() => onCountryPick?.({ iso2, numericId: iso2, source: 'polygon' })}
              >
                {label}
              </button>
            ))
          : (
              <button type="button" onClick={() => onPinPlace?.({ lat: 59.91, lon: 10.75 })}>
                place pin
              </button>
            )}
      </div>
    );
  },
}));

function renderAtlasPage(initialPath = '/atlas') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LanguageProvider>
        <Routes>
          <Route path="/atlas/*" element={<AtlasPage />} />
        </Routes>
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe('AtlasPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
  });

  it('starts a country game, answers questions, and shows the result screen', () => {
    renderAtlasPage();

    fireEvent.click(screen.getByRole('button', { name: 'Start game' }));

    for (let index = 0; index < 10; index += 1) {
      const countryName = screen.getByTestId('atlas-question-primary').textContent ?? '';
      fireEvent.click(screen.getByRole('button', { name: countryName }));
      fireEvent.click(screen.getByRole('button', { name: index === 9 ? 'See results' : 'Next' }));
    }

    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText('New record!')).toBeInTheDocument();
    expect(screen.getByTestId('atlas-result-list')).toBeInTheDocument();
  });

  it('starts a capital game and shows distance feedback after placing a pin', () => {
    renderAtlasPage();

    fireEvent.click(screen.getByRole('button', { name: /^Capitals/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Start game' }));
    fireEvent.click(screen.getByRole('button', { name: 'place pin' }));

    const feedback = screen.getByTestId('atlas-feedback');
    expect(within(feedback).getAllByText(/km/)).not.toHaveLength(0);
    expect(within(feedback).getAllByText(/pts/)).not.toHaveLength(0);
  });
});
