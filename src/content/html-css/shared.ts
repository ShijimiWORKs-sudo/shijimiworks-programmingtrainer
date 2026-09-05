import type { Course, HtmlDomRequirement, HtmlStyleRequirement, Lesson } from "../../domain/curriculum";

export interface HtmlCssLessonSeed {
  id: string;
  slug: string;
  title: string;
  objective: string;
  task: string;
  html: string;
  css: string;
  domRequirements: HtmlDomRequirement[];
  styleRequirements: HtmlStyleRequirement[];
  order: number;
  difficulty: number;
  estimatedMinutes: number;
  hints: string[];
}

export interface HtmlCssCourseSeed {
  id: string;
  levelId: string;
  title: string;
  description: string;
  chapterId: string;
  chapterTitle: string;
  chapterDescription: string;
  lessons: HtmlCssLessonSeed[];
}

export function createHtmlCssLesson(chapterId: string, seed: HtmlCssLessonSeed): Lesson {
  const exerciseId = seed.id.replace("lesson_", "ex_") + "_01";

  return {
    id: seed.id,
    chapterId,
    slug: seed.slug,
    title: seed.title,
    objective: seed.objective,
    explanationMd: "HTMLで意味のある構造を作り、CSSで見た目を調整します。Previewで表示を確認しながら、採点ではDOM条件とCSS条件の両方を確認します。",
    taskMd: seed.task,
    starterCode: seed.html,
    sampleInput: "",
    sampleOutput: "previewにHTML/CSSの変更が表示されます。",
    constraints: [
      "index.html には指定されたHTML構造を残してください。",
      "styles.css には指定されたselectorとpropertyを書いてください。",
      "hidden条件の詳細は採点結果に表示されません。",
      "previewはアプリ本体とは分離されたiframeで表示されます。",
    ],
    difficulty: seed.difficulty,
    estimatedMinutes: seed.estimatedMinutes,
    order: seed.order,
    status: "published",
    hints: seed.hints,
    exercises: [
      {
        id: exerciseId,
        lessonId: seed.id,
        type: "code",
        promptMd: seed.task,
        starterCode: seed.html,
        project: {
          entryFilePath: "index.html",
          files: [
            { path: "index.html", language: "html", content: seed.html, editable: true, purpose: "entry" },
            { path: "styles.css", language: "css", content: seed.css, editable: true, purpose: "support" },
          ],
        },
        gradingMode: "html_dom",
        timeoutMs: 3000,
        completionCriteria: "DOM条件とCSS条件をすべて満たす。",
        testCases: [],
        domRequirements: seed.domRequirements,
        styleRequirements: seed.styleRequirements,
      },
    ],
  };
}

export function createHtmlCssCourse(seed: HtmlCssCourseSeed): Course {
  return {
    id: seed.id,
    languageId: "lang_html_css",
    levelId: seed.levelId,
    title: seed.title,
    description: seed.description,
    curriculumVersion: "0.1.0",
    validFrom: "2026-09-05",
    chapters: [
      {
        id: seed.chapterId,
        courseId: seed.id,
        title: seed.chapterTitle,
        description: seed.chapterDescription,
        order: 1,
        lessons: seed.lessons.map((lesson) => createHtmlCssLesson(seed.chapterId, lesson)),
        challenges: [],
      },
    ],
    mockExams: [],
  };
}
