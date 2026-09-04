import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { pythonGrade3Course } from "../content/python/grade-3";
import type { LessonProgress } from "../domain/progress";
import { localUserId, progressRepository } from "../repositories";

export function PythonGrade3CurriculumPage() {
  const [progressByLessonId, setProgressByLessonId] = useState<Record<string, LessonProgress>>({});

  useEffect(() => {
    void progressRepository.listLessonProgress(localUserId).then((progressList) => {
      setProgressByLessonId(Object.fromEntries(progressList.map((progress) => [progress.lessonId, progress])));
    });
  }, []);

  return (
    <section className="page-panel">
      <PageHeader title={pythonGrade3Course.title} eyebrow="SCR-030">
        <p>{pythonGrade3Course.description}</p>
      </PageHeader>
      <div className="curriculum-list">
        {pythonGrade3Course.chapters.map((chapter) => (
          <article key={chapter.id} className="chapter-block">
            <div>
              <p className="eyebrow">Chapter {chapter.order}</p>
              <h2>{chapter.title}</h2>
              <p>{chapter.description}</p>
            </div>
            <div className="lesson-list">
              {chapter.lessons.map((lesson) => {
                const progress = progressByLessonId[lesson.id];
                const status = progress?.status ?? (lesson.status === "published" ? "not_started" : "draft");
                const content = (
                  <>
                    <span>{lesson.title}</span>
                    <StatusBadge status={status} />
                  </>
                );

                return lesson.status === "published" ? (
                  <Link
                    key={lesson.id}
                    className="lesson-row"
                    to={routePaths.pythonGrade3Lesson(lesson.id)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={lesson.id} className="lesson-row muted" aria-disabled="true">
                    {content}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
