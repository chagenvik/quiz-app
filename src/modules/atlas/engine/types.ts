import type { AtlasRegion } from '../data';

export type Category = 'countries' | 'capitals';
export type GameRegion = 'world' | AtlasRegion;
export type GameQuestionCount = 10 | 20 | 'all';
export type CountryMaxAttempts = 1 | 2;
export type GameLanguage = 'nb' | 'en';
export type RandomSource = () => number;

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GameConfig {
  category: Category;
  region: GameRegion;
  questionCount: GameQuestionCount;
  maxAttempts: CountryMaxAttempts;
  language: GameLanguage;
}

export interface Question {
  id: string;
  category: Category;
  iso2: string;
  region: AtlasRegion;
  isMicrostate: boolean;
}

export interface DistanceThresholds {
  perfectKm: number;
  zeroKm: number;
}

interface BaseAnswerResult {
  questionId: string;
  questionIso2: string;
  correctIso2: string;
  attempt: number;
  points: number;
  maxPoints: number;
  completed: boolean;
  correct: boolean;
}

export interface CountryAnswerResult extends BaseAnswerResult {
  category: 'countries';
  pickedIso2: string;
  remainingAttempts: number;
}

export interface CapitalAnswerResult extends BaseAnswerResult {
  category: 'capitals';
  guess: Coordinates;
  answer: Coordinates;
  distanceKm: number;
  thresholdsKm: DistanceThresholds;
}

export type AnswerResult = CountryAnswerResult | CapitalAnswerResult;

export interface QuestionState {
  question: Question;
  attemptsUsed: number;
  completed: boolean;
  answeredCorrectly: boolean;
  points: number;
  bestDistanceKm?: number;
  answers: AnswerResult[];
}

export type GameStatus = 'in_progress' | 'finished';

export interface GameState {
  config: GameConfig;
  questions: Question[];
  questionStates: QuestionState[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  status: GameStatus;
  lastAnswer: AnswerResult | null;
}

export interface PerQuestionResult {
  questionId: string;
  iso2: string;
  category: Category;
  completed: boolean;
  correct: boolean;
  attemptsUsed: number;
  points: number;
  maxPoints: number;
  distanceKm?: number;
}

export interface GameResult {
  points: number;
  maxPoints: number;
  correct: number;
  total: number;
  avgDistanceKm?: number;
  perQuestion: PerQuestionResult[];
}

export type ScoreKeyConfig = Pick<GameConfig, 'category' | 'region' | 'questionCount' | 'maxAttempts'>;

export interface StoredGameResult extends GameResult {
  config: ScoreKeyConfig;
  finishedAt: string;
}

export interface AtlasStorageSnapshot {
  version: 1;
  bestScores: Record<string, number>;
  lastResults: StoredGameResult[];
  totalGamesPlayed: number;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}
