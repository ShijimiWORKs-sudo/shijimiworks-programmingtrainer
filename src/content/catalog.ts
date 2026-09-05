import type { Language } from "../domain/curriculum";
import { commandGrade1Course } from "./command/grade-1";
import { commandGrade2Course } from "./command/grade-2";
import { commandGrade3Course } from "./command/grade-3";
import { cppGrade1Course } from "./cpp/grade-1";
import { cppGrade2Course } from "./cpp/grade-2";
import { cppGrade3Course } from "./cpp/grade-3";
import { htmlCssGrade1Course } from "./html-css/grade-1";
import { htmlCssGrade2Course } from "./html-css/grade-2";
import { htmlCssGrade3Course } from "./html-css/grade-3";
import { javascriptGrade1Course } from "./javascript/grade-1";
import { javascriptGrade2Course } from "./javascript/grade-2";
import { javascriptGrade3Course } from "./javascript/grade-3";
import { javaGrade1Course } from "./java/grade-1";
import { javaGrade2Course } from "./java/grade-2";
import { javaGrade3Course } from "./java/grade-3";
import { pythonGrade1Course } from "./python/grade-1";
import { pythonGrade2Course } from "./python/grade-2";
import { pythonGrade3Course } from "./python/grade-3";
import { rubyGrade1Course } from "./ruby/grade-1";
import { rubyGrade2Course } from "./ruby/grade-2";
import { rubyGrade3Course } from "./ruby/grade-3";

export const languages: Language[] = [
  {
    id: "lang_python",
    slug: "python",
    name: "Python",
    order: 1,
    status: "available",
    levels: [
      {
        id: "level_python_3",
        languageId: "lang_python",
        code: "grade-3",
        name: "3級",
        order: 1,
        status: "available",
        courses: [pythonGrade3Course],
      },
      {
        id: "level_python_2",
        languageId: "lang_python",
        code: "grade-2",
        name: "2級",
        order: 2,
        status: "available",
        courses: [pythonGrade2Course],
      },
      {
        id: "level_python_1",
        languageId: "lang_python",
        code: "grade-1",
        name: "1級",
        order: 3,
        status: "available",
        courses: [pythonGrade1Course],
      },
    ],
  },
  {
    id: "lang_java",
    slug: "java",
    name: "Java",
    order: 2,
    status: "available",
    levels: [
      {
        id: "level_java_3",
        languageId: "lang_java",
        code: "grade-3",
        name: "3級",
        order: 1,
        status: "available",
        courses: [javaGrade3Course],
      },
      {
        id: "level_java_2",
        languageId: "lang_java",
        code: "grade-2",
        name: "2級",
        order: 2,
        status: "available",
        courses: [javaGrade2Course],
      },
      {
        id: "level_java_1",
        languageId: "lang_java",
        code: "grade-1",
        name: "1級",
        order: 3,
        status: "available",
        courses: [javaGrade1Course],
      },
    ],
  },
  {
    id: "lang_cpp",
    slug: "cpp",
    name: "C++",
    order: 3,
    status: "available",
    levels: [
      {
        id: "level_cpp_3",
        languageId: "lang_cpp",
        code: "grade-3",
        name: "3級",
        order: 1,
        status: "available",
        courses: [cppGrade3Course],
      },
      {
        id: "level_cpp_2",
        languageId: "lang_cpp",
        code: "grade-2",
        name: "2級",
        order: 2,
        status: "available",
        courses: [cppGrade2Course],
      },
      {
        id: "level_cpp_1",
        languageId: "lang_cpp",
        code: "grade-1",
        name: "1級",
        order: 3,
        status: "available",
        courses: [cppGrade1Course],
      },
    ],
  },
  {
    id: "lang_ruby",
    slug: "ruby",
    name: "Ruby",
    order: 4,
    status: "available",
    levels: [
      {
        id: "level_ruby_3",
        languageId: "lang_ruby",
        code: "grade-3",
        name: "3級",
        order: 1,
        status: "available",
        courses: [rubyGrade3Course],
      },
      {
        id: "level_ruby_2",
        languageId: "lang_ruby",
        code: "grade-2",
        name: "2級",
        order: 2,
        status: "available",
        courses: [rubyGrade2Course],
      },
      {
        id: "level_ruby_1",
        languageId: "lang_ruby",
        code: "grade-1",
        name: "1級",
        order: 3,
        status: "available",
        courses: [rubyGrade1Course],
      },
    ],
  },
  {
    id: "lang_javascript",
    slug: "javascript",
    name: "JavaScript",
    order: 5,
    status: "available",
    levels: [
      {
        id: "level_javascript_3",
        languageId: "lang_javascript",
        code: "grade-3",
        name: "3級",
        order: 1,
        status: "available",
        courses: [javascriptGrade3Course],
      },
      {
        id: "level_javascript_2",
        languageId: "lang_javascript",
        code: "grade-2",
        name: "2級",
        order: 2,
        status: "available",
        courses: [javascriptGrade2Course],
      },
      {
        id: "level_javascript_1",
        languageId: "lang_javascript",
        code: "grade-1",
        name: "1級",
        order: 3,
        status: "available",
        courses: [javascriptGrade1Course],
      },
    ],
  },
  {
    id: "lang_html_css",
    slug: "html-css",
    name: "HTML/CSS",
    order: 6,
    status: "available",
    levels: [
      {
        id: "level_html_css_3",
        languageId: "lang_html_css",
        code: "grade-3",
        name: "3級",
        order: 1,
        status: "available",
        courses: [htmlCssGrade3Course],
      },
      {
        id: "level_html_css_2",
        languageId: "lang_html_css",
        code: "grade-2",
        name: "2級",
        order: 2,
        status: "available",
        courses: [htmlCssGrade2Course],
      },
      {
        id: "level_html_css_1",
        languageId: "lang_html_css",
        code: "grade-1",
        name: "1級",
        order: 3,
        status: "available",
        courses: [htmlCssGrade1Course],
      },
    ],
  },
  {
    id: "lang_command",
    slug: "command",
    name: "Command",
    order: 7,
    status: "available",
    levels: [
      {
        id: "level_command_3",
        languageId: "lang_command",
        code: "grade-3",
        name: "3級",
        order: 1,
        status: "available",
        courses: [commandGrade3Course],
      },
      {
        id: "level_command_2",
        languageId: "lang_command",
        code: "grade-2",
        name: "2級",
        order: 2,
        status: "available",
        courses: [commandGrade2Course],
      },
      {
        id: "level_command_1",
        languageId: "lang_command",
        code: "grade-1",
        name: "1級",
        order: 3,
        status: "available",
        courses: [commandGrade1Course],
      },
    ],
  },
  { id: "lang_powershell", slug: "powershell", name: "PowerShell", order: 8, status: "planned", levels: [] },
];

