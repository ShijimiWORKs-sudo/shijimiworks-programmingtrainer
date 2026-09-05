import { createBrowserRouter, createMemoryRouter, type RouteObject } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { CppGrade1CurriculumPage } from "../routes/CppGrade1CurriculumPage";
import { CppGrade2CurriculumPage } from "../routes/CppGrade2CurriculumPage";
import { CppGrade3CurriculumPage } from "../routes/CppGrade3CurriculumPage";
import { CppLevelSelectPage } from "../routes/CppLevelSelectPage";
import { HtmlCssGrade1CurriculumPage } from "../routes/HtmlCssGrade1CurriculumPage";
import { HtmlCssGrade2CurriculumPage } from "../routes/HtmlCssGrade2CurriculumPage";
import { HtmlCssGrade3CurriculumPage } from "../routes/HtmlCssGrade3CurriculumPage";
import { HtmlCssLevelSelectPage } from "../routes/HtmlCssLevelSelectPage";
import { HtmlCssWorkspacePage } from "../routes/HtmlCssWorkspacePage";
import { HomePage } from "../routes/HomePage";
import { JavaGrade1CurriculumPage } from "../routes/JavaGrade1CurriculumPage";
import { JavaGrade2CurriculumPage } from "../routes/JavaGrade2CurriculumPage";
import { JavaGrade3CurriculumPage } from "../routes/JavaGrade3CurriculumPage";
import { JavaLevelSelectPage } from "../routes/JavaLevelSelectPage";
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
import { RubyGrade1CurriculumPage } from "../routes/RubyGrade1CurriculumPage";
import { RubyGrade2CurriculumPage } from "../routes/RubyGrade2CurriculumPage";
import { RubyGrade3CurriculumPage } from "../routes/RubyGrade3CurriculumPage";
import { RubyLevelSelectPage } from "../routes/RubyLevelSelectPage";
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
      { path: "languages/cpp", element: <CppLevelSelectPage /> },
      { path: "languages/cpp/grade-1", element: <CppGrade1CurriculumPage /> },
      { path: "languages/cpp/grade-1/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/cpp/grade-2", element: <CppGrade2CurriculumPage /> },
      { path: "languages/cpp/grade-2/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/cpp/grade-3", element: <CppGrade3CurriculumPage /> },
      { path: "languages/cpp/grade-3/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/html-css", element: <HtmlCssLevelSelectPage /> },
      { path: "languages/html-css/grade-1", element: <HtmlCssGrade1CurriculumPage /> },
      { path: "languages/html-css/grade-1/lessons/:lessonId", element: <HtmlCssWorkspacePage /> },
      { path: "languages/html-css/grade-2", element: <HtmlCssGrade2CurriculumPage /> },
      { path: "languages/html-css/grade-2/lessons/:lessonId", element: <HtmlCssWorkspacePage /> },
      { path: "languages/html-css/grade-3", element: <HtmlCssGrade3CurriculumPage /> },
      { path: "languages/html-css/grade-3/lessons/:lessonId", element: <HtmlCssWorkspacePage /> },
      { path: "languages/java", element: <JavaLevelSelectPage /> },
      { path: "languages/java/grade-1", element: <JavaGrade1CurriculumPage /> },
      { path: "languages/java/grade-1/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/java/grade-2", element: <JavaGrade2CurriculumPage /> },
      { path: "languages/java/grade-2/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/java/grade-3", element: <JavaGrade3CurriculumPage /> },
      { path: "languages/java/grade-3/lessons/:lessonId", element: <LessonWorkspacePage /> },
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
      { path: "languages/ruby", element: <RubyLevelSelectPage /> },
      { path: "languages/ruby/grade-1", element: <RubyGrade1CurriculumPage /> },
      { path: "languages/ruby/grade-1/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/ruby/grade-2", element: <RubyGrade2CurriculumPage /> },
      { path: "languages/ruby/grade-2/lessons/:lessonId", element: <LessonWorkspacePage /> },
      { path: "languages/ruby/grade-3", element: <RubyGrade3CurriculumPage /> },
      { path: "languages/ruby/grade-3/lessons/:lessonId", element: <LessonWorkspacePage /> },
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
