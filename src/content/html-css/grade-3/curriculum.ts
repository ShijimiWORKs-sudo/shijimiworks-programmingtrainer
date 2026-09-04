import type { Course } from "../../../domain/curriculum";

const htmlStarterCode = "<main class=\"profile-card\">\n  <h1>Programming Trainer</h1>\n  <p>HTMLとCSSで、見出しと説明のある小さなカードを作ります。</p>\n</main>\n";
const cssStarterCode = ".profile-card {\n  padding: 24px;\n  border: 2px solid #176b87;\n}\n\n.profile-card h1 {\n  color: #176b87;\n}\n";

const courseId = "course_html_css_grade_3_foundation";
const chapterId = "chapter_html_css_grade_3_preview";

export const htmlCssGrade3Course: Course = {
  id: courseId,
  languageId: "lang_html_css",
  levelId: "level_html_css_3",
  title: "HTML/CSS 3級",
  description: "HTML構造とCSSスタイルを分けて編集し、previewで見た目を確かめる基礎コースです。",
  curriculumVersion: "0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId,
      title: "HTML/CSS 3級 Preview Foundation",
      description: "split editorでHTMLとCSSを編集し、sandbox previewへ反映するChapterです。",
      order: 1,
      lessons: [
        {
          id: "lesson_htmlcss3_01_split_preview",
          chapterId,
          slug: "split-preview",
          title: "Lesson 01: split editor preview",
          objective: "HTMLとCSSを別々に編集し、previewで変更を確認する。",
          explanationMd: "HTMLはページの構造、CSSは見た目を担当します。2つを分けて編集すると、どの変更が構造で、どの変更が見た目なのかを確認しやすくなります。",
          taskMd: "index.html の見出しと説明、styles.css の色や余白を変え、previewで反映を確認してください。",
          starterCode: htmlStarterCode,
          sampleInput: "",
          sampleOutput: "previewにHTML/CSSの変更が表示されます。",
          constraints: ["index.html には見出しと説明文を残してください。", "styles.css で色、余白、枠線のいずれかを変更してください。", "previewはアプリ本体とは分離されたiframeで表示されます。"],
          difficulty: 1,
          estimatedMinutes: 12,
          order: 1,
          status: "published",
          hints: ["h1 の文字を変えると、previewの見出しも変わります。", "color や background を変えると見た目の変化を確認できます。", "HTMLは構造、CSSは見た目、と役割を分けて考えましょう。"],
          exercises: [
            {
              id: "ex_htmlcss3_01_01",
              lessonId: "lesson_htmlcss3_01_split_preview",
              type: "code",
              promptMd: "index.html と styles.css を編集し、previewへ即時反映されることを確認します。",
              starterCode: htmlStarterCode,
              project: {
                entryFilePath: "index.html",
                files: [
                  { path: "index.html", language: "html", content: htmlStarterCode, editable: true, purpose: "entry" },
                  { path: "styles.css", language: "css", content: cssStarterCode, editable: true, purpose: "support" },
                ],
              },
              gradingMode: "stdout",
              timeoutMs: 3000,
              completionCriteria: "split editorのHTML/CSS変更がpreviewへ反映される。",
              testCases: [],
            },
          ],
        },
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
