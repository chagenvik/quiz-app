import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAtlasGame } from './useAtlasGame';
import type { GameConfig } from './types';

describe('useAtlasGame', () => {
  it('wraps the pure engine helpers and can restart or reset on config changes', () => {
    const initialConfig: GameConfig = {
      category: 'countries',
      region: 'world',
      questionCount: 10,
      maxAttempts: 2,
      language: 'en',
    };
    const { result, rerender } = renderHook(
      ({ config }: { config: GameConfig }) => useAtlasGame(config, () => 0),
      {
        initialProps: {
          config: initialConfig,
        },
      },
    );
    const firstIso2 = result.current.currentQuestion?.iso2;

    expect(firstIso2).toBeTruthy();

    act(() => {
      result.current.submitCountryAnswer(firstIso2 ?? 'ZZ');
    });

    expect(result.current.state.lastAnswer?.points).toBe(100);

    act(() => {
      result.current.next();
    });

    expect(result.current.state.currentQuestionIndex).toBe(1);
    expect(result.current.summary.points).toBe(100);

    act(() => {
      result.current.restart();
    });

    expect(result.current.state.currentQuestionIndex).toBe(0);
    expect(result.current.state.lastAnswer).toBeNull();

    rerender({
      config: {
        ...initialConfig,
        category: 'capitals',
        maxAttempts: 1,
      },
    });

    expect(result.current.state.config.category).toBe('capitals');
    expect(result.current.currentQuestion?.category).toBe('capitals');
  });
});
