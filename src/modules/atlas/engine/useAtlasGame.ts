import { useCallback, useMemo, useState } from 'react';
import {
  createGame,
  nextQuestion,
  submitCapitalAnswer,
  submitCountryAnswer,
  summarize,
} from './core';
import type { Coordinates, GameConfig, GameState, RandomSource } from './types';

export interface UseAtlasGameResult {
  state: GameState;
  currentQuestion: GameState['currentQuestion'];
  submitCountryAnswer: (pickedIso2: string) => void;
  submitCapitalAnswer: (guess: Coordinates) => void;
  next: () => void;
  restart: () => void;
  summary: ReturnType<typeof summarize>;
}

function createConfigKey(config: GameConfig) {
  return [
    config.category,
    config.region,
    config.questionCount,
    config.maxAttempts,
    config.language,
  ].join(':');
}

export function useAtlasGame(config: GameConfig, rng?: RandomSource): UseAtlasGameResult {
  const configKey = createConfigKey(config);
  const buildGame = useCallback(
    () => createGame(config, rng),
    [config, rng],
  );
  const [session, setSession] = useState<{ configKey: string; state: GameState }>(() => ({
    configKey,
    state: buildGame(),
  }));
  const state = session.configKey === configKey ? session.state : buildGame();

  const handleSubmitCountryAnswer = useCallback((pickedIso2: string) => {
    setSession((currentSession) => {
      const currentState = currentSession.configKey === configKey ? currentSession.state : buildGame();

      return {
        configKey,
        state: submitCountryAnswer(currentState, pickedIso2),
      };
    });
  }, [buildGame, configKey]);

  const handleSubmitCapitalAnswer = useCallback((guess: Coordinates) => {
    setSession((currentSession) => {
      const currentState = currentSession.configKey === configKey ? currentSession.state : buildGame();

      return {
        configKey,
        state: submitCapitalAnswer(currentState, guess),
      };
    });
  }, [buildGame, configKey]);

  const handleNext = useCallback(() => {
    setSession((currentSession) => {
      const currentState = currentSession.configKey === configKey ? currentSession.state : buildGame();

      return {
        configKey,
        state: nextQuestion(currentState),
      };
    });
  }, [buildGame, configKey]);

  const handleRestart = useCallback(() => {
    setSession({
      configKey,
      state: buildGame(),
    });
  }, [buildGame, configKey]);

  const summary = useMemo(() => summarize(state), [state]);

  return {
    state,
    currentQuestion: state.currentQuestion,
    submitCountryAnswer: handleSubmitCountryAnswer,
    submitCapitalAnswer: handleSubmitCapitalAnswer,
    next: handleNext,
    restart: handleRestart,
    summary,
  };
}
