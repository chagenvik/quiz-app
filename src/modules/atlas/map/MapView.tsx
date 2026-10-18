import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo';
import { select, type D3SelectionLike } from 'd3-selection';
import { zoom, zoomIdentity, type D3ZoomBehaviorLike } from 'd3-zoom';
import { feature } from 'topojson-client';
import worldAtlas50m from 'world-atlas/countries-50m.json';
import {
  capitals,
  countries,
  countriesWithoutPolygonsInRecommendedTopology,
  type AtlasCountry,
  type AtlasRegion,
} from '../data';
import {
  MAP_VIEWBOX_HEIGHT,
  MAP_VIEWBOX_WIDTH,
  boundsFromProjectedPoint,
  clamp,
  expandProjectedBounds,
  identityViewTransform,
  invertViewportPointToGeo,
  mergeProjectedBounds,
  projectGeoPoint,
  type AtlasProjectedBounds,
  type AtlasProjectedPoint,
  type AtlasProjectionLike,
  type AtlasViewTransform,
  type AtlasViewportRect,
} from './geo';
import {
  identifyCountryByPoint,
  isCountryTooSmallForDirectHit,
  type AtlasCountryGeometryTarget,
  type AtlasCountryHelperTarget,
} from './identify';
import type {
  AtlasCountryPick,
  AtlasMapFocusPoint,
  AtlasMapHighlightState,
  AtlasPoint,
  MapViewProps,
} from './types';
import { useT } from '../../../i18n/LanguageProvider';
import './MapView.css';

type CountryFeature = {
  id?: string | number;
  properties?: Record<string, unknown>;
};

type WorldAtlasTopology = {
  objects: {
    countries: unknown;
  };
};

type CountryGeometryRecord = AtlasCountry & {
  features: readonly CountryFeature[];
  pathData: string | null;
  projectedBounds: AtlasProjectedBounds;
  centroidProjected: AtlasProjectedPoint;
  helperPoint: AtlasPoint;
  helperRadiusKm: number;
  requiresHelper: boolean;
  fallbackOnly: boolean;
};

