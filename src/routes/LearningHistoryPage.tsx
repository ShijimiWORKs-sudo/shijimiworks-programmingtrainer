import { PageHeader } from "../components/PageHeader";

export function LearningHistoryPage() {
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
          <tr>
            <td colSpan={5}>記録はまだありません。</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

