import type { RunErrorType, RunStatus } from "../features/runner";

export type LessonProgressStatus = "not_started" | "in_progress" | "passed";

export interface ExerciseProgress {
  exerciseId: string;
  status: LessonProgressStatus;
  lastCode: string;
  runCount: number;
  gradeCount: number;
  firstStartedAt?: string;
  firstPassedAt?: string;
  lastStudiedAt?: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: LessonProgressStatus;
  lastCode: string;
  activeExerciseId?: string;
  exerciseProgress?: Record<string, ExerciseProgress>;
  runCount: number;
  gradeCount: number;
  hintCount: number;
  firstStartedAt?: string;
  firstPassedAt?: string;
  lastStudiedAt?: string;
  updatedAt: string;
}

export type ChallengeProgressStatus = "not_started" | "in_progress" | "passed";

export interface ChallengeProgress {
  id: string;
  userId: string;
  challengeId: string;
  status: ChallengeProgressStatus;
  activeExerciseId?: string;
  exerciseProgress?: Record<string, ExerciseProgress>;
  runCount: number;
  gradeCount: number;
  passedRequiredCount: number;
  totalRequiredCount: number;
  firstStartedAt?: string;
  firstPassedAt?: string;
  lastStudiedAt?: string;
  updatedAt: string;
}

export type MockExamSessionStatus = "not_started" | "in_progress" | "paused" | "submitted";

export interface MockExamAnswer {
  problemId: string;
  sourceCode: string;
  updatedAt: string;
}

export interface MockExamPublicTestResult {
  testCaseId: string;
  order: number;
  passed: boolean;
  required: boolean;
  stdin?: string;
  expectedStdout?: string;
  actualStdout: string;
  stderr: string;
  status: RunStatus;
  errorType: RunErrorType | undefined;
  durationMs: number;
}

export interface MockExamProblemResult {
  problemId: string;
  order: number;
  sourceLessonIds: string[];
  passed: boolean;
  passedRequiredCount: number;
  totalRequiredCount: number;
  hiddenPassedRequiredCount: number;
  hiddenRequiredCount: number;
  publicResults: MockExamPublicTestResult[];
}

export interface MockExamResult {
  scorePercent: number;
  passed: boolean;
  passingScorePercent: number;
  passedProblems: number;
  totalProblems: number;
  passedRequiredCount: number;
  totalRequiredCount: number;
  submittedAt: string;
  problemResults: MockExamProblemResult[];
}

export interface MockExamSession {
  id: string;
  userId: string;
  examId: string;
  status: MockExamSessionStatus;
  activeProblemId: string;
  startedAt?: string;
  pausedAt?: string;
  submittedAt?: string;
  remainingSeconds: number;
  answers: Record<string, MockExamAnswer>;
  result?: MockExamResult;
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
