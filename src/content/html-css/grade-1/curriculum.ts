import { createHtmlCssCourse, type HtmlCssLessonSeed } from "../shared";

const chapterId = "chapter_html_css_grade_1_maintenance";

const lessons: HtmlCssLessonSeed[] = [
  {
    id: "lesson_htmlcss1_01_bug_fix",
    slug: "bug-fix",
    title: "Lesson 01: bug fix",
    objective: "既存HTML/CSSの壊れた構造とselectorを修正する。",
    task: "broken-cardを、見出し・本文・状態表示を持つreview-cardへ修正してください。",
    html: "<article class=\"review-card\">\n  <h2>Bug Fix</h2>\n  <p>既存コードの意図を読み、構造を直します。</p>\n  <span class=\"status-label\">Ready</span>\n</article>\n",
    css: ".review-card {\n  padding: 22px;\n}\n\n.review-card .status-label {\n  color: #176b87;\n  font-weight: 700;\n}\n",
    domRequirements: [
      { id: "bug-review-card", order: 1, visibility: "public", kind: "selector_exists", selector: "article.review-card", description: "review-card articleがある。", required: true },
      { id: "bug-heading", order: 2, visibility: "public", kind: "text_includes", selector: ".review-card h2", expectedText: "Bug Fix", description: "見出しが修正されている。", required: true },
      { id: "bug-status", order: 3, visibility: "hidden", kind: "selector_exists", selector: ".review-card .status-label", description: "状態表示がある。", required: true },
    ],
    styleRequirements: [
      { id: "bug-card-padding", order: 4, visibility: "public", kind: "declaration_equals", selector: ".review-card", property: "padding", expectedValue: "22px", description: "カード余白が修正されている。", required: true },
      { id: "bug-status-weight", order: 5, visibility: "hidden", kind: "declaration_equals", selector: ".review-card .status-label", property: "font-weight", expectedValue: "700", description: "状態表示が強調されている。", required: true },
    ],
    order: 1,
    difficulty: 3,
    estimatedMinutes: 20,
    hints: ["既存のclass名を採点条件に合わせます。", "articleの中にh2、p、spanを置きます。", "CSS selectorも修正後のclass名に合わせます。"],
  },
  {
    id: "lesson_htmlcss1_02_specification_change",
    slug: "specification-change",
    title: "Lesson 02: specification change",
    objective: "新しい仕様に合わせてUI部品を拡張する。",
    task: "pricing-cardにおすすめ表示を追加し、featured状態の見た目をCSSで指定してください。",
    html: "<article class=\"pricing-card is-featured\">\n  <p class=\"badge\">おすすめ</p>\n  <h2>Standard</h2>\n  <p>学習を続けるための基本プランです。</p>\n</article>\n",
    css: ".pricing-card {\n  padding: 24px;\n}\n\n.pricing-card.is-featured {\n  border: 2px solid #176b87;\n}\n\n.badge {\n  font-weight: 700;\n}\n",
    domRequirements: [
      { id: "spec-featured-card", order: 1, visibility: "public", kind: "selector_exists", selector: ".pricing-card.is-featured", description: "featured状態のカードがある。", required: true },
      { id: "spec-badge", order: 2, visibility: "public", kind: "text_includes", selector: ".pricing-card .badge", expectedText: "おすすめ", description: "おすすめ表示がある。", required: true },
      { id: "spec-title", order: 3, visibility: "hidden", kind: "text_includes", selector: ".pricing-card h2", expectedText: "Standard", description: "プラン名がある。", required: true },
    ],
    styleRequirements: [
      { id: "spec-padding", order: 4, visibility: "public", kind: "declaration_equals", selector: ".pricing-card", property: "padding", expectedValue: "24px", description: "カードの余白がある。", required: true },
      { id: "spec-badge-weight", order: 5, visibility: "hidden", kind: "declaration_equals", selector: ".badge", property: "font-weight", expectedValue: "700", description: "badgeが強調されている。", required: true },
    ],
    order: 2,
    difficulty: 3,
    estimatedMinutes: 22,
    hints: ["仕様追加では既存構造を残しながら要素を足します。", "modifier classは is-featured のように状態を表せます。", "badgeは別classにすると再利用しやすくなります。"],
  },
  {
    id: "lesson_htmlcss1_03_test_oriented",
    slug: "test-oriented",
    title: "Lesson 03: test-oriented task",
    objective: "採点条件から必要なDOM構造とCSSを読み取る。",
    task: "公開条件を読み、summary-panelに数値・説明・操作リンクを揃えてください。",
    html: "<section class=\"summary-panel\">\n  <strong class=\"summary-number\">70%</strong>\n  <p>現在の進捗です。</p>\n  <a class=\"summary-action\" href=\"#continue\">続ける</a>\n</section>\n",
    css: ".summary-panel {\n  display: grid;\n  gap: 12px;\n}\n\n.summary-action {\n  display: inline-block;\n}\n",
    domRequirements: [
      { id: "test-summary-panel", order: 1, visibility: "public", kind: "selector_exists", selector: "section.summary-panel", description: "summary-panelがある。", required: true },
      { id: "test-summary-number", order: 2, visibility: "public", kind: "text_includes", selector: ".summary-number", expectedText: "70%", description: "進捗数値がある。", required: true },
      { id: "test-summary-action", order: 3, visibility: "hidden", kind: "attribute_equals", selector: ".summary-action", attributeName: "href", expectedValue: "#continue", description: "継続リンクがある。", required: true },
    ],
    styleRequirements: [
      { id: "test-summary-grid", order: 4, visibility: "public", kind: "declaration_equals", selector: ".summary-panel", property: "display", expectedValue: "grid", description: "panelをgridにする。", required: true },
      { id: "test-summary-gap", order: 5, visibility: "hidden", kind: "declaration_equals", selector: ".summary-panel", property: "gap", expectedValue: "12px", description: "panel要素間にgapがある。", required: true },
    ],
    order: 3,
    difficulty: 3,
    estimatedMinutes: 22,
    hints: ["公開条件から必要なselectorを確認します。", "数値はstrongで強調できます。", "hidden条件の詳細は表示されないので、仕様文も丁寧に読みます。"],
  },
  {
    id: "lesson_htmlcss1_04_refactoring",
    slug: "refactoring",
    title: "Lesson 04: refactoring",
    objective: "重複したスタイルを共通classへ整理する。",
    task: "alert部品の共通スタイルを.alertへまとめ、successとwarningの差分だけをmodifierへ置いてください。",
    html: "<section class=\"alert-list\">\n  <p class=\"alert alert-success\">保存しました</p>\n  <p class=\"alert alert-warning\">入力を確認してください</p>\n</section>\n",
    css: ".alert {\n  padding: 14px;\n  border-radius: 6px;\n}\n\n.alert-success {\n  color: #176b87;\n}\n\n.alert-warning {\n  color: #92400e;\n}\n",
    domRequirements: [
      { id: "refactor-success", order: 1, visibility: "public", kind: "selector_exists", selector: ".alert.alert-success", description: "success alertがある。", required: true },
      { id: "refactor-warning", order: 2, visibility: "public", kind: "selector_exists", selector: ".alert.alert-warning", description: "warning alertがある。", required: true },
      { id: "refactor-list", order: 3, visibility: "hidden", kind: "selector_exists", selector: ".alert-list .alert:nth-child(2)", description: "alertが一覧内に2つある。", required: true },
    ],
    styleRequirements: [
      { id: "refactor-common-padding", order: 4, visibility: "public", kind: "declaration_equals", selector: ".alert", property: "padding", expectedValue: "14px", description: "共通余白がalertにある。", required: true },
      { id: "refactor-common-radius", order: 5, visibility: "hidden", kind: "declaration_equals", selector: ".alert", property: "border-radius", expectedValue: "6px", description: "共通角丸がalertにある。", required: true },
    ],
    order: 4,
    difficulty: 3,
    estimatedMinutes: 22,
    hints: ["共通部分は.alertへ集めます。", "状態ごとの差分は.alert-successや.alert-warningへ残します。", "HTML側は共通classと状態classの両方を持たせます。"],
  },
];

export const htmlCssGrade1Course = createHtmlCssCourse({
  id: "course_html_css_grade_1",
  levelId: "level_html_css_1",
  title: "HTML/CSS 1級",
  description: "既存のHTML/CSSを読み、修正・仕様変更・整理を行う実務寄りのコースです。",
  chapterId,
  chapterTitle: "HTML/CSS 1級 Maintenance Tasks",
  chapterDescription: "bug fix、仕様変更、条件読解、refactoringを小さな画面部品で練習します。",
  lessons,
});