export function getAllLessons() {
  return languages
    .flatMap((language) => language.levels)
    .flatMap((level) => level.courses)
    .flatMap((course) => course.chapters)
    .flatMap((chapter) => chapter.lessons);
}

export function getAllChallenges() {
  return languages
    .flatMap((language) => language.levels)
    .flatMap((level) => level.courses)
    .flatMap((course) => course.chapters)
    .flatMap((chapter) => chapter.challenges);
}

export function getAllMockExams() {
  return languages
    .flatMap((language) => language.levels)
    .flatMap((level) => level.courses)
    .flatMap((course) => course.mockExams);
}

export function findLessonById(lessonId: string) {
  return getAllLessons().find((lesson) => lesson.id === lessonId);
}

export function findCourseByLessonId(lessonId: string) {
  return languages
    .flatMap((language) => language.levels)
    .flatMap((level) => level.courses)
    .find((course) => course.chapters.some((chapter) => chapter.lessons.some((lesson) => lesson.id === lessonId)));
}

export function findChallengeById(challengeId: string) {
  return getAllChallenges().find((challenge) => challenge.id === challengeId);
}

export function findMockExamById(examId: string) {
  return getAllMockExams().find((exam) => exam.id === examId);
}

export function findNextLesson(lessonId: string) {
  const course = findCourseByLessonId(lessonId);
  const lessons = course?.chapters.flatMap((chapter) => chapter.lessons).sort((a, b) => a.order - b.order) ?? [];
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return lessons.slice(index + 1).find((lesson) => lesson.status === "published");
}