type TooltipState = {
  label: string;
  x: number;
  y: number;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const DEFAULT_POINT_FOCUS_SCALE = 4.25;
const FIT_PADDING = 24;
const DRAG_THRESHOLD_PX = 6;
const FOCUS_ANIMATION_MS = 280;
const VIEWBOX = `0 0 ${MAP_VIEWBOX_WIDTH} ${MAP_VIEWBOX_HEIGHT}`;
const MISSING_POLYGON_ISO2 = new Set<string>(countriesWithoutPolygonsInRecommendedTopology);
const topLevelTopology = worldAtlas50m as unknown as WorldAtlasTopology;
const countryCollection = feature(
  topLevelTopology as never,
  topLevelTopology.objects.countries as never,
) as unknown as { features: CountryFeature[] };
const countryProjection = geoNaturalEarth1().fitExtent(
  [
    [18, 18],
    [MAP_VIEWBOX_WIDTH - 18, MAP_VIEWBOX_HEIGHT - 18],
  ],
  countryCollection as never,
) as AtlasProjectionLike;
const pathGenerator = geoPath(countryProjection as never);
const capitalByIso2 = new Map(capitals.map((capital) => [capital.iso2, capital]));
const geometryFeaturesByNumericId = countryCollection.features.reduce<Map<string, CountryFeature[]>>((grouped, countryFeature) => {
  const numericId = String(countryFeature.id).padStart(3, '0');
  const bucket = grouped.get(numericId) ?? [];
  bucket.push(countryFeature);
  grouped.set(numericId, bucket);
  return grouped;
}, new Map());
const countryGeometryRecords: CountryGeometryRecord[] = countries.map((country) => {
  const featuresForCountry = geometryFeaturesByNumericId.get(country.numericId) ?? [];
  const fallbackCapital = capitalByIso2.get(country.iso2);
  const fallbackPoint: AtlasPoint = fallbackCapital
    ? {
        lat: fallbackCapital.lat,
        lon: fallbackCapital.lon,
      }
    : {
        lat: 0,
        lon: 0,
      };
  const centroidProjected =
    projectGeoPoint(countryProjection, fallbackPoint) ?? {
      x: MAP_VIEWBOX_WIDTH / 2,
      y: MAP_VIEWBOX_HEIGHT / 2,
    };
  const projectedBounds =
    featuresForCountry.length > 0
      ? mergeProjectedBounds(
          featuresForCountry.map((featureLike) =>
            pathGenerator.bounds(featureLike as never) as unknown as AtlasProjectedBounds,
          ),
        )
      : boundsFromProjectedPoint(centroidProjected, 9);
  const helperRadiusKm = MISSING_POLYGON_ISO2.has(country.iso2) ? 180 : country.isMicrostate ? 120 : 80;
  const polygonCentroid =
    featuresForCountry.length > 0
      ? geoCentroid(
          featuresForCountry.length === 1
            ? (featuresForCountry[0] as never)
            : ({ type: 'FeatureCollection', features: featuresForCountry } as never),
        )
      : null;
  const centroidFromGeometry =
    polygonCentroid && Number.isFinite(polygonCentroid[0]) && Number.isFinite(polygonCentroid[1])
      ? projectGeoPoint(countryProjection, { lon: polygonCentroid[0], lat: polygonCentroid[1] })
      : null;

  return {
    ...country,
    features: featuresForCountry,
    pathData:
      featuresForCountry.length > 0
        ? featuresForCountry.map((featureLike) => pathGenerator(featureLike as never) ?? '').join(' ')
        : null,
    projectedBounds: projectedBounds ?? boundsFromProjectedPoint(centroidProjected, 9),
    centroidProjected: centroidFromGeometry ?? centroidProjected,
    helperPoint: fallbackPoint,
    helperRadiusKm,
    requiresHelper:
      featuresForCountry.length === 0 || country.isMicrostate || isCountryTooSmallForDirectHit(projectedBounds ?? boundsFromProjectedPoint(centroidProjected, 9)),
    fallbackOnly: featuresForCountry.length === 0,
  };
});
const countryGeometryByIso2 = new Map(countryGeometryRecords.map((country) => [country.iso2, country]));
const defaultLabelsByIso2 = Object.fromEntries(countryGeometryRecords.map((country) => [country.iso2, country.nameEn]));

function getHighlightClass(state: AtlasMapHighlightState | undefined): string {
  switch (state) {
    case 'correct':
      return 'atlas-map__country--correct';
    case 'wrong':
      return 'atlas-map__country--wrong';
    case 'target':
      return 'atlas-map__country--target';
    case 'hint':
      return 'atlas-map__country--hint';
    default:
      return '';
  }
}

function makeTransform(x: number, y: number, k: number): AtlasViewTransform {
  return { x, y, k };
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function interpolateTransform(
  from: AtlasViewTransform,
  to: AtlasViewTransform,
  progress: number,
): AtlasViewTransform {
  return makeTransform(
    lerp(from.x, to.x, progress),
    lerp(from.y, to.y, progress),
    lerp(from.k, to.k, progress),
  );
}

function boundsToTransform(bounds: AtlasProjectedBounds): AtlasViewTransform {
  const width = Math.max(bounds[1][0] - bounds[0][0], 1);
  const height = Math.max(bounds[1][1] - bounds[0][1], 1);
  const scale = clamp(
    Math.min((MAP_VIEWBOX_WIDTH - FIT_PADDING * 2) / width, (MAP_VIEWBOX_HEIGHT - FIT_PADDING * 2) / height),
    MIN_ZOOM,
    MAX_ZOOM,
  );
  const centerX = (bounds[0][0] + bounds[1][0]) / 2;
  const centerY = (bounds[0][1] + bounds[1][1]) / 2;
  return makeTransform(
    MAP_VIEWBOX_WIDTH / 2 - centerX * scale,
    MAP_VIEWBOX_HEIGHT / 2 - centerY * scale,
    scale,
  );
}

function pointToTransform(point: AtlasMapFocusPoint): AtlasViewTransform | null {
  const projectedPoint = projectGeoPoint(countryProjection, point);

  if (!projectedPoint) {
    return null;
  }

  const scale = clamp(point.scale ?? DEFAULT_POINT_FOCUS_SCALE, MIN_ZOOM, MAX_ZOOM);
  return makeTransform(
    MAP_VIEWBOX_WIDTH / 2 - projectedPoint.x * scale,
    MAP_VIEWBOX_HEIGHT / 2 - projectedPoint.y * scale,
    scale,
  );
}

function getTargetTransform(
  focusRegion: AtlasRegion | undefined,
  fitTo: readonly string[] | undefined,
  focusPoint: AtlasMapFocusPoint | undefined,
): AtlasViewTransform | null {
  if (focusPoint) {
    return pointToTransform(focusPoint);
  }

  if (fitTo && fitTo.length > 0) {
    const bounds = mergeProjectedBounds(
      fitTo.map((iso2) => countryGeometryByIso2.get(iso2.toUpperCase())?.projectedBounds),
    );
    return bounds ? boundsToTransform(expandProjectedBounds(bounds, 8)) : null;
  }

  if (focusRegion) {
    const bounds = mergeProjectedBounds(
      countryGeometryRecords
        .filter((country) => country.region === focusRegion)
        .map((country) => country.projectedBounds),
    );
    return bounds ? boundsToTransform(expandProjectedBounds(bounds, 18)) : null;
  }

  return null;
}

function getMapStatus(
  mode: MapViewProps['mode'],
  disabled: boolean,
  t: (key: string) => string,
): string {
  if (mode === 'pickCountry') {
    return disabled ? t('atlas.map.status.pickCountryDisabled') : t('atlas.map.status.pickCountry');
  }

  if (mode === 'placePin') {
    return disabled ? t('atlas.map.status.placePinDisabled') : t('atlas.map.status.placePin');
  }

  return t('atlas.map.status.view');
}

export function MapView({
  mode,
  onCountryPick,
  onPinPlace,
  highlights = [],
  pins = [],
  lines = [],
  focusRegion,
  fitTo,
  focusPoint,
  disabled = false,
  activeIso2,
  showTooltips = true,
  labelsByIso2,
  ariaLabel,
  className,
}: MapViewProps) {
  const t = useT();
  const [viewTransform, setViewTransform] = useState<AtlasViewTransform>(identityViewTransform);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<D3ZoomBehaviorLike | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const transformRef = useRef<AtlasViewTransform>(identityViewTransform);
  const pointerStateRef = useRef<{ pointerId: number; x: number; y: number; dragged: boolean } | null>(null);
  const instructionsId = useId();
  const fitToKey = useMemo(
    () => (fitTo ? [...fitTo].map((iso2) => iso2.toUpperCase()).sort().join('|') : ''),
    [fitTo],
  );
  const focusPointKey = focusPoint ? `${focusPoint.lat}:${focusPoint.lon}:${focusPoint.scale ?? ''}` : '';
  const interactiveIso2 = useMemo(
    () => (activeIso2 ? new Set([...activeIso2].map((iso2) => iso2.toUpperCase())) : null),
    [activeIso2],
  );
  const highlightByIso2 = useMemo(
    () => new Map(highlights.map((highlight) => [highlight.iso2.toUpperCase(), highlight.state])),
    [highlights],
  );
  const interactiveCountryTargets = useMemo<AtlasCountryGeometryTarget[]>(
    () =>
      countryGeometryRecords
        .filter((country) => country.features.length > 0)
        .filter((country) => !interactiveIso2 || interactiveIso2.has(country.iso2))
        .map((country) => ({
          iso2: country.iso2,
          numericId: country.numericId,
          features: country.features,
        })),
    [interactiveIso2],
  );
  const helperTargets = useMemo<AtlasCountryHelperTarget[]>(
    () =>
      countryGeometryRecords
        .filter((country) => country.requiresHelper)
        .filter((country) => !interactiveIso2 || interactiveIso2.has(country.iso2))
        .map((country) => ({
          iso2: country.iso2,
          numericId: country.numericId,
          source: 'helper',
          lat: country.helperPoint.lat,
          lon: country.helperPoint.lon,
          radiusKm: country.helperRadiusKm,
        })),
    [interactiveIso2],
  );
  const resolvedLabelsByIso2 = labelsByIso2 ?? defaultLabelsByIso2;
  const canShowTooltips = mode === 'view' && showTooltips;
  const instructions = getMapStatus(mode, disabled, t);
  const mapClassName = ['atlas-map', className].filter(Boolean).join(' ');
  const resolvedAriaLabel = ariaLabel || t('atlas.map.ariaLabel');

  useEffect(() => {
    const svgElement = svgRef.current;

    if (!svgElement) {
      return undefined;
    }

    const selection: D3SelectionLike = select(svgElement);
    const zoomBehavior: D3ZoomBehaviorLike = zoom()
      .extent([
        [0, 0],
        [MAP_VIEWBOX_WIDTH, MAP_VIEWBOX_HEIGHT],
      ])
      .translateExtent([
        [-MAP_VIEWBOX_WIDTH * 0.45, -MAP_VIEWBOX_HEIGHT * 0.45],
        [MAP_VIEWBOX_WIDTH * 1.45, MAP_VIEWBOX_HEIGHT * 1.45],
      ])
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .filter((event: { type?: string; button?: number; ctrlKey?: boolean }) => {
        if (event.type === 'dblclick') {
          return false;
        }

        if (event.type === 'wheel') {
          return true;
        }

        return event.button === undefined || event.button === 0 || event.ctrlKey === true;
      })
      .on('zoom', (event: { transform: { x: number; y: number; k: number } }) => {
        const nextTransform = makeTransform(event.transform.x, event.transform.y, event.transform.k);
        transformRef.current = nextTransform;
        setViewTransform(nextTransform);
      });

    zoomBehaviorRef.current = zoomBehavior;
    selection.call(zoomBehavior);
    selection.call(
      zoomBehavior.transform,
      zoomIdentity.translate(identityViewTransform.x, identityViewTransform.y).scale(identityViewTransform.k),
    );

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      selection.on('.zoom', null);
    };
  }, []);

  useEffect(() => {
    const targetTransform = getTargetTransform(focusRegion, fitTo, focusPoint);

    if (!targetTransform) {
      return;
    }

    animateToTransform(targetTransform, FOCUS_ANIMATION_MS);
  }, [fitTo, fitToKey, focusPoint, focusPointKey, focusRegion]);

  const countryPaths = useMemo(
    () =>
      countryGeometryRecords
        .filter((country) => country.pathData)
        .map((country) => {
          const state = highlightByIso2.get(country.iso2);
          const isInactive = interactiveIso2 ? !interactiveIso2.has(country.iso2) : false;
          const countryClassName = [
            'atlas-map__country',
            getHighlightClass(state),
            isInactive ? 'atlas-map__country--muted' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <path
              key={country.iso2}
              d={country.pathData ?? undefined}
              className={countryClassName}
              data-country-iso={country.iso2}
              data-country-label={resolvedLabelsByIso2[country.iso2] ?? country.nameEn}
              vectorEffect="non-scaling-stroke"
            />
          );
        }),
    [highlightByIso2, interactiveIso2, resolvedLabelsByIso2],
  );

  const helperMarkers = useMemo(
    () =>
      countryGeometryRecords
        .filter((country) => country.requiresHelper)
        .filter((country) => mode === 'pickCountry' || country.fallbackOnly || highlightByIso2.has(country.iso2))
        .map((country) => {
          const state = highlightByIso2.get(country.iso2);
          const isInactive = interactiveIso2 ? !interactiveIso2.has(country.iso2) : false;
          const className = [
            'atlas-map__helper',
            getHighlightClass(state).replace('country', 'helper'),
            isInactive ? 'atlas-map__country--muted' : '',
          ]
            .filter(Boolean)
            .join(' ');
          const projectedPoint = projectGeoPoint(countryProjection, country.helperPoint) ?? country.centroidProjected;

          return (
            <g
              key={`helper-${country.iso2}`}
              transform={`translate(${projectedPoint.x} ${projectedPoint.y}) scale(${1 / viewTransform.k})`}
              data-country-iso={country.iso2}
              data-country-label={resolvedLabelsByIso2[country.iso2] ?? country.nameEn}
            >
              <circle className="atlas-map__helper-hit" r={16} />
              <circle className={className} r={country.fallbackOnly ? 8 : 7} />
            </g>
          );
        }),
    [highlightByIso2, interactiveIso2, mode, resolvedLabelsByIso2, viewTransform.k],
  );

  const lineElements = useMemo(
    () =>
      lines.map((line, index) => {
        const start = projectGeoPoint(countryProjection, line.from);
        const end = projectGeoPoint(countryProjection, line.to);

        if (!start || !end) {
          return null;
        }

        return (
          <line
            key={`line-${index}`}
            className="atlas-map__line"
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            vectorEffect="non-scaling-stroke"
          />
        );
      }),
    [lines],
  );

  const pinElements = useMemo(
    () =>
      pins.map((pin, index) => {
        const projectedPoint = projectGeoPoint(countryProjection, pin);

        if (!projectedPoint) {
          return null;
        }

        const pinClass = pin.kind === 'guess' ? 'atlas-map__pin-core--guess' : 'atlas-map__pin-core--answer';
        const pinColor = pin.kind === 'guess' ? 'var(--atlas-map-pin-guess)' : 'var(--atlas-map-pin-answer)';

        return (
          <g
            key={`pin-${index}`}
            className="atlas-map__pin"
            transform={`translate(${projectedPoint.x} ${projectedPoint.y}) scale(${1 / viewTransform.k})`}
            style={{ color: pinColor }}
          >
            <circle className="atlas-map__pin-ring" r={11} />
            <circle className={`atlas-map__pin-core ${pinClass}`} r={5.25} />
            {pin.label ? (
              <text className="atlas-map__pin-label" x={14} y={4}>
                {pin.label}
              </text>
            ) : null}
          </g>
        );
      }),
    [pins, viewTransform.k],
  );

  function animateToTransform(targetTransform: AtlasViewTransform, durationMs: number): void {
    const svgElement = svgRef.current;
    const zoomBehavior = zoomBehaviorRef.current;

    if (!svgElement || !zoomBehavior) {
      return;
    }

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    if (durationMs <= 0) {
      select(svgElement).call(
        zoomBehavior.transform,
        zoomIdentity.translate(targetTransform.x, targetTransform.y).scale(targetTransform.k),
      );
      return;
    }

    const startTransform = transformRef.current;
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const progress = clamp((currentTime - startTime) / durationMs, 0, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextTransform = interpolateTransform(startTransform, targetTransform, easedProgress);
      select(svgElement).call(
        zoomBehavior.transform,
        zoomIdentity.translate(nextTransform.x, nextTransform.y).scale(nextTransform.k),
      );

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }

  function handleZoomBy(factor: number): void {
    const svgElement = svgRef.current;
    const zoomBehavior = zoomBehaviorRef.current;

    if (!svgElement || !zoomBehavior) {
      return;
    }

    select(svgElement).call(
      zoomBehavior.scaleBy,
      factor,
      [MAP_VIEWBOX_WIDTH / 2, MAP_VIEWBOX_HEIGHT / 2],
    );
  }

  function handleReset(): void {
    animateToTransform(identityViewTransform, 180);
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>): void {
    pointerStateRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dragged: false,
    };
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>): void {
    const pointerState = pointerStateRef.current;

    if (pointerState && pointerState.pointerId === event.pointerId) {
      const movedDistance = Math.hypot(event.clientX - pointerState.x, event.clientY - pointerState.y);

      if (movedDistance > DRAG_THRESHOLD_PX) {
        pointerState.dragged = true;
      }
    }

    if (!canShowTooltips) {
      return;
    }

    updateTooltip(event.clientX, event.clientY, event.target);
  }

  function handlePointerLeave(): void {
    if (canShowTooltips) {
      setTooltip(null);
    }
  }

  function handlePointerCancel(): void {
    pointerStateRef.current = null;
    if (canShowTooltips) {
      setTooltip(null);
    }
  }

  function handleMapClick(event: MouseEvent<SVGSVGElement>): void {
    const pointerState = pointerStateRef.current;
    pointerStateRef.current = null;

    if (pointerState?.dragged) {
      return;
    }

    const svgElement = svgRef.current;

    if (!svgElement) {
      return;
    }

    const rect = svgElement.getBoundingClientRect() as AtlasViewportRect;
    const point = invertViewportPointToGeo(
      countryProjection,
      {
        x: event.clientX,
        y: event.clientY,
      },
      rect,
      transformRef.current,
    );

    if (!point) {
      return;
    }

    if (mode === 'placePin') {
      if (!disabled) {
        onPinPlace?.(point);
      }

      return;
    }

    if (mode !== 'pickCountry' || disabled) {
      return;
    }

    const selectedCountry = identifyCountryByPoint(point, interactiveCountryTargets, helperTargets);

    if (selectedCountry) {
      onCountryPick?.(selectedCountry);
    }
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>): void {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      handleZoomBy(1.25);
      return;
    }

    if (event.key === '-' || event.key === '_') {
      event.preventDefault();
      handleZoomBy(0.8);
      return;
    }

    if (event.key === '0') {
      event.preventDefault();
      handleReset();
    }
  }

  function updateTooltip(clientX: number, clientY: number, target: EventTarget | null): void {
    if (!surfaceRef.current || !(target instanceof Element)) {
      setTooltip(null);
      return;
    }

    const marker = target.closest<HTMLElement>('[data-country-iso]');

    if (!marker) {
      setTooltip(null);
      return;
    }

    const iso2 = marker.dataset.countryIso;
    const label = iso2 ? resolvedLabelsByIso2[iso2] ?? countryGeometryByIso2.get(iso2)?.nameEn ?? null : null;

    if (!label) {
      setTooltip(null);
      return;
    }

    const surfaceRect = surfaceRef.current.getBoundingClientRect();
    setTooltip({
      label,
      x: clientX - surfaceRect.left,
      y: clientY - surfaceRect.top,
    });
  }

  return (
    <div className={mapClassName}>
      <div className="atlas-map__toolbar" aria-label={t('atlas.map.toolbarLabel')}>
        <button type="button" onClick={() => handleZoomBy(1.25)} aria-label={t('atlas.map.zoomIn')}>
          +
        </button>
        <button type="button" onClick={() => handleZoomBy(0.8)} aria-label={t('atlas.map.zoomOut')}>
          −
        </button>
        <button type="button" onClick={handleReset} aria-label={t('atlas.map.reset')}>
          {t('atlas.map.reset')}
        </button>
      </div>

      <div className="atlas-map__surface" ref={surfaceRef}>
        <p id={instructionsId} className="atlas-map__sr-only">
          {instructions}
        </p>
        <svg
          ref={svgRef}
          className="atlas-map__svg"
          viewBox={VIEWBOX}
          role="img"
          aria-label={resolvedAriaLabel}
          aria-describedby={instructionsId}
          onClick={handleMapClick}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerCancel}
        >
          <rect className="atlas-map__background" x={0} y={0} width={MAP_VIEWBOX_WIDTH} height={MAP_VIEWBOX_HEIGHT} />
          <g transform={`translate(${viewTransform.x} ${viewTransform.y}) scale(${viewTransform.k})`}>
            {countryPaths}
            {helperMarkers}
            {lineElements}
            {pinElements}
          </g>
        </svg>
        {tooltip ? (
          <div className="atlas-map__tooltip" style={{ left: tooltip.x, top: tooltip.y }} role="status">
            {tooltip.label}
          </div>
        ) : null}
      </div>

      <p className="atlas-map__status">{instructions}</p>
    </div>
  );
}

export type { AtlasCountryPick };
