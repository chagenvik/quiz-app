import { describe, expect, it } from 'vitest';
import { getCapitals, getCountries } from '../data';
import {
  createGame,
  getCapitalDistanceThresholds,
  haversineKm,
  nextQuestion,
  submitCapitalAnswer,
  submitCountryAnswer,
  summarize,
} from './core';
import type { GameConfig, GameState, RandomSource } from './types';

function createSequenceRng(values: number[]): RandomSource {
  let index = 0;
  return () => {
    const nextValue = values[index % values.length];
    index += 1;
    return nextValue;
  };
}

function moveToQuestion(state: GameState, iso2: string): GameState {
  const nextIndex = state.questions.findIndex((question) => question.iso2 === iso2);

  if (nextIndex === -1) {
    throw new Error(`Question ${iso2} was not found in the game.`);
  }

  return {
    ...state,
    currentQuestionIndex: nextIndex,
    currentQuestion: state.questions[nextIndex],
    lastAnswer: null,
  };
}

function toAntipode(lat: number, lon: number) {
  return {
    lat: -lat,
    lon: lon >= 0 ? lon - 180 : lon + 180,
  };
}

describe('atlas engine core', () => {
  it('creates unique shuffled country questions for the selected region', () => {
    const state = createGame(
      {
        category: 'countries',
        region: 'europe',
        questionCount: 20,
        maxAttempts: 2,
        language: 'en',
      },
      createSequenceRng([0.2, 0.8, 0.1, 0.6, 0.4]),
    );
    const sourceIso2 = getCountries('europe')
      .slice(0, 5)
      .map((country) => country.iso2);

    expect(state.questions).toHaveLength(20);
    expect(new Set(state.questions.map((question) => question.iso2)).size).toBe(20);
    expect(state.questions.every((question) => question.region === 'europe')).toBe(true);
    expect(state.questions.some((question) => question.isMicrostate)).toBe(true);
    expect(state.questions.slice(0, 5).map((question) => question.iso2)).not.toEqual(sourceIso2);
  });

  it('keeps country questions open after a first miss and awards 50 points on a second-try hit', () => {
    const config: GameConfig = {
      category: 'countries',
      region: 'world',
      questionCount: 10,
      maxAttempts: 2,
      language: 'nb',
    };
    let state = createGame(config, () => 0);
    const targetIso2 = state.currentQuestion?.iso2;
    const wrongIso2 = state.questions.find((question) => question.iso2 !== targetIso2)?.iso2;

    expect(targetIso2).toBeTruthy();
    expect(wrongIso2).toBeTruthy();

    state = submitCountryAnswer(state, wrongIso2 ?? 'ZZ');

    expect(state.lastAnswer).toMatchObject({
      category: 'countries',
      correct: false,
      attempt: 1,
      points: 0,
      remainingAttempts: 1,
      completed: false,
    });

    const stalledState = nextQuestion(state);
    expect(stalledState.currentQuestion?.iso2).toBe(targetIso2);

    state = submitCountryAnswer(state, targetIso2 ?? 'ZZ');

    expect(state.lastAnswer).toMatchObject({
      category: 'countries',
      correct: true,
      attempt: 2,
      points: 50,
      remainingAttempts: 0,
      completed: true,
    });
    expect(state.questionStates[0].points).toBe(50);
  });

  it('applies tighter distance thresholds to regional capital games', () => {
    const worldThresholds = getCapitalDistanceThresholds('world');
    const europeThresholds = getCapitalDistanceThresholds('europe');
    const paris = getCapitals('europe').find((capital) => capital.iso2 === 'FR');

    expect(paris).toBeDefined();
    expect(europeThresholds.perfectKm).toBeLessThan(worldThresholds.perfectKm);
    expect(europeThresholds.zeroKm).toBeLessThan(worldThresholds.zeroKm);

    const guess = {
      lat: (paris?.lat ?? 0) + 9.5,
      lon: paris?.lon ?? 0,
    };
    const europeState = moveToQuestion(
      createGame(
        {
          category: 'capitals',
          region: 'europe',
          questionCount: 'all',
          maxAttempts: 1,
          language: 'en',
        },
        () => 0,
      ),
      'FR',
    );
    const worldState = moveToQuestion(
      createGame(
        {
          category: 'capitals',
          region: 'world',
          questionCount: 'all',
          maxAttempts: 1,
          language: 'en',
        },
        () => 0,
      ),
      'FR',
    );
    const answeredEuropeState = submitCapitalAnswer(europeState, guess);
    const answeredWorldState = submitCapitalAnswer(worldState, guess);
    const europeAnswer =
      answeredEuropeState.lastAnswer?.category === 'capitals' ? answeredEuropeState.lastAnswer : null;
    const worldAnswer =
      answeredWorldState.lastAnswer?.category === 'capitals' ? answeredWorldState.lastAnswer : null;

    expect(europeAnswer?.category).toBe('capitals');
    expect(worldAnswer?.category).toBe('capitals');
    expect(europeAnswer?.distanceKm).toBeGreaterThan(1000);
    expect((europeAnswer?.points ?? 0) < (worldAnswer?.points ?? 0)).toBe(true);
  });

  it('summarizes points, correctness, and average capital distance', () => {
    let state = createGame(
      {
        category: 'capitals',
        region: 'world',
        questionCount: 10,
        maxAttempts: 1,
        language: 'en',
      },
      () => 0,
    );

    const firstCapital = getCapitals().find((capital) => capital.iso2 === state.currentQuestion?.iso2);
    expect(firstCapital).toBeDefined();
    state = submitCapitalAnswer(state, {
      lat: firstCapital?.lat ?? 0,
      lon: firstCapital?.lon ?? 0,
    });
    state = nextQuestion(state);

    const secondCapital = getCapitals().find((capital) => capital.iso2 === state.currentQuestion?.iso2);
    expect(secondCapital).toBeDefined();
    state = submitCapitalAnswer(
      state,
      toAntipode(secondCapital?.lat ?? 0, secondCapital?.lon ?? 0),
    );

    const summary = summarize(state);

    expect(summary.points).toBe(100);
    expect(summary.correct).toBe(1);
    expect(summary.total).toBe(10);
    expect(summary.avgDistanceKm).toBeGreaterThan(5000);
    expect(summary.perQuestion[0]).toMatchObject({
      completed: true,
      correct: true,
      points: 100,
      distanceKm: 0,
    });
    expect(summary.perQuestion[1].completed).toBe(true);
  });

  it('calculates haversine distance in kilometres', () => {
    const distanceKm = haversineKm(
      { lat: 48.8566, lon: 2.3522 },
      { lat: 51.5072, lon: -0.1276 },
    );

    expect(distanceKm).toBeCloseTo(343.6, 0);
  });
});
