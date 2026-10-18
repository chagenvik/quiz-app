import { capitals, countries, getCapitals, getCountries, type AtlasCapital, type AtlasCountry } from '../data';
import {
  CAPITAL_DISTANCE_THRESHOLDS_KM,
  COUNTRY_SECOND_TRY_POINTS,
  MAX_POINTS_PER_QUESTION,
} from './constants';
import type {
  CapitalAnswerResult,
  Coordinates,
  CountryAnswerResult,
  DistanceThresholds,
  GameConfig,
  GameRegion,
  GameResult,
  GameState,
  Question,
  QuestionState,
  RandomSource,
} from './types';

const countryByIso2 = new Map(countries.map((country) => [country.iso2, country]));
const capitalByIso2 = new Map(capitals.map((capital) => [capital.iso2, capital]));

function shuffle<T>(values: T[], rng: RandomSource): T[] {
  const nextValues = [...values];

  for (let index = nextValues.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [nextValues[index], nextValues[swapIndex]] = [nextValues[swapIndex], nextValues[index]];
  }

  return nextValues;
}

function resolveQuestionLimit(config: GameConfig, available: number) {
  return config.questionCount === 'all' ? available : Math.min(config.questionCount, available);
}

function createQuestion(country: AtlasCountry, category: GameConfig['category']): Question {
  return {
    id: `${category}:${country.iso2}`,
    category,
    iso2: country.iso2,
    region: country.region,
    isMicrostate: country.isMicrostate,
  };
}

function createCapitalQuestion(capital: AtlasCapital): Question {
  const country = countryByIso2.get(capital.iso2);

  if (!country) {
    throw new Error(`Missing country metadata for capital ${capital.iso2}.`);
  }

  return createQuestion(country, 'capitals');
}

function createQuestionState(question: Question): QuestionState {
  return {
    question,
    attemptsUsed: 0,
    completed: false,
    answeredCorrectly: false,
    points: 0,
    answers: [],
  };
}

function withUpdatedCurrentQuestionState(
  state: GameState,
  updater: (questionState: QuestionState) => QuestionState,
): GameState {
  const nextQuestionStates = state.questionStates.map((questionState, index) =>
    index === state.currentQuestionIndex ? updater(questionState) : questionState,
  );

  return {
    ...state,
    questionStates: nextQuestionStates,
  };
}

