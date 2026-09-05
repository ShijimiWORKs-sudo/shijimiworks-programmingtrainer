import type { Exercise, Lesson, ProjectExercise, TestCase } from "../../domain/curriculum";

interface RubyTestSeed {
  id: string;
  stdin: string;
  expectedStdout: string;
  visibility: TestCase["visibility"];
  order: number;
}

interface RubyExerciseSeed {
  id: string;
  promptMd: string;
  starterCode: string;
  completionCriteria: string;
  testCases: RubyTestSeed[];
  project?: ProjectExercise;
}

interface RubyLessonSeed {
  id: string;
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
  hints: string[];
  exercises: RubyExerciseSeed[];
}

function testCase(seed: RubyTestSeed): TestCase {
  return {
    id: seed.id,
    order: seed.order,
    visibility: seed.visibility,
    stdin: seed.stdin,
    expectedStdout: seed.expectedStdout,
    comparator: "trimmed_text",
    weight: 1,
    required: true,
  };
}

function exercise(lessonId: string, seed: RubyExerciseSeed): Exercise {
  return {
    id: seed.id,
    lessonId,
    type: "code",
    promptMd: seed.promptMd,
    starterCode: seed.starterCode,
    project: seed.project,
    gradingMode: "stdout",
    timeoutMs: 3000,
    completionCriteria: seed.completionCriteria,
    testCases: seed.testCases.map(testCase),
  };
}

export function rubyLesson(chapterId: string, seed: RubyLessonSeed): Lesson {
  return {
    id: seed.id,
    chapterId,
    slug: seed.slug,
    title: seed.title,
    objective: seed.objective,
    explanationMd: seed.explanationMd,
    taskMd: seed.taskMd,
    starterCode: seed.starterCode,
    sampleInput: seed.sampleInput,
    sampleOutput: seed.sampleOutput,
    constraints: seed.constraints,
    difficulty: seed.difficulty,
    estimatedMinutes: seed.estimatedMinutes,
    order: seed.order,
    status: "published",
    hints: seed.hints,
    exercises: seed.exercises.map((item) => exercise(seed.id, item)),
  };
}
