import type { ExerciseProgress, LessonProgress, LessonProgressStatus } from "../../domain/progress";

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

export function createInitialExerciseProgress(exerciseId: string, starterCode: string): ExerciseProgress {
  return {
    exerciseId,
    status: "not_started",
    lastCode: starterCode,
    runCount: 0,
    gradeCount: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function getExerciseProgress(progress: LessonProgress, exerciseId: string, starterCode: string): ExerciseProgress {
  return progress.exerciseProgress?.[exerciseId] ?? createInitialExerciseProgress(exerciseId, starterCode);
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

export function touchExerciseProgress(
  progress: LessonProgress,
  exerciseId: string,
  starterCode: string,
  changes: Partial<ExerciseProgress> & { status?: LessonProgressStatus },
  lessonChanges: Partial<LessonProgress> & { status?: LessonProgressStatus } = {}
): LessonProgress {
  const now = new Date().toISOString();
  const current = getExerciseProgress(progress, exerciseId, starterCode);
  const nextStatus = current.status === "passed" || changes.status === "passed" ? "passed" : (changes.status ?? current.status);
  const nextExerciseProgress: ExerciseProgress = {
    ...current,
    ...changes,
    exerciseId,
    status: nextStatus,
    firstStartedAt: current.firstStartedAt ?? now,
    firstPassedAt: nextStatus === "passed" ? (current.firstPassedAt ?? now) : current.firstPassedAt,
    lastStudiedAt: now,
    updatedAt: now,
  };

  return touchProgress(progress, {
    ...lessonChanges,
    activeExerciseId: exerciseId,
    lastCode: nextExerciseProgress.lastCode,
    exerciseProgress: {
      ...progress.exerciseProgress,
      [exerciseId]: nextExerciseProgress,
    },
  });
}

export function allExercisesPassed(progress: LessonProgress, exerciseIds: string[]): boolean {
  return exerciseIds.length > 0 && exerciseIds.every((exerciseId) => progress.exerciseProgress?.[exerciseId]?.status === "passed");
}

export function markPassed(progress: LessonProgress): LessonProgress {
  const now = new Date().toISOString();
  return {
    ...touchProgress(progress, { status: "passed" }),
    firstPassedAt: progress.firstPassedAt ?? now,
  };
}
