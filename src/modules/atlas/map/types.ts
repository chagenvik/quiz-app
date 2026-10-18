import type { AtlasRegion } from '../data';

export type MapViewMode = 'pickCountry' | 'placePin' | 'view';
export type AtlasMapHighlightState = 'correct' | 'wrong' | 'target' | 'hint';
export type AtlasMapPinKind = 'guess' | 'answer';

export interface AtlasPoint {
  lat: number;
  lon: number;
}

export interface AtlasCountryPick {
  iso2: string;
  numericId: string;
  source: 'polygon' | 'helper';
}

export interface AtlasMapHighlight {
  iso2: string;
  state: AtlasMapHighlightState;
}

export interface AtlasMapPin extends AtlasPoint {
  kind: AtlasMapPinKind;
  label?: string;
}

export interface AtlasMapLine {
  from: AtlasPoint;
  to: AtlasPoint;
}

export interface AtlasMapFocusPoint extends AtlasPoint {
  scale?: number;
}

export interface MapViewProps {
  mode: MapViewMode;
  onCountryPick?: (country: AtlasCountryPick) => void;
  onPinPlace?: (point: AtlasPoint) => void;
  highlights?: readonly AtlasMapHighlight[];
  pins?: readonly AtlasMapPin[];
  lines?: readonly AtlasMapLine[];
  focusRegion?: AtlasRegion;
  fitTo?: readonly string[];
  focusPoint?: AtlasMapFocusPoint;
  disabled?: boolean;
  activeIso2?: ReadonlySet<string>;
  showTooltips?: boolean;
  labelsByIso2?: Partial<Record<string, string>>;
  ariaLabel?: string;
  className?: string;
}
