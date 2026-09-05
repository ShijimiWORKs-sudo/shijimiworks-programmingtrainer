import type { CommandFileRequirement, CommandVirtualEnvironment, CommandVirtualFile, Course, Exercise, Lesson } from "../../domain/curriculum";

export const commandRootEntries: CommandVirtualFile[] = [
  { path: "C:\\", type: "directory" },
  { path: "C:\\Users", type: "directory" },
  { path: "C:\\Users\\student", type: "directory" },
];

export function commandEnvironment(entries: CommandVirtualFile[] = []): CommandVirtualEnvironment {
  return {
    cwd: "C:\\Users\\student",
    entries: [...commandRootEntries, ...entries],
  };
}

interface CommandLessonSeed {
  id: string;
  slug: string;
  title: string;
  objective: string;
  taskMd: string;
  starterCode: string;
  sampleOutput: string;
  constraints: string[];
  difficulty: number;
  estimatedMinutes: number;
  order: number;
  hints: string[];
  environment?: CommandVirtualEnvironment;
  requirements: CommandFileRequirement[];
}

export function commandFileLesson(chapterId: string, seed: CommandLessonSeed): Lesson {
  const exercise: Exercise = {
    id: `ex_${seed.id.replace("lesson_", "")}_01`,
    lessonId: seed.id,
    type: "code",
    promptMd: seed.taskMd,
    starterCode: seed.starterCode,
    gradingMode: "command_virtual_fs",
    timeoutMs: 1000,
    completionCriteria: "仮想filesystemの状態が条件を満たす。",
    testCases: [],
    commandEnvironment: seed.environment ?? commandEnvironment(),
    commandFileRequirements: seed.requirements,
  };

  return {
    id: seed.id,
    chapterId,
    slug: seed.slug,
    title: seed.title,
    objective: seed.objective,
    explanationMd: "Windows Commandの操作を、Programming Trainerの仮想terminalだけで安全に練習します。",
    taskMd: seed.taskMd,
    starterCode: seed.starterCode,
    sampleInput: "",
    sampleOutput: seed.sampleOutput,
    constraints: seed.constraints,
    difficulty: seed.difficulty,
    estimatedMinutes: seed.estimatedMinutes,
    order: seed.order,
    status: "published",
    hints: seed.hints,
    exercises: [exercise],
  };
}

export function commandCourse(seed: {
  id: string;
  levelId: string;
  title: string;
  description: string;
  chapterId: string;
  chapterTitle: string;
  chapterDescription: string;
  lessons: Lesson[];
}): Course {
  return {
    id: seed.id,
    languageId: "lang_command",
    levelId: seed.levelId,
    title: seed.title,
    description: seed.description,
    curriculumVersion: "1.0.0",
    validFrom: "2026-09-05",
    chapters: [
      {
        id: seed.chapterId,
        courseId: seed.id,
        title: seed.chapterTitle,
        description: seed.chapterDescription,
        order: 1,
        lessons: seed.lessons,
        challenges: [],
      },
    ],
    mockExams: [],
  };
}
