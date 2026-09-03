export type LessonProgressStatus = "not_started" | "in_progress" | "passed";

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: LessonProgressStatus;
  lastCode: string;
  runCount: number;
  gradeCount: number;
  hintCount: number;
  firstStartedAt?: string;
  firstPassedAt?: string;
  lastStudiedAt?: string;
  updatedAt: string;
}

export interface Attempt {
  id: string;
  userId: string;
  lessonId: string;
  exerciseId: string;
  sourceCode: string;
  stdin: string;
  executionStatus: string;
  stdout: string;
  stderr: string;
  passed: boolean;
  durationMs: number;
  createdAt: string;
}

export interface AppSettings {
  userId: string;
  editorTheme: "light" | "dark";
  editorFontSize: number;
  tabSize: number;
  updatedAt: string;
}
