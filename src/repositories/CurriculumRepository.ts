import type { Course, Language, Lesson } from "../domain/curriculum";

export interface CurriculumRepository {
  listLanguages(): Promise<Language[]>;
  findLanguageBySlug(slug: string): Promise<Language | undefined>;
  findCourse(courseId: string): Promise<Course | undefined>;
  findLesson(lessonId: string): Promise<Lesson | undefined>;
}
