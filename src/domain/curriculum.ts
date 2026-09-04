export type LanguageStatus = "available" | "planned";
export type LevelStatus = "available" | "planned";
export type LessonPublicationStatus = "draft" | "published";
export type ExerciseType = "code";
export type GradingMode = "stdout";
export type TestCaseVisibility = "public" | "hidden";
export type OutputComparator = "exact_text" | "trimmed_text" | "normalized_lines";
export type ChallengePublicationStatus = "draft" | "published";
export type ChallengeKind = "chapter_challenge";

export interface TestCase {
  id: string;
  order: number;
  visibility: TestCaseVisibility;
  stdin: string;
  expectedStdout: string;
  comparator: OutputComparator;
  weight: number;
  required: boolean;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  promptMd: string;
  starterCode: string;
  gradingMode: GradingMode;
  timeoutMs: number;
  completionCriteria: string;
  testCases: TestCase[];
}

export interface ChallengeExercise extends Omit<Exercise, "lessonId"> {
  challengeId: string;
  sourceLessonIds: string[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  slug: string;
  title: string;
  objective: string;
  explanationMd: string;
  taskMd: string;
  starterCode: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string[];
  difficulty: number;
  estimatedMinutes: number;
  order: number;
  status: LessonPublicationStatus;
  hints: string[];
  exercises: Exercise[];
}

export interface ChapterChallenge {
  id: string;
  courseId: string;
  chapterId: string;
  kind: ChallengeKind;
  slug: string;
  title: string;
  objective: string;
  descriptionMd: string;
  instructionsMd: string;
  order: number;
  status: ChallengePublicationStatus;
  estimatedMinutes: number;
  sourceLessonIds: string[];
  passingRequiredCount: number;
  exercises: ChallengeExercise[];
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  challenges: ChapterChallenge[];
}

export interface Course {
  id: string;
  languageId: string;
  levelId: string;
  title: string;
  description: string;
  curriculumVersion: string;
  validFrom: string;
  validTo?: string;
  chapters: Chapter[];
}

export interface Level {
  id: string;
  languageId: string;
  code: string;
  name: string;
  order: number;
  status: LevelStatus;
  courses: Course[];
}

export interface Language {
  id: string;
  slug: string;
  name: string;
  order: number;
  status: LanguageStatus;
  levels: Level[];
}
