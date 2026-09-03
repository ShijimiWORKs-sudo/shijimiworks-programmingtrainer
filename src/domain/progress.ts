import type { RunErrorType, RunStatus } from "../features/runner";

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

export interface AttemptTestResult {
  id: string;
  attemptId: string;
  testCaseId: string;
  passed: boolean;
  actualStdout: string;
  errorType?: RunErrorType;
  durationMs: number;
}

export interface Attempt {
  id: string;
  userId: string;
  lessonId: string;
  exerciseId: string;
  sourceCode: string;
  stdin: string;
  executionStatus: RunStatus;
  stdout: string;
  stderr: string;
  passed: boolean;
  durationMs: number;
  createdAt: string;
  testResults?: AttemptTestResult[];
}

export interface AppSettings {
  userId: string;
  editorTheme: "light" | "dark";
  editorFontSize: number;
  tabSize: number;
  updatedAt: string;
}
