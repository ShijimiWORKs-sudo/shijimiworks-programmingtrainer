import type { Attempt, LessonProgress } from "../domain/progress";

export interface ProgressRepository {
  getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined>;
  saveLessonProgress(progress: LessonProgress): Promise<void>;
  listLessonProgress(userId: string): Promise<LessonProgress[]>;
  listRecentLessonProgress(userId: string, limit: number): Promise<LessonProgress[]>;
  getLastLessonProgress(userId: string): Promise<LessonProgress | undefined>;
  recordAttempt(attempt: Attempt): Promise<void>;
  listAttempts(userId: string, lessonId?: string): Promise<Attempt[]>;
}
