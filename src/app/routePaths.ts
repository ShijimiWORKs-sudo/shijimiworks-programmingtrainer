export const routePaths = {
  home: "/",
  languages: "/languages",
  python: "/languages/python",
  pythonGrade3: "/languages/python/grade-3",
  pythonGrade3Lesson: (lessonId: string) => "/languages/python/grade-3/lessons/" + lessonId,
  pythonGrade3Challenge: (challengeId: string) => "/languages/python/grade-3/challenges/" + challengeId,
  pythonGrade3MockExam: (examId: string) => "/languages/python/grade-3/mock-exams/" + examId,
  pythonGrade3MockExamResult: (examId: string) => "/languages/python/grade-3/mock-exams/" + examId + "/result",
  history: "/history",
  settings: "/settings",
} as const;
