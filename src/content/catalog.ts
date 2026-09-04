import type { Language } from "../domain/curriculum";
import { pythonGrade1Course } from "./python/grade-1";
import { pythonGrade2Course } from "./python/grade-2";
import { pythonGrade3Course } from "./python/grade-3";

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
  { id: "lang_java", slug: "java", name: "Java", order: 2, status: "planned", levels: [] },
  { id: "lang_cpp", slug: "cpp", name: "C++", order: 3, status: "planned", levels: [] },
  { id: "lang_ruby", slug: "ruby", name: "Ruby", order: 4, status: "planned", levels: [] },
  { id: "lang_javascript", slug: "javascript", name: "JavaScript", order: 5, status: "planned", levels: [] },
  { id: "lang_html_css", slug: "html-css", name: "HTML/CSS", order: 6, status: "planned", levels: [] },
  { id: "lang_command", slug: "command", name: "Command", order: 7, status: "planned", levels: [] },
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
