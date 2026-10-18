import { useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useLanguage, useT } from '../../i18n/LanguageProvider';
import { capitals, countries, getCapitals, getCountries, regions } from './data';
import {
  MAX_POINTS_PER_QUESTION,
  getBestScore,
  recordGameResult,
  useAtlasGame,
  type CountryMaxAttempts,
  type GameConfig,
  type GameQuestionCount,
  type GameResult,
  type GameRegion,
  type ScoreKeyConfig,
} from './engine';
import { MapView } from './map';
import type { AtlasMapHighlight, AtlasMapLine, AtlasMapPin } from './map';
import './AtlasPage.css';

type AtlasSelection = Omit<GameConfig, 'language'>;

type CompletedRun = {
  config: GameConfig;
  result: GameResult;
  newRecord: boolean;
  finishedAt: string;
};

type AtlasOptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

type AtlasHomeProps = {
  selection: AtlasSelection;
  bestScore: number | null;
  availableQuestions: number;
  perfectScore: number;
  onCategoryChange: (category: AtlasSelection['category']) => void;
  onRegionChange: (region: GameRegion) => void;
  onQuestionCountChange: (questionCount: GameQuestionCount) => void;
  onAttemptsChange: (attempts: CountryMaxAttempts) => void;
  onStart: () => void;
};

type AtlasGameScreenProps = {
  config: GameConfig;
  onFinish: (completedRun: CompletedRun) => void;
  onQuit: () => void;
  onOpenResult: () => void;
};

type AtlasResultScreenProps = {
  completedRun: CompletedRun;
  onPlayAgain: () => void;
  onBack: () => void;
};

const defaultSelection: AtlasSelection = {
  category: 'countries',
  region: 'world',
  questionCount: 10,
  maxAttempts: 1,
};

const categoryIcons: Record<AtlasSelection['category'], string> = {
  countries: '🧭',
  capitals: '📍',
};

const countryByIso2 = new Map(countries.map((country) => [country.iso2, country]));
const capitalByIso2 = new Map(capitals.map((capital) => [capital.iso2, capital]));
const questionCountOptions: GameQuestionCount[] = [10, 20, 'all'];
const attemptOptions: CountryMaxAttempts[] = [1, 2];
const regionOptions: GameRegion[] = ['world', ...regions];

function getQuestionPool(selection: AtlasSelection) {
  return selection.category === 'countries'
    ? selection.region === 'world'
      ? getCountries()
      : getCountries(selection.region)
    : selection.region === 'world'
      ? getCapitals()
      : getCapitals(selection.region);
}

function getAvailableQuestionCount(selection: AtlasSelection) {
  return getQuestionPool(selection).length;
}

function resolveQuestionTotal(selection: AtlasSelection) {
  const available = getAvailableQuestionCount(selection);
  return selection.questionCount === 'all' ? available : Math.min(selection.questionCount, available);
}

function normalizeSelection(selection: AtlasSelection): AtlasSelection {
  const category = selection.category;
  const maxAttempts = category === 'countries' ? selection.maxAttempts : 1;
  const normalizedSelection = {
    ...selection,
    maxAttempts,
  } satisfies AtlasSelection;
  const available = getAvailableQuestionCount(normalizedSelection);
  const questionCount =
    normalizedSelection.questionCount !== 'all' && normalizedSelection.questionCount > available
      ? available >= 10
        ? 10
        : 'all'
      : normalizedSelection.questionCount;

  return {
    ...normalizedSelection,
    questionCount,
  };
}

function toScoreConfig(selection: AtlasSelection): ScoreKeyConfig {
  return {
    category: selection.category,
    region: selection.region,
    questionCount: selection.questionCount,
    maxAttempts: selection.category === 'countries' ? selection.maxAttempts : 1,
  };
}

