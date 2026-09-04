import { createBrowserRouter, createMemoryRouter, type RouteObject } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { HtmlCssGrade3CurriculumPage } from "../routes/HtmlCssGrade3CurriculumPage";
import { HtmlCssLevelSelectPage } from "../routes/HtmlCssLevelSelectPage";
import { HtmlCssWorkspacePage } from "../routes/HtmlCssWorkspacePage";
import { HomePage } from "../routes/HomePage";
import { JavaScriptGrade1CurriculumPage } from "../routes/JavaScriptGrade1CurriculumPage";
import { JavaScriptGrade2CurriculumPage } from "../routes/JavaScriptGrade2CurriculumPage";
import { JavaScriptGrade3CurriculumPage } from "../routes/JavaScriptGrade3CurriculumPage";
import { JavaScriptLevelSelectPage } from "../routes/JavaScriptLevelSelectPage";
import { LanguageSelectPage } from "../routes/LanguageSelectPage";
import { LearningHistoryPage } from "../routes/LearningHistoryPage";
import { ChallengeWorkspacePage } from "../routes/ChallengeWorkspacePage";
import { LessonWorkspacePage } from "../routes/LessonWorkspacePage";
import { MockExamResultPage } from "../routes/MockExamResultPage";
import { MockExamShellPage } from "../routes/MockExamShellPage";
import { NotFoundPage } from "../routes/NotFoundPage";
import { PythonGrade1CurriculumPage } from "../routes/PythonGrade1CurriculumPage";
import { PythonGrade3CurriculumPage } from "../routes/PythonGrade3CurriculumPage";
import { PythonGrade2CurriculumPage } from "../routes/PythonGrade2CurriculumPage";
import { PythonLevelSelectPage } from "../routes/PythonLevelSelectPage";
import { SettingsPage } from "../routes/SettingsPage";
import { routePaths } from "./routePaths";

export const appRoutes: RouteObject[] = [
  {
    path: routePaths.home,
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "languages", element: <LanguageSelectPage /> },
      { path: "languages/html-css", element: <HtmlCssLevelSelectPage /> },
      { path: "languages/html-css/grade-3", element: <HtmlCssGrade3CurriculumPage /> },
      { path: "languages/html-css/grade-3/lessons/:lessonId", element: <HtmlCssWorkspacePage /> },
      { path: "languages/javascript", element: <JavaScriptLevelSelectPage /> },
      { path: "languages/javascript/grade-1", element: <JavaScriptGrade1CurriculumPage /> },
      { path: "languages/javascript/grade-1/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/javascript/grade-2", element: <JavaScriptGrade2CurriculumPage /> },
      { path: "languages/javascript/grade-2/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/javascript/grade-3", element: <JavaScriptGrade3CurriculumPage /> },
      { path: "languages/javascript/grade-3/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/python", element: <PythonLevelSelectPage /> },
      { path: "languages/python/grade-1", element: <PythonGrade1CurriculumPage /> },
      { path: "languages/python/grade-1/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/python/grade-2", element: <PythonGrade2CurriculumPage /> },
      { path: "languages/python/grade-2/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/python/grade-3", element: <PythonGrade3CurriculumPage /> },
      { path: "languages/python/grade-3/challenges/:challengeId", element: <ChallengeWorkspacePage /> },
      { path: "languages/python/grade-3/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/python/grade-3/mock-exams/:examId", element: <MockExamShellPage /> },
      { path: "languages/python/grade-3/mock-exams/:examId/result", element: <MockExamResultPage /> },
      { path: "history", element: <LearningHistoryPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(appRoutes);
}

export function createTestRouter(initialEntries: string[]) {
  return createMemoryRouter(appRoutes, { initialEntries });
}
