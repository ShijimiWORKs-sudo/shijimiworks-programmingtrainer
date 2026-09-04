import type { ChapterChallenge, Course, Language, Lesson, MockExam } from "../domain/curriculum";

export interface CurriculumRepository {
  listLanguages(): Promise<Language[]>;
  findLanguageBySlug(slug: string): Promise<Language | undefined>;
  findCourse(courseId: string): Promise<Course | undefined>;
  findLesson(lessonId: string): Promise<Lesson | undefined>;
  findChallenge(challengeId: string): Promise<ChapterChallenge | undefined>;
  findMockExam(examId: string): Promise<MockExam | undefined>;
}
