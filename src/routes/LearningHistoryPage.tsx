import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { findLessonById } from "../content/catalog";
import type { LessonProgress } from "../domain/progress";
import { localUserId, progressRepository } from "../repositories";

export function LearningHistoryPage() {
  const [progressList, setProgressList] = useState<LessonProgress[]>([]);

  useEffect(() => {
    void progressRepository.listLessonProgress(localUserId).then(setProgressList);
  }, []);

  return (
    <section className="page-panel">
      <PageHeader title="Learning History" eyebrow="SCR-080" />
      <table className="history-table">
        <thead>
          <tr>
            <th>日付</th>
            <th>言語</th>
            <th>Lesson</th>
            <th>状態</th>
            <th>試行回数</th>
          </tr>
        </thead>
        <tbody>
          {progressList.length === 0 ? (
            <tr>
              <td colSpan={5}>記録はまだありません。</td>
            </tr>
          ) : (
            progressList.map((progress) => (
              <tr key={progress.id}>
                <td>{progress.lastStudiedAt ? new Date(progress.lastStudiedAt).toLocaleString("ja-JP") : "-"}</td>
                <td>Python</td>
                <td>{findLessonById(progress.lessonId)?.title ?? progress.lessonId}</td>
                <td>{progress.status}</td>
                <td>{progress.runCount + progress.gradeCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
