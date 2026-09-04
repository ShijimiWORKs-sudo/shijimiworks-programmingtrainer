import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { PageHeader } from "../components/PageHeader";
import { findLessonById } from "../content/catalog";
import type { LessonProgress } from "../domain/progress";
import { localUserId, progressRepository } from "../repositories";

export function HomePage() {
  const [lastProgress, setLastProgress] = useState<LessonProgress | undefined>();

  useEffect(() => {
    void progressRepository.getLastLessonProgress(localUserId).then(setLastProgress);
  }, []);

  const lastLesson = lastProgress ? findLessonById(lastProgress.lessonId) : undefined;

  return (
    <section className="page-panel">
      <PageHeader title="Programming Trainer" eyebrow="PC Web Learning">
        <p>コードを書き、実行し、自動採点で確認しながらPython 3級の基礎を学びます。</p>
      </PageHeader>
      <div className="action-grid">
        {lastLesson ? (
          <Link className="primary-action" to={routePaths.pythonGrade3Lesson(lastLesson.id)}>
            続きから学習: {lastLesson.title}
          </Link>
        ) : (
          <Link className="primary-action" to={routePaths.languages}>
            言語を選択
          </Link>
        )}
        <Link className="secondary-action" to={routePaths.pythonGrade3}>
          Python 3級
        </Link>
        <Link className="secondary-action" to={routePaths.history}>
          学習履歴
        </Link>
        <Link className="secondary-action" to={routePaths.settings}>
          設定
        </Link>
      </div>
    </section>
  );
}