function AtlasOptionCard({
  label,
  description,
  selected,
  onSelect,
  disabled = false,
}: AtlasOptionCardProps) {
  return (
    <button
      type="button"
      className={[
        'atlas-option-card',
        selected ? 'is-selected' : '',
        disabled ? 'is-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
      aria-pressed={selected}
      disabled={disabled}
    >
      <span className="atlas-option-card__label">{label}</span>
      {description ? <span className="atlas-option-card__description">{description}</span> : null}
    </button>
  );
}

function AtlasHome({
  selection,
  bestScore,
  availableQuestions,
  perfectScore,
  onCategoryChange,
  onRegionChange,
  onQuestionCountChange,
  onAttemptsChange,
  onStart,
}: AtlasHomeProps) {
  const t = useT();
  const { language } = useLanguage();
  const numberFormat = useMemo(
    () => new Intl.NumberFormat(language === 'nb' ? 'nb-NO' : 'en-US'),
    [language],
  );
  const formatPoints = (value: number) => `${numberFormat.format(value)} ${t('atlas.pointsUnit')}`;

  return (
    <div className="atlas-layout">
      <section className="hero atlas-hero">
        <span className="hero__pill">🌍 {t('atlas.homePill')}</span>
        <h2>{t('atlas.homeTitle')}</h2>
        <p>{t('atlas.homeDescription')}</p>
      </section>

      <div className="atlas-home-grid">
        <section className="panel atlas-panel atlas-config-panel" aria-labelledby="atlas-config-title">
          <div className="atlas-panel__header">
            <div>
              <p className="atlas-panel__eyebrow">{t('atlas.setupEyebrow')}</p>
              <h3 id="atlas-config-title">{t('atlas.setupTitle')}</h3>
            </div>
            <div className="atlas-chip">
              <span aria-hidden="true">✨</span>
              {formatPoints(perfectScore)}
            </div>
          </div>

          <div className="atlas-field-group">
            <div className="atlas-field-group__label-row">
              <span className="atlas-field-group__label">{t('atlas.categoryLegend')}</span>
              <span className="muted-text">{t('atlas.categoryHint')}</span>
            </div>
            <div className="atlas-option-grid atlas-option-grid--two-columns">
              <AtlasOptionCard
                label={t('atlas.categoryCountries')}
                description={t('atlas.categoryCountriesDescription')}
                selected={selection.category === 'countries'}
                onSelect={() => onCategoryChange('countries')}
              />
              <AtlasOptionCard
                label={t('atlas.categoryCapitals')}
                description={t('atlas.categoryCapitalsDescription')}
                selected={selection.category === 'capitals'}
                onSelect={() => onCategoryChange('capitals')}
              />
            </div>
          </div>

          <div className="atlas-field-group">
            <div className="atlas-field-group__label-row">
              <span className="atlas-field-group__label">{t('atlas.regionLegend')}</span>
              <span className="muted-text">{t('atlas.regionHint')}</span>
            </div>
            <div className="atlas-option-grid atlas-option-grid--three-columns">
              {regionOptions.map((region) => (
                <AtlasOptionCard
                  key={region}
                  label={t(`atlas.region.${region}`)}
                  selected={selection.region === region}
                  onSelect={() => onRegionChange(region)}
                />
              ))}
            </div>
          </div>

          <div className="atlas-field-group">
            <div className="atlas-field-group__label-row">
              <span className="atlas-field-group__label">{t('atlas.questionCountLegend')}</span>
              <span className="muted-text">{t('atlas.questionCountHint')}</span>
            </div>
            <div className="atlas-option-grid atlas-option-grid--three-columns">
              {questionCountOptions.map((questionCount) => {
                const disabled = questionCount !== 'all' && availableQuestions < questionCount;
                const label =
                  questionCount === 'all'
                    ? `${t('atlas.questionCountAll')} (${numberFormat.format(availableQuestions)})`
                    : String(questionCount);

                return (
                  <AtlasOptionCard
                    key={questionCount}
                    label={label}
                    description={
                      disabled
                        ? t('atlas.questionCountUnavailable')
                        : questionCount === 'all'
                          ? t('atlas.questionCountAllDescription')
                          : undefined
                    }
                    selected={selection.questionCount === questionCount}
                    onSelect={() => onQuestionCountChange(questionCount)}
                    disabled={disabled}
                  />
                );
              })}
            </div>
          </div>

          {selection.category === 'countries' ? (
            <div className="atlas-field-group">
              <div className="atlas-field-group__label-row">
                <span className="atlas-field-group__label">{t('atlas.attemptsLegend')}</span>
                <span className="muted-text">{t('atlas.attemptsHint')}</span>
              </div>
              <div className="atlas-option-grid atlas-option-grid--two-columns">
                {attemptOptions.map((attempts) => (
                  <AtlasOptionCard
                    key={attempts}
                    label={attempts === 1 ? t('atlas.attemptOneLabel') : t('atlas.attemptTwoLabel')}
                    description={
                      attempts === 1
                        ? t('atlas.attemptOneDescription')
                        : t('atlas.attemptTwoDescription')
                    }
                    selected={selection.maxAttempts === attempts}
                    onSelect={() => onAttemptsChange(attempts)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="atlas-config-panel__actions">
            <button type="button" className="atlas-primary-button" onClick={onStart}>
              {t('atlas.startGame')}
            </button>
            <Link className="atlas-tertiary-link" to="/">
              {t('common.backToHome')}
            </Link>
          </div>
        </section>

        <aside className="panel atlas-panel atlas-summary-panel" aria-label={t('atlas.summaryTitle')}>
          <div className="atlas-panel__header">
            <div>
              <p className="atlas-panel__eyebrow">{t('atlas.summaryEyebrow')}</p>
              <h3>{t('atlas.summaryTitle')}</h3>
            </div>
            <span className="atlas-summary-panel__emoji" aria-hidden="true">
              {categoryIcons[selection.category]}
            </span>
          </div>

          <div className="atlas-summary-stack">
            <div className="atlas-summary-stat">
              <span>{t('atlas.bestScoreLabel')}</span>
              <strong>
                {bestScore === null
                  ? t('atlas.noBestScore')
                  : `${formatPoints(bestScore)} / ${formatPoints(perfectScore)}`}
              </strong>
            </div>
            <div className="atlas-summary-stat">
              <span>{t('atlas.availableQuestionsLabel')}</span>
              <strong>{numberFormat.format(availableQuestions)}</strong>
            </div>
            <div className="atlas-summary-stat">
              <span>{t('atlas.modeLabel')}</span>
              <strong>{t(`atlas.mode.${selection.category}`)}</strong>
            </div>
            <div className="atlas-summary-stat">
              <span>{t('atlas.regionLabel')}</span>
              <strong>{t(`atlas.region.${selection.region}`)}</strong>
            </div>
            <div className="atlas-summary-stat">
              <span>{t('atlas.questionCountLabel')}</span>
              <strong>
                {selection.questionCount === 'all'
                  ? `${t('atlas.questionCountAll')} (${numberFormat.format(availableQuestions)})`
                  : numberFormat.format(selection.questionCount)}
              </strong>
            </div>
          </div>

          <p className="muted-text atlas-summary-panel__note">
            {selection.category === 'countries'
              ? selection.maxAttempts === 1
                ? t('atlas.summaryCountriesOneAttempt')
                : t('atlas.summaryCountriesTwoAttempts')
              : t('atlas.summaryCapitals')}
          </p>
        </aside>
      </div>
    </div>
  );
}

function AtlasGameScreen({ config, onFinish, onQuit, onOpenResult }: AtlasGameScreenProps) {
  const t = useT();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const game = useAtlasGame(config);
  const { currentQuestion, state, summary } = game;
  const numberFormat = useMemo(
    () => new Intl.NumberFormat(language === 'nb' ? 'nb-NO' : 'en-US'),
    [language],
  );
  const activeCountries = useMemo(
    () =>
      new Set(
        (config.region === 'world' ? getCountries() : getCountries(config.region)).map((country) => country.iso2),
      ),
    [config.region],
  );
  const localizedCountryLabels = useMemo(
    () =>
      Object.fromEntries(
        countries.map((country) => [country.iso2, language === 'nb' ? country.nameNb : country.nameEn]),
      ),
    [language],
  );
  const formatPoints = (value: number) => `${numberFormat.format(value)} ${t('atlas.pointsUnit')}`;
  const formatDistance = (value: number) => `${numberFormat.format(value)} ${t('atlas.distanceUnit')}`;

  if (!currentQuestion) {
    return <Navigate to="/atlas/result" replace />;
  }

  const currentQuestionState = state.questionStates[state.currentQuestionIndex];
  const latestCountryAnswer = state.lastAnswer?.category === 'countries' ? state.lastAnswer : null;
  const latestCapitalAnswer = state.lastAnswer?.category === 'capitals' ? state.lastAnswer : null;
  const country = countryByIso2.get(currentQuestion.iso2);
  const capital = capitalByIso2.get(currentQuestion.iso2);
  const currentCountryName =
    language === 'nb' ? country?.nameNb ?? currentQuestion.iso2 : country?.nameEn ?? currentQuestion.iso2;
  const currentCapitalName =
    language === 'nb' ? capital?.nameNb ?? currentQuestion.iso2 : capital?.nameEn ?? currentQuestion.iso2;
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const canAdvance = currentQuestionState.completed;
  const currentScore = formatPoints(summary.points);
  const bestScore = getBestScore(toScoreConfig({
    category: config.category,
    region: config.region,
    questionCount: config.questionCount,
    maxAttempts: config.maxAttempts,
  }));

  let highlights: AtlasMapHighlight[] = [];
  let pins: AtlasMapPin[] = [];
  let lines: AtlasMapLine[] = [];
  let fitTo: string[] | undefined;
  const focusRegion = config.region === 'world' ? undefined : config.region;
  const isCountryGame = config.category === 'countries';

  if (latestCountryAnswer) {
    if (latestCountryAnswer.correct) {
      highlights = [{ iso2: latestCountryAnswer.correctIso2, state: 'correct' }];
      fitTo = [latestCountryAnswer.correctIso2];
    } else {
      highlights = [
        { iso2: latestCountryAnswer.pickedIso2, state: 'wrong' },
        {
          iso2: latestCountryAnswer.correctIso2,
          state: latestCountryAnswer.completed ? 'target' : 'hint',
        },
      ];
      fitTo = [latestCountryAnswer.correctIso2];
    }
  }

  if (latestCapitalAnswer) {
    pins = [
      { ...latestCapitalAnswer.guess, kind: 'guess' },
      { ...latestCapitalAnswer.answer, kind: 'answer' },
    ];
    lines = [
      {
        from: latestCapitalAnswer.guess,
        to: latestCapitalAnswer.answer,
      },
    ];
    highlights = [{ iso2: latestCapitalAnswer.correctIso2, state: 'target' }];
  }

  const feedbackTone =
    latestCountryAnswer?.correct || latestCapitalAnswer?.correct
      ? 'is-success'
      : latestCountryAnswer || latestCapitalAnswer
        ? 'is-warning'
        : 'is-neutral';

  const feedbackTitle = (() => {
    if (!latestCountryAnswer && !latestCapitalAnswer) {
      return isCountryGame ? t('atlas.feedbackCountryPendingTitle') : t('atlas.feedbackCapitalPendingTitle');
    }

    if (latestCountryAnswer) {
      if (latestCountryAnswer.correct) {
        return t('atlas.feedbackCountryCorrectTitle');
      }

      return latestCountryAnswer.completed
        ? t('atlas.feedbackCountryWrongTitle')
        : t('atlas.feedbackCountryTryAgainTitle');
    }

    return latestCapitalAnswer?.correct
      ? t('atlas.feedbackCapitalCloseTitle')
      : t('atlas.feedbackCapitalPlacedTitle');
  })();

  const feedbackBody = (() => {
    if (!latestCountryAnswer && !latestCapitalAnswer) {
      return isCountryGame ? t('atlas.feedbackCountryPendingBody') : t('atlas.feedbackCapitalPendingBody');
    }

    if (latestCountryAnswer) {
      const wrongCountryName =
        language === 'nb'
          ? countryByIso2.get(latestCountryAnswer.pickedIso2)?.nameNb ?? latestCountryAnswer.pickedIso2
          : countryByIso2.get(latestCountryAnswer.pickedIso2)?.nameEn ?? latestCountryAnswer.pickedIso2;

      if (latestCountryAnswer.correct) {
        return t('atlas.feedbackCountryCorrectBody');
      }

      if (!latestCountryAnswer.completed) {
        return `${wrongCountryName}. ${t('atlas.feedbackCountryTryAgainBody')} ${currentCountryName}.`;
      }

      return `${wrongCountryName}. ${t('atlas.feedbackCountryWrongBody')} ${currentCountryName}.`;
    }

    if (!latestCapitalAnswer) {
      return t('atlas.feedbackCapitalPendingBody');
    }

    return `${formatDistance(latestCapitalAnswer.distanceKm)} • ${formatPoints(latestCapitalAnswer.points)}`;
  })();

  const feedbackMeta = latestCapitalAnswer
    ? [
        {
          label: t('atlas.distanceLabel'),
          value: formatDistance(latestCapitalAnswer.distanceKm),
        },
        {
          label: t('atlas.pointsAwardedLabel'),
          value: formatPoints(latestCapitalAnswer.points),
        },
      ]
    : latestCountryAnswer
      ? [
          {
            label: t('atlas.pointsAwardedLabel'),
            value: formatPoints(latestCountryAnswer.points),
          },
          {
            label: t('atlas.attemptLabel'),
            value: `${latestCountryAnswer.attempt}/${config.maxAttempts}`,
          },
        ]
      : [];

  const handleAdvance = () => {
    if (!canAdvance) {
      return;
    }

    if (isLastQuestion) {
      const finishedAt = new Date().toISOString();
      const scoreConfig = toScoreConfig({
        category: config.category,
        region: config.region,
        questionCount: config.questionCount,
        maxAttempts: config.maxAttempts,
      });
      const previousBest = getBestScore(scoreConfig);
      recordGameResult(scoreConfig, summary, undefined, finishedAt);
      onFinish({
        config,
        result: summary,
        newRecord: previousBest === null || summary.points > previousBest,
        finishedAt,
      });
      onOpenResult();
      navigate('/atlas/result');
      return;
    }

    game.next();
  };

  return (
    <div className="atlas-layout atlas-layout--game">
      <section className="panel atlas-panel atlas-quiz__header">
        <div>
          <p className="atlas-panel__eyebrow">{t(`atlas.mode.${config.category}`)}</p>
          <h2>{t('atlas.quizTitle')}</h2>
        </div>
        <div className="atlas-quiz__stats" aria-label={t('atlas.quizStatsLabel')}>
          <div className="atlas-stat-card">
            <span>{t('atlas.progressLabel')}</span>
            <strong>
              {state.currentQuestionIndex + 1}/{state.questions.length}
            </strong>
          </div>
          <div className="atlas-stat-card">
            <span>{t('atlas.scoreLabel')}</span>
            <strong>{currentScore}</strong>
          </div>
          <div className="atlas-stat-card">
            <span>{t('atlas.bestScoreLabel')}</span>
            <strong>{bestScore === null ? t('atlas.noBestScoreShort') : formatPoints(bestScore)}</strong>
          </div>
        </div>
        <button type="button" className="atlas-secondary-button atlas-quiz__quit" onClick={onQuit}>
          {t('atlas.quitGame')}
        </button>
      </section>

      <div className="atlas-quiz__top-grid">
        <section className="panel atlas-panel atlas-quiz__prompt">
          <p className="atlas-panel__eyebrow">
            {isCountryGame ? t('atlas.countryPromptEyebrow') : t('atlas.capitalPromptEyebrow')}
          </p>
          <h3 data-testid="atlas-question-primary">
            {isCountryGame ? currentCountryName : currentCapitalName}
          </h3>
          <p className="muted-text">
            {isCountryGame
              ? t('atlas.countryPromptBody')
              : `${t('atlas.capitalPromptPrefix')} ${currentCountryName}?`}
          </p>
          {isCountryGame && config.maxAttempts === 2 ? (
            <div className="atlas-inline-note">
              <span aria-hidden="true">💡</span>
              <span>{t('atlas.countryTwoAttemptsHint')}</span>
            </div>
          ) : null}
        </section>

        <section
          className={['panel', 'atlas-panel', 'atlas-feedback-card', feedbackTone].join(' ')}
          aria-live="polite"
          data-testid="atlas-feedback"
        >
          <p className="atlas-panel__eyebrow">{t('atlas.feedbackEyebrow')}</p>
          <h3>{feedbackTitle}</h3>
          <p>{feedbackBody}</p>
          {feedbackMeta.length > 0 ? (
            <dl className="atlas-feedback-card__meta">
              {feedbackMeta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      </div>

      <section className="atlas-quiz__map-section" aria-label={t('atlas.mapSectionLabel')}>
        <MapView
          mode={isCountryGame ? 'pickCountry' : 'placePin'}
          className="atlas-map--immersive"
          onCountryPick={(selection) => game.submitCountryAnswer(selection.iso2)}
          onPinPlace={game.submitCapitalAnswer}
          highlights={highlights}
          pins={pins}
          lines={lines}
          fitTo={fitTo}
          focusRegion={fitTo ? undefined : focusRegion}
          activeIso2={activeCountries}
          labelsByIso2={localizedCountryLabels}
          disabled={Boolean(latestCapitalAnswer) || Boolean(latestCountryAnswer?.completed)}
          ariaLabel={
            isCountryGame ? t('atlas.mapAriaLabelCountries') : t('atlas.mapAriaLabelCapitals')
          }
        />
      </section>

      <div className="atlas-quiz__actions">
        <button type="button" className="atlas-secondary-button" onClick={onQuit}>
          {t('atlas.quitGame')}
        </button>
        {canAdvance ? (
          <button type="button" className="atlas-primary-button" onClick={handleAdvance}>
            {isLastQuestion ? t('atlas.seeResults') : t('atlas.nextQuestion')}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function AtlasResultScreen({ completedRun, onPlayAgain, onBack }: AtlasResultScreenProps) {
  const t = useT();
  const { language } = useLanguage();
  const numberFormat = useMemo(
    () => new Intl.NumberFormat(language === 'nb' ? 'nb-NO' : 'en-US'),
    [language],
  );
  const { config, result, newRecord } = completedRun;
  const averageDistance = result.avgDistanceKm;
  const formatPoints = (value: number) => `${numberFormat.format(value)} ${t('atlas.pointsUnit')}`;
  const formatDistance = (value: number) => `${numberFormat.format(value)} ${t('atlas.distanceUnit')}`;

  return (
    <div className="atlas-layout">
      <section className="hero atlas-result-hero">
        <span className="hero__pill">🏁 {t('atlas.resultPill')}</span>
        <h2>{t('atlas.resultTitle')}</h2>
        <p>
          {t(`atlas.mode.${config.category}`)} • {t(`atlas.region.${config.region}`)} •{' '}
          {config.questionCount === 'all'
            ? `${t('atlas.questionCountAll')} (${numberFormat.format(result.total)})`
            : numberFormat.format(config.questionCount)}
        </p>
        {newRecord ? <div className="atlas-record-badge">{t('atlas.newRecord')}</div> : null}
        <div className="atlas-result-stats" aria-label={t('atlas.resultStatsLabel')}>
          <div className="atlas-stat-card atlas-stat-card--large">
            <span>{t('atlas.pointsLabel')}</span>
            <strong>
              {formatPoints(result.points)} / {formatPoints(result.maxPoints)}
            </strong>
          </div>
          <div className="atlas-stat-card atlas-stat-card--large">
            <span>{t('atlas.correctCountLabel')}</span>
            <strong>
              {numberFormat.format(result.correct)} / {numberFormat.format(result.total)}
            </strong>
          </div>
          {typeof averageDistance === 'number' ? (
            <div className="atlas-stat-card atlas-stat-card--large">
              <span>{t('atlas.averageDistanceLabel')}</span>
              <strong>{formatDistance(averageDistance)}</strong>
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel atlas-panel atlas-result-list-panel">
        <div className="atlas-panel__header">
          <div>
            <p className="atlas-panel__eyebrow">{t('atlas.resultBreakdownEyebrow')}</p>
            <h3>{t('atlas.resultBreakdownTitle')}</h3>
          </div>
        </div>

        <ol className="atlas-result-list" data-testid="atlas-result-list">
          {result.perQuestion.map((question, index) => {
            const country = countryByIso2.get(question.iso2);
            const capital = capitalByIso2.get(question.iso2);
            const countryName = language === 'nb' ? country?.nameNb ?? question.iso2 : country?.nameEn ?? question.iso2;
            const capitalName = language === 'nb' ? capital?.nameNb ?? question.iso2 : capital?.nameEn ?? question.iso2;

            return (
              <li
                key={question.questionId}
                className={[
                  'atlas-result-list__item',
                  question.correct ? 'is-correct' : 'is-missed',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="atlas-result-list__index">{index + 1}</div>
                <div className="atlas-result-list__content">
                  <div className="atlas-result-list__title-row">
                    <strong>
                      {question.category === 'countries'
                        ? countryName
                        : `${capitalName} • ${countryName}`}
                    </strong>
                    <span className="atlas-result-list__points">{formatPoints(question.points)}</span>
                  </div>
                  <div className="atlas-result-list__meta">
                    <span>{question.correct ? t('atlas.answerCorrect') : t('atlas.answerMissed')}</span>
                    <span>
                      {t('atlas.attemptLabel')}: {question.attemptsUsed}
                    </span>
                    {typeof question.distanceKm === 'number' ? (
                      <span>
                        {t('atlas.distanceLabel')}: {formatDistance(question.distanceKm)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="atlas-result-actions">
        <button type="button" className="atlas-primary-button" onClick={onPlayAgain}>
          {t('atlas.playAgain')}
        </button>
        <button type="button" className="atlas-secondary-button" onClick={onBack}>
          {t('atlas.backToAtlasHome')}
        </button>
      </div>
    </div>
  );
}

export default function AtlasPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selection, setSelection] = useState<AtlasSelection>(defaultSelection);
  const [activeRun, setActiveRun] = useState<{ key: number; config: GameConfig } | null>(null);
  const [completedRun, setCompletedRun] = useState<CompletedRun | null>(null);
  const normalizedSelection = normalizeSelection(selection);
  const availableQuestions = getAvailableQuestionCount(normalizedSelection);
  const perfectScore = resolveQuestionTotal(normalizedSelection) * MAX_POINTS_PER_QUESTION;
  const bestScore = getBestScore(toScoreConfig(normalizedSelection));

  const updateSelection = (nextSelection: AtlasSelection) => {
    setSelection(normalizeSelection(nextSelection));
  };

  const startGame = (nextSelection = normalizedSelection) => {
    const normalizedNextSelection = normalizeSelection(nextSelection);
    setSelection(normalizedNextSelection);
    setCompletedRun(null);
    setActiveRun((currentRun) => ({
      key: (currentRun?.key ?? 0) + 1,
      config: {
        ...normalizedNextSelection,
        language,
      },
    }));
    navigate('/atlas/play');
  };

  return (
    <Routes>
      <Route
        index
        element={
          <AtlasHome
            selection={normalizedSelection}
            bestScore={bestScore}
            availableQuestions={availableQuestions}
            perfectScore={perfectScore}
            onCategoryChange={(category) => updateSelection({ ...normalizedSelection, category })}
            onRegionChange={(region) => updateSelection({ ...normalizedSelection, region })}
            onQuestionCountChange={(questionCount) => updateSelection({ ...normalizedSelection, questionCount })}
            onAttemptsChange={(maxAttempts) => updateSelection({ ...normalizedSelection, maxAttempts })}
            onStart={() => startGame()}
          />
        }
      />
      <Route
        path="play"
        element={
          activeRun ? (
            <AtlasGameScreen
              key={activeRun.key}
              config={activeRun.config}
              onFinish={setCompletedRun}
              onQuit={() => navigate('/atlas')}
              onOpenResult={() => navigate('/atlas/result')}
            />
          ) : (
            <Navigate to="/atlas" replace />
          )
        }
      />
      <Route
        path="result"
        element={
          completedRun ? (
            <AtlasResultScreen
              completedRun={completedRun}
              onPlayAgain={() =>
                startGame({
                  category: completedRun.config.category,
                  region: completedRun.config.region,
                  questionCount: completedRun.config.questionCount,
                  maxAttempts: completedRun.config.maxAttempts,
                })
              }
              onBack={() => navigate('/atlas')}
            />
          ) : (
            <Navigate to="/atlas" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/atlas" replace />} />
    </Routes>
  );
}