function calculateCapitalScore(distanceKm: number, thresholdsKm: DistanceThresholds) {
  if (distanceKm <= thresholdsKm.perfectKm) {
    return 1;
  }

  if (distanceKm >= thresholdsKm.zeroKm) {
    return 0;
  }

  return 1 - (distanceKm - thresholdsKm.perfectKm) / (thresholdsKm.zeroKm - thresholdsKm.perfectKm);
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

export function getCapitalDistanceThresholds(region: GameRegion): DistanceThresholds {
  return CAPITAL_DISTANCE_THRESHOLDS_KM[region];
}

export function haversineKm(from: Coordinates, to: Coordinates): number {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(to.lat - from.lat);
  const longitudeDelta = toRadians(to.lon - from.lon);
  const fromLatitude = toRadians(from.lat);
  const toLatitude = toRadians(to.lat);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

export function createGame(config: GameConfig, rng: RandomSource = Math.random): GameState {
  const limitedQuestions =
    config.category === 'countries'
      ? shuffle(
          config.region === 'world' ? getCountries() : getCountries(config.region),
          rng,
        )
          .slice(0, resolveQuestionLimit(config, config.region === 'world' ? getCountries().length : getCountries(config.region).length))
          .map((country) => createQuestion(country, 'countries'))
      : shuffle(
          config.region === 'world' ? getCapitals() : getCapitals(config.region),
          rng,
        )
          .slice(0, resolveQuestionLimit(config, config.region === 'world' ? getCapitals().length : getCapitals(config.region).length))
          .map((capital) => createCapitalQuestion(capital));
  const questionStates = limitedQuestions.map(createQuestionState);
  const currentQuestion = limitedQuestions[0] ?? null;

  return {
    config,
    questions: limitedQuestions,
    questionStates,
    currentQuestionIndex: currentQuestion ? 0 : -1,
    currentQuestion,
    status: currentQuestion ? 'in_progress' : 'finished',
    lastAnswer: null,
  };
}

export function submitCountryAnswer(state: GameState, pickedIso2: string): GameState {
  if (state.status === 'finished' || !state.currentQuestion || state.currentQuestion.category !== 'countries') {
    return state;
  }

  const currentQuestionState = state.questionStates[state.currentQuestionIndex];

  if (currentQuestionState.completed) {
    return state;
  }

  const attempt = currentQuestionState.attemptsUsed + 1;
  const correct = pickedIso2 === state.currentQuestion.iso2;
  const completed = correct || attempt >= state.config.maxAttempts;
  const points =
    correct && attempt === 1
      ? MAX_POINTS_PER_QUESTION
      : correct && attempt === 2
        ? COUNTRY_SECOND_TRY_POINTS
        : 0;
  const result: CountryAnswerResult = {
    category: 'countries',
    questionId: state.currentQuestion.id,
    questionIso2: state.currentQuestion.iso2,
    correctIso2: state.currentQuestion.iso2,
    pickedIso2,
    attempt,
    points,
    maxPoints: MAX_POINTS_PER_QUESTION,
    completed,
    correct,
    remainingAttempts: Math.max(state.config.maxAttempts - attempt, 0),
  };

  const nextState = withUpdatedCurrentQuestionState(state, (questionState) => ({
    ...questionState,
    attemptsUsed: attempt,
    completed,
    answeredCorrectly: correct,
    points: correct ? points : questionState.points,
    answers: [...questionState.answers, result],
  }));

  return {
    ...nextState,
    lastAnswer: result,
  };
}

export function submitCapitalAnswer(state: GameState, guess: Coordinates): GameState {
  if (state.status === 'finished' || !state.currentQuestion || state.currentQuestion.category !== 'capitals') {
    return state;
  }

  const currentQuestionState = state.questionStates[state.currentQuestionIndex];

  if (currentQuestionState.completed) {
    return state;
  }

  const capital = capitalByIso2.get(state.currentQuestion.iso2);

  if (!capital) {
    throw new Error(`Missing capital coordinates for ${state.currentQuestion.iso2}.`);
  }

  const thresholdsKm = getCapitalDistanceThresholds(state.config.region);
  const rawDistanceKm = haversineKm(guess, { lat: capital.lat, lon: capital.lon });
  const points = Math.round(MAX_POINTS_PER_QUESTION * calculateCapitalScore(rawDistanceKm, thresholdsKm));
  const distanceKm = roundToOneDecimal(rawDistanceKm);
  const result: CapitalAnswerResult = {
    category: 'capitals',
    questionId: state.currentQuestion.id,
    questionIso2: state.currentQuestion.iso2,
    correctIso2: state.currentQuestion.iso2,
    attempt: 1,
    points,
    maxPoints: MAX_POINTS_PER_QUESTION,
    completed: true,
    correct: rawDistanceKm <= thresholdsKm.perfectKm,
    guess,
    answer: { lat: capital.lat, lon: capital.lon },
    distanceKm,
    thresholdsKm,
  };

  const nextState = withUpdatedCurrentQuestionState(state, (questionState) => ({
    ...questionState,
    attemptsUsed: 1,
    completed: true,
    answeredCorrectly: result.correct,
    points,
    bestDistanceKm: distanceKm,
    answers: [...questionState.answers, result],
  }));

  return {
    ...nextState,
    lastAnswer: result,
  };
}

export function nextQuestion(state: GameState): GameState {
  if (state.status === 'finished' || !state.currentQuestion) {
    return state;
  }

  const currentQuestionState = state.questionStates[state.currentQuestionIndex];

  if (!currentQuestionState.completed) {
    return state;
  }

  const nextQuestionIndex = state.currentQuestionIndex + 1;
  const nextQuestion = state.questions[nextQuestionIndex] ?? null;

  return {
    ...state,
    currentQuestionIndex: nextQuestion ? nextQuestionIndex : state.currentQuestionIndex,
    currentQuestion: nextQuestion,
    status: nextQuestion ? 'in_progress' : 'finished',
    lastAnswer: null,
  };
}

export function summarize(state: GameState): GameResult {
  const perQuestion = state.questionStates.map((questionState) => ({
    questionId: questionState.question.id,
    iso2: questionState.question.iso2,
    category: questionState.question.category,
    completed: questionState.completed,
    correct: questionState.answeredCorrectly,
    attemptsUsed: questionState.attemptsUsed,
    points: questionState.points,
    maxPoints: MAX_POINTS_PER_QUESTION,
    distanceKm: questionState.bestDistanceKm,
  }));
  const distances = perQuestion
    .map((questionResult) => questionResult.distanceKm)
    .filter((distanceKm): distanceKm is number => typeof distanceKm === 'number');
  const totalPoints = perQuestion.reduce((sum, questionResult) => sum + questionResult.points, 0);
  const correctAnswers = perQuestion.filter((questionResult) => questionResult.correct).length;

  return {
    points: totalPoints,
    maxPoints: perQuestion.length * MAX_POINTS_PER_QUESTION,
    correct: correctAnswers,
    total: perQuestion.length,
    avgDistanceKm:
      distances.length > 0 ? roundToOneDecimal(distances.reduce((sum, distanceKm) => sum + distanceKm, 0) / distances.length) : undefined,
    perQuestion,
  };
}
