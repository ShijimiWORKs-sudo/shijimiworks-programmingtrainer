export const routePaths = {
  home: "/",
  languages: "/languages",
  python: "/languages/python",
  pythonGrade3: "/languages/python/grade-3",
  pythonGrade3Lesson: (lessonId: string) => "/languages/python/grade-3/lessons/" + lessonId,
  pythonGrade3Challenge: (challengeId: string) => "/languages/python/grade-3/challenges/" + challengeId,
  history: "/history",
  settings: "/settings",
} as const;
