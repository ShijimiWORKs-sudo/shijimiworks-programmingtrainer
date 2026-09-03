import type { Attempt, LessonProgress } from "../domain/progress";

export interface ProgressRepository {
  getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined>;
  saveLessonProgress(progress: LessonProgress): Promise<void>;
  listRecentLessonProgress(userId: string, limit: number): Promise<LessonProgress[]>;
  recordAttempt(attempt: Attempt): Promise<void>;
}
