import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { pythonGrade3Course } from "../content/python/grade-3";
import type { ChallengeProgress, LessonProgress } from "../domain/progress";
import { summarizeChapterProgress, type ChapterProgressStatus } from "../features/progress/chapterProgress";
import { localUserId, progressRepository } from "../repositories";

const chapterStatusLabels: Record<ChapterProgressStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  not_started: "Not started",
};

export function PythonGrade3CurriculumPage() {
  const [progressByLessonId, setProgressByLessonId] = useState<Record<string, LessonProgress>>({});
  const [progressByChallengeId, setProgressByChallengeId] = useState<Record<string, ChallengeProgress>>({});

  useEffect(() => {
    void Promise.all([
      progressRepository.listLessonProgress(localUserId),
      progressRepository.listChallengeProgress(localUserId),
    ]).then(([lessonProgressList, challengeProgressList]) => {
      setProgressByLessonId(Object.fromEntries(lessonProgressList.map((progress) => [progress.lessonId, progress])));
      setProgressByChallengeId(Object.fromEntries(challengeProgressList.map((progress) => [progress.challengeId, progress])));
    });
  }, []);

  return (
    <section className="page-panel">
      <PageHeader title={pythonGrade3Course.title} eyebrow="SCR-030">
        <p>{pythonGrade3Course.description}</p>
      </PageHeader>
      <div className="curriculum-list">
        {pythonGrade3Course.chapters.map((chapter) => {
          const summary = summarizeChapterProgress(chapter.lessons, progressByLessonId);

          return (
            <article key={chapter.id} className="chapter-block">
              <div className="chapter-overview">
                <p className="eyebrow">Chapter {chapter.order}</p>
                <h2>{chapter.title}</h2>
                <p>{chapter.description}</p>
                <div className="chapter-progress-summary" aria-label={`${pythonGrade3Course.title} chapter progress`}>
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
              {chapter.challenges.length > 0 ? (
                <section className="challenge-list" aria-label="Chapter challenges">
                  <h3>Chapter Challenge</h3>
                  {chapter.challenges.map((challenge) => {
                    const progress = progressByChallengeId[challenge.id];
                    return (
                      <Link
                        key={challenge.id}
                        className="lesson-row challenge-row"
                        to={routePaths.pythonGrade3Challenge(challenge.id)}
                      >
                        <span>{challenge.title}</span>
                        <StatusBadge status={progress?.status ?? challenge.status} />
                      </Link>
                    );
                  })}
                </section>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
