import type { Course } from "../../../domain/curriculum";

const htmlStarterCode = "<main class=\"profile-card\">\n  <h1>Programming Trainer</h1>\n  <p>HTMLとCSSで、見出しと説明のある小さなカードを作ります。</p>\n</main>\n";
const cssStarterCode = ".profile-card {\n  padding: 24px;\n  border: 2px solid #176b87;\n}\n\n.profile-card h1 {\n  color: #176b87;\n}\n\n@media (max-width: 700px) {\n  .profile-card {\n    padding: 16px;\n  }\n}\n";

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
          constraints: ["index.html には見出しと説明文を残してください。", "styles.css で余白と見出し色を指定してください。", "responsive用のmedia queryでは狭い画面向けに余白を小さくしてください。", "previewはアプリ本体とは分離されたiframeで表示されます。"],
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
              gradingMode: "html_dom",
              timeoutMs: 3000,
              completionCriteria: "main.profile-card の中に見出しと説明文があるHTML構造を作る。",
              testCases: [],
              domRequirements: [
                {
                  id: "profile-card-main",
                  order: 1,
                  visibility: "public",
                  kind: "selector_exists",
                  selector: "main.profile-card",
                  description: "mainタグに profile-card class が付いている。",
                  required: true,
                },
                {
                  id: "profile-card-heading",
                  order: 2,
                  visibility: "public",
                  kind: "text_includes",
                  selector: "main.profile-card h1",
                  expectedText: "Programming Trainer",
                  description: "profile-card内のh1に Programming Trainer が含まれている。",
                  required: true,
                },
                {
                  id: "profile-card-description",
                  order: 3,
                  visibility: "hidden",
                  kind: "selector_exists",
                  selector: "main.profile-card p",
                  description: "profile-card内に説明文のpタグがある。",
                  required: true,
                },
              ],
              styleRequirements: [
                {
                  id: "profile-card-padding",
                  order: 4,
                  visibility: "public",
                  kind: "declaration_equals",
                  selector: ".profile-card",
                  property: "padding",
                  expectedValue: "24px",
                  description: "profile-card の通常時の padding が 24px である。",
                  required: true,
                },
                {
                  id: "profile-card-responsive-padding",
                  order: 5,
                  visibility: "hidden",
                  kind: "media_declaration_equals",
                  mediaQuery: "(max-width: 700px)",
                  selector: ".profile-card",
                  property: "padding",
                  expectedValue: "16px",
                  description: "狭い画面向けの profile-card padding が調整されている。",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
