import type { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../../../i18n/LanguageProvider';
import { MapView } from './MapView';

function renderMapView(node: ReactElement) {
  return render(<LanguageProvider>{node}</LanguageProvider>);
}

describe('MapView', () => {
  it('renders accessible zoom controls', () => {
    renderMapView(<MapView mode="view" />);

    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('places a pin without treating a tap as a drag', () => {
    const handlePinPlace = vi.fn();
    const { container } = renderMapView(<MapView mode="placePin" onPinPlace={handlePinPlace} />);

    const map = container.querySelector('svg') as SVGSVGElement;
    Object.defineProperty(map, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ left: 0, top: 0, width: 1000, height: 560 }),
    });

    fireEvent.pointerDown(map, { pointerId: 1, clientX: 500, clientY: 280 });
    fireEvent.click(map, { clientX: 500, clientY: 280 });

    expect(handlePinPlace).toHaveBeenCalledTimes(1);
  });
});
