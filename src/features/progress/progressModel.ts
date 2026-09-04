import type { LessonProgress, LessonProgressStatus } from "../../domain/progress";

export function createInitialProgress(userId: string, lessonId: string, starterCode: string): LessonProgress {
  const now = new Date().toISOString();
  return {
    id: userId + ":" + lessonId,
    userId,
    lessonId,
    status: "not_started",
    lastCode: starterCode,
    runCount: 0,
    gradeCount: 0,
    hintCount: 0,
    updatedAt: now,
  };
}

export function touchProgress(
  progress: LessonProgress,
  changes: Partial<LessonProgress> & { status?: LessonProgressStatus }
): LessonProgress {
  const now = new Date().toISOString();
  return {
    ...progress,
    ...changes,
    firstStartedAt: progress.firstStartedAt ?? now,
    lastStudiedAt: now,
    updatedAt: now,
  };
}

export function markPassed(progress: LessonProgress): LessonProgress {
  const now = new Date().toISOString();
  return {
    ...touchProgress(progress, { status: "passed" }),
    firstPassedAt: progress.firstPassedAt ?? now,
  };
}
