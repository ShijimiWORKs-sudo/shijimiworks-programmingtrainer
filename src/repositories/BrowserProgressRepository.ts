import type { Attempt, ChallengeProgress, ExerciseProgress, LessonProgress } from "../domain/progress";
import type { ProgressRepository } from "./ProgressRepository";
import { getProgrammingTrainerDb } from "./db";

function mergeExerciseProgress(existing: ExerciseProgress | undefined, next: ExerciseProgress | undefined): ExerciseProgress | undefined {
  if (!existing) {
    return next;
  }
  if (!next) {
    return existing;
  }

  const nextIsNewer = next.updatedAt >= existing.updatedAt;
  const status: ExerciseProgress["status"] = existing.status === "passed" || next.status === "passed" ? "passed" : next.status;

  return {
    ...existing,
    ...next,
    lastCode: nextIsNewer ? next.lastCode : existing.lastCode,
    status,
    runCount: Math.max(existing.runCount, next.runCount),
    gradeCount: Math.max(existing.gradeCount, next.gradeCount),
    firstStartedAt: existing.firstStartedAt ?? next.firstStartedAt,
    firstPassedAt: existing.firstPassedAt ?? next.firstPassedAt,
    lastStudiedAt: nextIsNewer ? (next.lastStudiedAt ?? existing.lastStudiedAt) : existing.lastStudiedAt,
    updatedAt: nextIsNewer ? next.updatedAt : existing.updatedAt,
  };
}

function mergeExerciseProgressRecords(
  existing: Record<string, ExerciseProgress> | undefined,
  next: Record<string, ExerciseProgress> | undefined
) {
  const exerciseIds = new Set([...Object.keys(existing ?? {}), ...Object.keys(next ?? {})]);
  if (exerciseIds.size === 0) {
    return undefined;
  }

  return [...exerciseIds].reduce<Record<string, ExerciseProgress>>((merged, exerciseId) => {
    const exerciseProgress = mergeExerciseProgress(existing?.[exerciseId], next?.[exerciseId]);
    if (exerciseProgress) {
      merged[exerciseId] = exerciseProgress;
    }
    return merged;
  }, {});
}

function mergeProgress(existing: LessonProgress | undefined, next: LessonProgress): LessonProgress {
  if (!existing) {
    return next;
  }

  const nextIsNewer = next.updatedAt >= existing.updatedAt;

  return {
    ...existing,
    ...next,
    lastCode: nextIsNewer ? next.lastCode : existing.lastCode,
    activeExerciseId: nextIsNewer ? (next.activeExerciseId ?? existing.activeExerciseId) : existing.activeExerciseId,
    exerciseProgress: mergeExerciseProgressRecords(existing.exerciseProgress, next.exerciseProgress),
    status: existing.status === "passed" || next.status === "passed" ? "passed" : next.status,
    runCount: Math.max(existing.runCount, next.runCount),
    gradeCount: Math.max(existing.gradeCount, next.gradeCount),
    hintCount: Math.max(existing.hintCount, next.hintCount),
    firstStartedAt: existing.firstStartedAt ?? next.firstStartedAt,
    firstPassedAt: existing.firstPassedAt ?? next.firstPassedAt,
    lastStudiedAt: nextIsNewer ? (next.lastStudiedAt ?? existing.lastStudiedAt) : existing.lastStudiedAt,
    updatedAt: nextIsNewer ? next.updatedAt : existing.updatedAt,
  };
}

