import type { Lesson } from "../../domain/curriculum";
import type { LessonProgress } from "../../domain/progress";

export type ChapterProgressStatus = "not_started" | "in_progress" | "completed";

export interface ChapterProgressSummary {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  notStartedLessons: number;
  completionPercent: number;
  status: ChapterProgressStatus;
}

export function summarizeChapterProgress(
  lessons: Lesson[],
  progressByLessonId: Record<string, LessonProgress | undefined>
): ChapterProgressSummary {
  const publishedLessons = lessons.filter((lesson) => lesson.status === "published");
  const completedLessons = publishedLessons.filter((lesson) => progressByLessonId[lesson.id]?.status === "passed").length;
  const inProgressLessons = publishedLessons.filter((lesson) => progressByLessonId[lesson.id]?.status === "in_progress").length;
  const totalLessons = publishedLessons.length;
  const notStartedLessons = totalLessons - completedLessons - inProgressLessons;
  const completionPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  const status: ChapterProgressStatus = completedLessons === totalLessons && totalLessons > 0
    ? "completed"
    : inProgressLessons > 0 || completedLessons > 0
      ? "in_progress"
      : "not_started";

  return {
    totalLessons,
    completedLessons,
    inProgressLessons,
    notStartedLessons,
    completionPercent,
    status,
  };
}
