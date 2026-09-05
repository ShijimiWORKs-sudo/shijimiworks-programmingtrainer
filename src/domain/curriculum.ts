export type LanguageStatus = "available" | "planned";
export type LevelStatus = "available" | "planned";
export type LessonPublicationStatus = "draft" | "published";
export type ExerciseType = "code";
export type GradingMode = "stdout" | "html_dom" | "command_virtual_fs";
export type TestCaseVisibility = "public" | "hidden";
export type OutputComparator = "exact_text" | "trimmed_text" | "normalized_lines";
export type ChallengePublicationStatus = "draft" | "published";
export type ChallengeKind = "chapter_challenge";
export type MockExamPublicationStatus = "draft" | "published";
export type ProjectExerciseFilePurpose = "entry" | "support" | "test";
export type HtmlDomRequirementKind = "selector_exists" | "text_includes" | "attribute_equals";
export type HtmlStyleRequirementKind = "declaration_equals" | "media_declaration_equals";
export type CommandFileRequirementKind = "file_exists" | "file_not_exists" | "directory_exists" | "file_content_equals";

export interface ProjectExerciseFile {
  path: string;
  language: string;
  content: string;
  editable: boolean;
  purpose: ProjectExerciseFilePurpose;
}

export interface ProjectExercise {
  entryFilePath: string;
  files: ProjectExerciseFile[];
}

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

export interface HtmlDomRequirement {
  id: string;
  order: number;
  visibility: TestCaseVisibility;
  kind: HtmlDomRequirementKind;
  selector: string;
  description: string;
  expectedText?: string;
  attributeName?: string;
  expectedValue?: string;
  minCount?: number;
  required: boolean;
}

export interface HtmlStyleRequirement {
  id: string;
  order: number;
  visibility: TestCaseVisibility;
  kind: HtmlStyleRequirementKind;
  selector: string;
  property: string;
  expectedValue: string;
  description: string;
  mediaQuery?: string;
  required: boolean;
}

export interface CommandVirtualFile {
  path: string;
  type: "file" | "directory";
  content?: string;
}

export interface CommandVirtualEnvironment {
  cwd?: string;
  entries: CommandVirtualFile[];
}

export interface CommandFileRequirement {
  id: string;
  order: number;
  visibility: TestCaseVisibility;
  kind: CommandFileRequirementKind;
  path: string;
  description: string;
  expectedContent?: string;
  required: boolean;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  promptMd: string;
  starterCode: string;
  project?: ProjectExercise;
  gradingMode: GradingMode;
  timeoutMs: number;
  completionCriteria: string;
  testCases: TestCase[];
  domRequirements?: HtmlDomRequirement[];
  styleRequirements?: HtmlStyleRequirement[];
  commandEnvironment?: CommandVirtualEnvironment;
  commandFileRequirements?: CommandFileRequirement[];
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

export interface MockExamProblem extends Omit<ChallengeExercise, "challengeId"> {
  examId: string;
  order: number;
}

export interface MockExam {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  descriptionMd: string;
  status: MockExamPublicationStatus;
  timeLimitMinutes: number;
  passingScorePercent: number;
  problems: MockExamProblem[];
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
  mockExams: MockExam[];
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
