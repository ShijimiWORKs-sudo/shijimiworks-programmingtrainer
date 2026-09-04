import { createBrowserRouter, createMemoryRouter, type RouteObject } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { HomePage } from "../routes/HomePage";
import { LanguageSelectPage } from "../routes/LanguageSelectPage";
import { LearningHistoryPage } from "../routes/LearningHistoryPage";
import { ChallengeWorkspacePage } from "../routes/ChallengeWorkspacePage";
import { LessonWorkspacePage } from "../routes/LessonWorkspacePage";
import { NotFoundPage } from "../routes/NotFoundPage";
import { PythonGrade3CurriculumPage } from "../routes/PythonGrade3CurriculumPage";
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
      { path: "languages/python", element: <PythonLevelSelectPage /> },
      { path: "languages/python/grade-3", element: <PythonGrade3CurriculumPage /> },
      { path: "languages/python/grade-3/challenges/:challengeId", element: <ChallengeWorkspacePage /> },
      { path: "languages/python/grade-3/lessons/:lessonId", element: <LessonWorkspacePage /> },
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
