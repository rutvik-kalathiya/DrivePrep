export interface Chapter {
  id: string;
  name: string;
  totalQuestions: number;
  completedQuestions: number;
}

export interface Theme {
  id: string;
  title: string;
  chapters: Chapter[];
}

export type ProgressData = Record<string, { completedQuestions: number; totalQuestions: number }>;
