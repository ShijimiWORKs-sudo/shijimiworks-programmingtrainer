import { describe, expect, it } from "vitest";
import { pythonGrade2Course } from "./curriculum";

describe("python grade 2 curriculum seed", () => {
  it("adds a routeable course skeleton without publishing lessons early", () => {
    expect(pythonGrade2Course).toMatchObject({
      id: "course_python_grade_2",
      languageId: "lang_python",
      levelId: "level_python_2",
      title: "Python 2級",
      curriculumVersion: "0.1.0",
    });
    expect(pythonGrade2Course.chapters).toHaveLength(1);
    expect(pythonGrade2Course.chapters[0]).toMatchObject({
      id: "chapter_python_grade_2_foundation",
      order: 1,
      lessons: [],
      challenges: [],
    });
    expect(pythonGrade2Course.mockExams).toEqual([]);
  });
});
