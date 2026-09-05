import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { commandGrade3Course } from "../content/command/grade-3";
import type { Course } from "../domain/curriculum";
import type { LessonProgress } from "../domain/progress";
import { summarizeChapterProgress, type ChapterProgressStatus } from "../features/progress/chapterProgress";
import { localUserId, progressRepository } from "../repositories";

const chapterStatusLabels: Record<ChapterProgressStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  not_started: "Not started",
};

interface CommandCurriculumViewProps {
  course: Course;
  lessonPath: (lessonId: string) => string;
}

export function CommandCurriculumView({ course, lessonPath }: CommandCurriculumViewProps) {
  const [progressByLessonId, setProgressByLessonId] = useState<Record<string, LessonProgress>>({});

  useEffect(() => {
    void progressRepository.listLessonProgress(localUserId).then((lessonProgressList) => {
      setProgressByLessonId(Object.fromEntries(lessonProgressList.map((progress) => [progress.lessonId, progress])));
    });
  }, []);

  return (
    <section className="page-panel">
      <PageHeader title={course.title} eyebrow="SCR-030">
        <p>{course.description}</p>
      </PageHeader>
      <div className="curriculum-list">
        {course.chapters.map((chapter) => {
          const summary = summarizeChapterProgress(chapter.lessons, progressByLessonId);

          return (
            <article key={chapter.id} className="chapter-block">
              <div className="chapter-overview">
                <p className="eyebrow">Chapter {chapter.order}</p>
                <h2>{chapter.title}</h2>
                <p>{chapter.description}</p>
                <div className="chapter-progress-summary" aria-label={`${course.title} chapter progress`}>
                  <div className="chapter-progress-heading">
                    <span>{summary.completedLessons} / {summary.totalLessons} Lessons completed</span>
                    <span>{summary.completionPercent}%</span>
                  </div>
                  <div
                    className="chapter-progress-meter"
                    role="progressbar"
                    aria-label={`${chapter.title} progress completion`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={summary.completionPercent}
                    aria-valuetext={`${summary.completedLessons} of ${summary.totalLessons} lessons completed`}
                  >
                    <span style={{ width: `${summary.completionPercent}%` }} />
                  </div>
                  <div className="chapter-progress-detail">
                    <span>{summary.inProgressLessons} in progress</span>
                    <span>{summary.notStartedLessons} not started</span>
                  </div>
                  <span className={`chapter-progress-state chapter-progress-${summary.status}`}>
                    {chapterStatusLabels[summary.status]}
                  </span>
                </div>
              </div>
              <div className="lesson-list">
                {chapter.lessons.map((lesson) => {
                  const progress = progressByLessonId[lesson.id];
                  const status = progress?.status ?? (lesson.status === "published" ? "not_started" : "draft");

                  return (
                    <Link key={lesson.id} className="lesson-row" to={lessonPath(lesson.id)}>
                      <span>{lesson.title}</span>
                      <StatusBadge status={status} />
                    </Link>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
      <div className="completion-actions">
        <Link className="secondary-action inline-action" to={routePaths.command}>
          Level Selectへ戻る
        </Link>
      </div>
    </section>
  );
}

export function CommandGrade3CurriculumPage() {
  return <CommandCurriculumView course={commandGrade3Course} lessonPath={routePaths.commandGrade3Lesson} />;
}
