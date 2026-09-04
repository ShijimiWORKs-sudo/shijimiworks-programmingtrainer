import type { Lesson } from "../../domain/curriculum";
import type { MockExamResult } from "../../domain/progress";

export interface MockExamReviewSuggestion {
  lessonId: string;
  title: string;
  order: number;
  failedProblemCount: number;
  failedRequiredCount: number;
}

export function buildMockExamReviewSuggestions(
  result: MockExamResult,
  lessons: Lesson[]
): MockExamReviewSuggestion[] {
  const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const suggestionByLessonId = new Map<string, MockExamReviewSuggestion>();

  for (const problemResult of result.problemResults) {
    if (problemResult.passed) {
      continue;
    }

    const failedRequiredCount = problemResult.totalRequiredCount - problemResult.passedRequiredCount;
    for (const lessonId of problemResult.sourceLessonIds) {
      const lesson = lessonsById.get(lessonId);
      if (!lesson) {
        continue;
      }

      const existing = suggestionByLessonId.get(lessonId);
      suggestionByLessonId.set(lessonId, {
        lessonId,
        title: lesson.title,
        order: lesson.order,
        failedProblemCount: (existing?.failedProblemCount ?? 0) + 1,
        failedRequiredCount: (existing?.failedRequiredCount ?? 0) + failedRequiredCount,
      });
    }
  }

  return [...suggestionByLessonId.values()].sort((a, b) => {
    if (b.failedRequiredCount !== a.failedRequiredCount) {
      return b.failedRequiredCount - a.failedRequiredCount;
    }
    return a.order - b.order;
  });
}
