import { describe, expect, it } from "vitest";
import { pythonGrade3Course } from "./curriculum";

describe("python grade 3 curriculum seed", () => {
  it("keeps the Language > Level > Course > Chapter > Lesson > Exercise > TestCase shape", () => {
    const chapter = pythonGrade3Course.chapters[0];
    const lesson = chapter.lessons[0];
    const exercise = lesson.exercises[0];
    const testCase = exercise.testCases[0];

    expect(pythonGrade3Course.languageId).toBe("lang_python");
    expect(pythonGrade3Course.levelId).toBe("level_python_3");
    expect(chapter.courseId).toBe(pythonGrade3Course.id);
    expect(lesson.chapterId).toBe(chapter.id);
    expect(exercise.lessonId).toBe(lesson.id);
    expect(testCase.visibility).toBe("public");
  });
});
