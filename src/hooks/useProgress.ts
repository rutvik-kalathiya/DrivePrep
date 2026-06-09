import { useState, useEffect, useCallback } from 'react';
import { THEMES } from '../data';
import type { Theme, ProgressData } from '../types';

const STORAGE_KEY = 'driveprep-progress';

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progressData, setProgressData] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    saveProgress(progressData);
  }, [progressData]);

  const getChapterProgress = useCallback(
    (chapterId: string, defaultTotal: number) => {
      const saved = progressData[chapterId];
      return {
        totalQuestions: saved?.totalQuestions ?? defaultTotal,
        completedQuestions: saved?.completedQuestions ?? 0,
      };
    },
    [progressData]
  );

  const updateChapter = useCallback(
    (chapterId: string, totalQuestions: number, completedQuestions: number) => {
      setProgressData((prev) => ({
        ...prev,
        [chapterId]: {
          totalQuestions: Math.max(0, totalQuestions),
          completedQuestions: Math.max(0, Math.min(completedQuestions, totalQuestions)),
        },
      }));
    },
    []
  );

  const markComplete = useCallback((chapterId: string, totalQuestions: number) => {
    setProgressData((prev) => ({
      ...prev,
      [chapterId]: {
        totalQuestions,
        completedQuestions: totalQuestions,
      },
    }));
  }, []);

  const resetChapter = useCallback((chapterId: string, defaultTotal: number) => {
    setProgressData((prev) => ({
      ...prev,
      [chapterId]: {
        totalQuestions: defaultTotal,
        completedQuestions: 0,
      },
    }));
  }, []);

  const getThemesWithProgress = useCallback((): Theme[] => {
    return THEMES.map((theme) => ({
      ...theme,
      chapters: theme.chapters.map((ch) => {
        const p = getChapterProgress(ch.id, ch.totalQuestions);
        return { ...ch, ...p };
      }),
    }));
  }, [getChapterProgress]);

  return { progressData, getChapterProgress, updateChapter, markComplete, resetChapter, getThemesWithProgress };
}