function mergeChallengeProgress(existing: ChallengeProgress | undefined, next: ChallengeProgress): ChallengeProgress {
  if (!existing) {
    return next;
  }

  const nextIsNewer = next.updatedAt >= existing.updatedAt;

  return {
    ...existing,
    ...next,
    activeExerciseId: nextIsNewer ? (next.activeExerciseId ?? existing.activeExerciseId) : existing.activeExerciseId,
    exerciseProgress: mergeExerciseProgressRecords(existing.exerciseProgress, next.exerciseProgress),
    status: existing.status === "passed" || next.status === "passed" ? "passed" : next.status,
    runCount: Math.max(existing.runCount, next.runCount),
    gradeCount: Math.max(existing.gradeCount, next.gradeCount),
    passedRequiredCount: Math.max(existing.passedRequiredCount, next.passedRequiredCount),
    totalRequiredCount: Math.max(existing.totalRequiredCount, next.totalRequiredCount),
    firstStartedAt: existing.firstStartedAt ?? next.firstStartedAt,
    firstPassedAt: existing.firstPassedAt ?? next.firstPassedAt,
    lastStudiedAt: nextIsNewer ? (next.lastStudiedAt ?? existing.lastStudiedAt) : existing.lastStudiedAt,
    updatedAt: nextIsNewer ? next.updatedAt : existing.updatedAt,
  };
}

export class BrowserProgressRepository implements ProgressRepository {
  private readonly progressSaveQueues = new Map<string, Promise<void>>();
  private readonly challengeProgressSaveQueues = new Map<string, Promise<void>>();

  async getLessonProgress(userId: string, lessonId: string) {
    const db = await getProgrammingTrainerDb();
    return db.getFromIndex("lessonProgress", "by-user-lesson", [userId, lessonId]);
  }

  async saveLessonProgress(progress: LessonProgress) {
    const key = `${progress.userId}:${progress.lessonId}`;
    const previousSave = this.progressSaveQueues.get(key) ?? Promise.resolve();
    const nextSave = previousSave.catch(() => undefined).then(async () => {
      const db = await getProgrammingTrainerDb();
      const existing = await db.getFromIndex("lessonProgress", "by-user-lesson", [progress.userId, progress.lessonId]);
      await db.put("lessonProgress", mergeProgress(existing, progress));
    });

    this.progressSaveQueues.set(key, nextSave);
    try {
      await nextSave;
    } finally {
      if (this.progressSaveQueues.get(key) === nextSave) {
        this.progressSaveQueues.delete(key);
      }
    }
  }

  async listLessonProgress(userId: string) {
    const db = await getProgrammingTrainerDb();
    const progress = await db.getAllFromIndex("lessonProgress", "by-user", userId);
    return progress.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getChallengeProgress(userId: string, challengeId: string) {
    const db = await getProgrammingTrainerDb();
    return db.getFromIndex("challengeProgress", "by-user-challenge", [userId, challengeId]);
  }

  async saveChallengeProgress(progress: ChallengeProgress) {
    const key = `${progress.userId}:${progress.challengeId}`;
    const previousSave = this.challengeProgressSaveQueues.get(key) ?? Promise.resolve();
    const nextSave = previousSave.catch(() => undefined).then(async () => {
      const db = await getProgrammingTrainerDb();
      const existing = await db.getFromIndex("challengeProgress", "by-user-challenge", [progress.userId, progress.challengeId]);
      await db.put("challengeProgress", mergeChallengeProgress(existing, progress));
    });

    this.challengeProgressSaveQueues.set(key, nextSave);
    try {
      await nextSave;
    } finally {
      if (this.challengeProgressSaveQueues.get(key) === nextSave) {
        this.challengeProgressSaveQueues.delete(key);
      }
    }
  }

  async listChallengeProgress(userId: string) {
    const db = await getProgrammingTrainerDb();
    const progress = await db.getAllFromIndex("challengeProgress", "by-user", userId);
    return progress.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async listRecentLessonProgress(userId: string, limit: number) {
    return (await this.listLessonProgress(userId)).slice(0, limit);
  }

  async getLastLessonProgress(userId: string) {
    const [last] = await this.listRecentLessonProgress(userId, 1);
    return last;
  }

  async recordAttempt(attempt: Attempt) {
    const db = await getProgrammingTrainerDb();
    await db.put("attempts", attempt);
  }

  async listAttempts(userId: string, lessonId?: string) {
    const db = await getProgrammingTrainerDb();
    const attempts = lessonId
      ? await db.getAllFromIndex("attempts", "by-user-lesson", [userId, lessonId])
      : await db.getAllFromIndex("attempts", "by-user", userId);

    return attempts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
