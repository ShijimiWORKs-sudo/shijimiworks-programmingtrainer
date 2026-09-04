import { describe, expect, it } from "vitest";
import { pythonGrade3Course } from "../../content/python/grade-3";
import type { LessonProgress, LessonProgressStatus } from "../../domain/progress";
import { createInitialProgress, markPassed, touchExerciseProgress, touchProgress } from "./progressModel";
import { summarizeChapterProgress } from "./chapterProgress";

const chapter = pythonGrade3Course.chapters[0];

function progressFor(lessonId: string, status: LessonProgressStatus): LessonProgress {
  const initial = createInitialProgress("user", lessonId, "");
  return status === "passed" ? markPassed(initial) : touchProgress(initial, { status });
}

function progressMap(completedCount: number, inProgressIds: string[] = []) {
  const entries = chapter.lessons.slice(0, completedCount).map((lesson) => [lesson.id, progressFor(lesson.id, "passed")] as const);
  const inProgressEntries = inProgressIds.map((lessonId) => [lessonId, progressFor(lessonId, "in_progress")] as const);
  return Object.fromEntries([...entries, ...inProgressEntries]);
}

describe("chapter progress summary", () => {
  it("reports 0/10 when no lessons have progress", () => {
    expect(summarizeChapterProgress(chapter.lessons, {})).toMatchObject({
      totalLessons: 10,
      completedLessons: 0,
      inProgressLessons: 0,
      notStartedLessons: 10,
      completionPercent: 0,
      status: "not_started",
    });
  });

  it("reports 1/10 after one passed lesson", () => {
    expect(summarizeChapterProgress(chapter.lessons, progressMap(1))).toMatchObject({
      completedLessons: 1,
      notStartedLessons: 9,
      completionPercent: 10,
      status: "in_progress",
    });
  });

  it("reports 5/10 at the halfway point", () => {
    expect(summarizeChapterProgress(chapter.lessons, progressMap(5))).toMatchObject({
      completedLessons: 5,
      notStartedLessons: 5,
      completionPercent: 50,
      status: "in_progress",
    });
  });

  it("reports 10/10 and completed when every lesson passed", () => {
    expect(summarizeChapterProgress(chapter.lessons, progressMap(10))).toMatchObject({
      completedLessons: 10,
      notStartedLessons: 0,
      completionPercent: 100,
      status: "completed",
    });
  });

  it("distinguishes passed, in-progress, and not-started lessons", () => {
    expect(summarizeChapterProgress(chapter.lessons, progressMap(1, ["lesson_py3_02_variables"]))).toMatchObject({
      completedLessons: 1,
      inProgressLessons: 1,
      notStartedLessons: 8,
      completionPercent: 10,
      status: "in_progress",
    });
  });

  it("counts Lesson 10 once even when it has multiple exercises", () => {
    const lesson = chapter.lessons.find((candidate) => candidate.id === "lesson_py3_10_functions");
    const initial = createInitialProgress("user", "lesson_py3_10_functions", "");
    const withTwoExercises = touchExerciseProgress(
      touchExerciseProgress(initial, "ex_py3_10_01", "", { status: "passed" }),
      "ex_py3_10_02",
      "",
      { status: "passed" }
    );
    const summary = summarizeChapterProgress(chapter.lessons, {
      lesson_py3_10_functions: markPassed(withTwoExercises),
    });

    expect(lesson?.exercises).toHaveLength(2);
    expect(summary).toMatchObject({
      totalLessons: 10,
      completedLessons: 1,
      completionPercent: 10,
    });
  });

  it("keeps passed lessons complete after later editing progress", () => {
    const passed = markPassed(createInitialProgress("user", "lesson_py3_01_print", ""));
    const editedAgain = touchProgress(passed, {
      lastCode: "print('still reviewing')",
      status: passed.status === "passed" ? "passed" : "in_progress",
    });
    const summary = summarizeChapterProgress(chapter.lessons, {
      lesson_py3_01_print: editedAgain,
    });

    expect(editedAgain.status).toBe("passed");
    expect(summary.completedLessons).toBe(1);
  });
});
