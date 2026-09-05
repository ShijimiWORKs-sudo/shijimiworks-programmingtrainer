import { describe, expect, it } from "vitest";
import { findChallengeById, findCourseByLessonId, findLessonById, findMockExamById, findNextLesson, getAllChallenges, getAllMockExams, languages } from "./catalog";

describe("content catalog", () => {
  it("finds Python grade 3 chapter challenges without affecting lesson lookup", () => {
    expect(findLessonById("lesson_py3_01_print")?.title).toBe("Lesson 01: print / 出力");
    expect(getAllChallenges().map((challenge) => challenge.id)).toContain("challenge_py3_basic_review");
    expect(findChallengeById("challenge_py3_basic_review")).toMatchObject({
      title: "Python 3級 章末課題: 基礎総復習",
      status: "published",
    });
  });

  it("finds Python grade 3 mock exams without affecting lesson lookup", () => {
    expect(getAllMockExams().map((exam) => exam.id)).toContain("mock_exam_py3_trial");
    expect(findMockExamById("mock_exam_py3_trial")).toMatchObject({
      title: "Python 3級 模擬試験",
      status: "published",
    });
    expect(findLessonById("mock_exam_py3_trial")).toBeUndefined();
  });

  it("enables Python grade 1 and grade 2 as routeable levels", () => {
    const python = languages.find((language) => language.slug === "python");
    const grade1 = python?.levels.find((level) => level.code === "grade-1");
    const grade2 = python?.levels.find((level) => level.code === "grade-2");

    expect(grade1).toMatchObject({
      status: "available",
      courses: [{ id: "course_python_grade_1" }],
    });
    expect(grade2).toMatchObject({
      status: "available",
      courses: [{ id: "course_python_grade_2" }],
    });
    expect(findLessonById("lesson_py3_01_print")?.title).toBe("Lesson 01: print / 出力");
  });

  it("finds Python grade 2 lessons without crossing next-lesson course boundaries", () => {
    expect(findLessonById("lesson_py2_01_function_return")).toMatchObject({
      title: "Lesson 01: 関数の戻り値",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_py2_01_function_return")?.id).toBe("course_python_grade_2");
    expect(findNextLesson("lesson_py2_01_function_return")).toMatchObject({
      id: "lesson_py2_02_classes",
    });
    expect(findNextLesson("lesson_py2_02_classes")).toMatchObject({
      id: "lesson_py2_03_exceptions",
    });
    expect(findNextLesson("lesson_py2_03_exceptions")).toMatchObject({
      id: "lesson_py2_04_virtual_file_io",
    });
    expect(findNextLesson("lesson_py2_04_virtual_file_io")).toMatchObject({
      id: "lesson_py2_05_algorithm_debug",
    });
    expect(findNextLesson("lesson_py2_05_algorithm_debug")).toMatchObject({
      id: "lesson_py2_06_small_project",
    });
    expect(findNextLesson("lesson_py2_06_small_project")).toBeUndefined();
    expect(findNextLesson("lesson_py3_10_functions")).toBeUndefined();
  });

  it("finds Python grade 1 lessons without crossing next-lesson course boundaries", () => {
    expect(findLessonById("lesson_py1_01_bug_fix")).toMatchObject({
      title: "Lesson 01: bug fix",
      status: "published",
    });
    expect(findLessonById("lesson_py1_02_specification_change")).toMatchObject({
      title: "Lesson 02: specification change",
      status: "published",
    });
    expect(findLessonById("lesson_py1_03_test_oriented")).toMatchObject({
      title: "Lesson 03: test-oriented task",
      status: "published",
    });
    expect(findLessonById("lesson_py1_04_refactoring")).toMatchObject({
      title: "Lesson 04: refactoring",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_py1_01_bug_fix")?.id).toBe("course_python_grade_1");
    expect(findCourseByLessonId("lesson_py1_02_specification_change")?.id).toBe("course_python_grade_1");
    expect(findCourseByLessonId("lesson_py1_03_test_oriented")?.id).toBe("course_python_grade_1");
    expect(findCourseByLessonId("lesson_py1_04_refactoring")?.id).toBe("course_python_grade_1");
    expect(findNextLesson("lesson_py1_01_bug_fix")).toMatchObject({
      id: "lesson_py1_02_specification_change",
    });
    expect(findNextLesson("lesson_py1_02_specification_change")).toMatchObject({
      id: "lesson_py1_03_test_oriented",
    });
    expect(findNextLesson("lesson_py1_03_test_oriented")).toMatchObject({
      id: "lesson_py1_04_refactoring",
    });
    expect(findNextLesson("lesson_py1_04_refactoring")).toBeUndefined();
  });

  it("enables JavaScript grade 1, grade 2, and grade 3 and keeps next-lesson routing within each JavaScript course", () => {
    const javascript = languages.find((language) => language.slug === "javascript");

    expect(javascript).toMatchObject({
      status: "available",
      levels: [
        { code: "grade-3", status: "available", courses: [{ id: "course_javascript_grade_3_foundation" }] },
        { code: "grade-2", status: "available", courses: [{ id: "course_javascript_grade_2" }] },
        { code: "grade-1", status: "available", courses: [{ id: "course_javascript_grade_1" }] },
      ],
    });
    expect(findLessonById("lesson_js3_01_console_log")).toMatchObject({
      title: "Lesson 01: console.log / 出力",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_js3_01_console_log")?.id).toBe("course_javascript_grade_3_foundation");
    expect(findNextLesson("lesson_js3_01_console_log")).toMatchObject({
      id: "lesson_js3_02_variables",
    });
    expect(findNextLesson("lesson_js3_10_functions")).toBeUndefined();
    expect(findCourseByLessonId("lesson_js2_01_function_return")?.id).toBe("course_javascript_grade_2");
    expect(findNextLesson("lesson_js2_01_function_return")).toMatchObject({
      id: "lesson_js2_02_classes",
    });
    expect(findNextLesson("lesson_js2_06_small_project")).toBeUndefined();
    expect(findCourseByLessonId("lesson_js1_01_bug_fix")?.id).toBe("course_javascript_grade_1");
    expect(findNextLesson("lesson_js1_01_bug_fix")).toMatchObject({
      id: "lesson_js1_02_specification_change",
    });
    expect(findNextLesson("lesson_js1_02_specification_change")).toMatchObject({
      id: "lesson_js1_03_test_oriented",
    });
    expect(findNextLesson("lesson_js1_03_test_oriented")).toMatchObject({
      id: "lesson_js1_04_refactoring",
    });
    expect(findNextLesson("lesson_js1_04_refactoring")).toBeUndefined();
  });

  it("enables Java grade 1, grade 2, and grade 3 and keeps next-lesson routing within each Java course", () => {
    const java = languages.find((language) => language.slug === "java");

    expect(java).toMatchObject({
      status: "available",
      levels: [
        { code: "grade-3", status: "available", courses: [{ id: "course_java_grade_3_foundation" }] },
        { code: "grade-2", status: "available", courses: [{ id: "course_java_grade_2" }] },
        { code: "grade-1", status: "available", courses: [{ id: "course_java_grade_1" }] },
      ],
    });
    expect(findLessonById("lesson_java3_01_println")).toMatchObject({
      title: "Lesson 01: println / 出力",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_java3_01_println")?.id).toBe("course_java_grade_3_foundation");
    expect(findNextLesson("lesson_java3_01_println")).toMatchObject({
      id: "lesson_java3_02_variables",
    });
    expect(findNextLesson("lesson_java3_10_methods")).toBeUndefined();
    expect(findCourseByLessonId("lesson_java2_01_method_return")?.id).toBe("course_java_grade_2");
    expect(findNextLesson("lesson_java2_01_method_return")).toMatchObject({
      id: "lesson_java2_02_method_composition",
    });
    expect(findNextLesson("lesson_java2_06_small_project")).toBeUndefined();
    expect(findCourseByLessonId("lesson_java1_01_bug_fix")?.id).toBe("course_java_grade_1");
    expect(findNextLesson("lesson_java1_01_bug_fix")).toMatchObject({
      id: "lesson_java1_02_specification_change",
    });
    expect(findNextLesson("lesson_java1_04_refactoring")).toBeUndefined();
  });

  it("enables C++ grade 1, grade 2, and grade 3 and keeps next-lesson routing within each C++ course", () => {
    const cpp = languages.find((language) => language.slug === "cpp");

    expect(cpp).toMatchObject({
      status: "available",
      levels: [
        { code: "grade-3", status: "available", courses: [{ id: "course_cpp_grade_3_foundation" }] },
        { code: "grade-2", status: "available", courses: [{ id: "course_cpp_grade_2" }] },
        { code: "grade-1", status: "available", courses: [{ id: "course_cpp_grade_1" }] },
      ],
    });
    expect(findLessonById("lesson_cpp3_01_cout")).toMatchObject({
      title: "Lesson 01: cout / 出力",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_cpp3_01_cout")?.id).toBe("course_cpp_grade_3_foundation");
    expect(findNextLesson("lesson_cpp3_01_cout")).toMatchObject({
      id: "lesson_cpp3_02_variables",
    });
    expect(findNextLesson("lesson_cpp3_10_functions")).toBeUndefined();
    expect(findCourseByLessonId("lesson_cpp2_01_function_return")?.id).toBe("course_cpp_grade_2");
    expect(findNextLesson("lesson_cpp2_01_function_return")).toMatchObject({
      id: "lesson_cpp2_02_function_composition",
    });
    expect(findNextLesson("lesson_cpp2_06_small_project")).toBeUndefined();
    expect(findCourseByLessonId("lesson_cpp1_01_bug_fix")?.id).toBe("course_cpp_grade_1");
    expect(findNextLesson("lesson_cpp1_01_bug_fix")).toMatchObject({
      id: "lesson_cpp1_02_specification_change",
    });
    expect(findNextLesson("lesson_cpp1_04_refactoring")).toBeUndefined();
  });

  it("enables Ruby grade 1, grade 2, and grade 3 and keeps next-lesson routing within each Ruby course", () => {
    const ruby = languages.find((language) => language.slug === "ruby");

    expect(ruby).toMatchObject({
      status: "available",
      levels: [
        { code: "grade-3", status: "available", courses: [{ id: "course_ruby_grade_3_foundation" }] },
        { code: "grade-2", status: "available", courses: [{ id: "course_ruby_grade_2" }] },
        { code: "grade-1", status: "available", courses: [{ id: "course_ruby_grade_1" }] },
      ],
    });
    expect(findLessonById("lesson_ruby3_01_puts")).toMatchObject({
      title: "Lesson 01: puts / 出力",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_ruby3_01_puts")?.id).toBe("course_ruby_grade_3_foundation");
    expect(findNextLesson("lesson_ruby3_01_puts")).toMatchObject({
      id: "lesson_ruby3_02_variables",
    });
    expect(findNextLesson("lesson_ruby3_10_methods")).toBeUndefined();
    expect(findCourseByLessonId("lesson_ruby2_01_method_return")?.id).toBe("course_ruby_grade_2");
    expect(findNextLesson("lesson_ruby2_01_method_return")).toMatchObject({
      id: "lesson_ruby2_02_method_composition",
    });
    expect(findNextLesson("lesson_ruby2_06_small_project")).toBeUndefined();
    expect(findCourseByLessonId("lesson_ruby1_01_bug_fix")?.id).toBe("course_ruby_grade_1");
    expect(findNextLesson("lesson_ruby1_01_bug_fix")).toMatchObject({
      id: "lesson_ruby1_02_specification_change",
    });
    expect(findNextLesson("lesson_ruby1_04_refactoring")).toBeUndefined();
  });

  it("enables HTML/CSS grade 1, grade 2, and grade 3 and keeps next-lesson routing within each HTML/CSS course", () => {
    const htmlCss = languages.find((language) => language.slug === "html-css");

    expect(htmlCss).toMatchObject({
      status: "available",
      levels: [
        { code: "grade-3", status: "available", courses: [{ id: "course_html_css_grade_3_foundation" }] },
        { code: "grade-2", status: "available", courses: [{ id: "course_html_css_grade_2" }] },
        { code: "grade-1", status: "available", courses: [{ id: "course_html_css_grade_1" }] },
      ],
    });
    expect(findLessonById("lesson_htmlcss3_01_split_preview")).toMatchObject({
      title: "Lesson 01: split editor preview",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_htmlcss3_01_split_preview")?.id).toBe("course_html_css_grade_3_foundation");
    expect(findNextLesson("lesson_htmlcss3_01_split_preview")).toMatchObject({
      id: "lesson_htmlcss3_02_heading_paragraph",
    });
    expect(findNextLesson("lesson_htmlcss3_10_semantic_landing")).toBeUndefined();
    expect(findCourseByLessonId("lesson_htmlcss2_01_responsive_cards")?.id).toBe("course_html_css_grade_2");
    expect(findNextLesson("lesson_htmlcss2_01_responsive_cards")).toMatchObject({
      id: "lesson_htmlcss2_02_accessible_form",
    });
    expect(findNextLesson("lesson_htmlcss2_06_small_page")).toBeUndefined();
    expect(findCourseByLessonId("lesson_htmlcss1_01_bug_fix")?.id).toBe("course_html_css_grade_1");
    expect(findNextLesson("lesson_htmlcss1_01_bug_fix")).toMatchObject({
      id: "lesson_htmlcss1_02_specification_change",
    });
    expect(findNextLesson("lesson_htmlcss1_04_refactoring")).toBeUndefined();
  });
});
