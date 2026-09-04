import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routePaths } from "../app/routePaths";
import { findMockExamById } from "../content/catalog";
import { pythonGrade3Course } from "../content/python/grade-3";
import type { MockExamSession, MockExamPublicTestResult } from "../domain/progress";
import { buildMockExamReviewSuggestions } from "../features/analytics/mockExamReview";
import { explainTestCaseResult } from "../features/grading";
import { localUserId, progressRepository } from "../repositories";

function explainPublicResult(result: MockExamPublicTestResult) {
  return explainTestCaseResult({
    ...result,
    visibility: "public",
  });
}

export function MockExamResultPage() {
  const { examId } = useParams();
  const exam = examId ? findMockExamById(examId) : undefined;
  const [session, setSession] = useState<MockExamSession | undefined>();

  useEffect(() => {
    if (!exam) {
      return;
    }

    let active = true;
    void progressRepository.getMockExamSession(localUserId, exam.id).then((storedSession) => {
      if (active) {
        setSession(storedSession);
      }
    });

    return () => {
      active = false;
    };
  }, [exam]);

  if (!exam) {
    return (
      <section className="page-panel">
        <h1>Mock Exam Result</h1>
        <p>模擬試験が見つかりません。</p>
        <Link className="secondary-action inline-action" to={routePaths.pythonGrade3}>
          Curriculumへ戻る
        </Link>
      </section>
    );
  }

  const result = session?.result;

  if (!result) {
    return (
      <section className="page-panel">
        <h1>Mock Exam Result</h1>
        <p>まだ提出結果がありません。</p>
        <Link className="primary-action inline-action" to={routePaths.pythonGrade3MockExam(exam.id)}>
          模擬試験へ戻る
        </Link>
      </section>
    );
  }

  const lessons = pythonGrade3Course.chapters.flatMap((chapter) => chapter.lessons);
  const reviewSuggestions = buildMockExamReviewSuggestions(result, lessons);

  return (
    <section className="page-panel mock-exam-result" aria-label="Mock Exam Result">
      <p className="eyebrow">SCR-070</p>
      <h1>Mock Exam Result</h1>
      <h2>{exam.title}</h2>
      <div className={result.passed ? "pass-banner" : "fail-banner"}>
        {result.passed ? "Passed" : "Review Needed"} / Score {result.scorePercent}%
      </div>
      <dl className="result-summary">
        <div>
          <dt>Problems</dt>
          <dd>{result.passedProblems} / {result.totalProblems} problems passed</dd>
        </div>
        <div>
          <dt>Required tests</dt>
          <dd>{result.passedRequiredCount} / {result.totalRequiredCount}</dd>
        </div>
        <div>
          <dt>Pass line</dt>
          <dd>{result.passingScorePercent}%</dd>
        </div>
      </dl>
      <div className="test-result-list">
        {result.problemResults.map((problemResult) => (
          <article key={problemResult.problemId} className="test-result-row">
            <strong>Problem {problemResult.order}: {problemResult.passed ? "pass" : "fail"}</strong>
            <p>{problemResult.passedRequiredCount} / {problemResult.totalRequiredCount} required tests passed</p>
            <p>Source Lessons: {problemResult.sourceLessonIds.length}</p>
            <p>Hidden tests: {problemResult.hiddenPassedRequiredCount} / {problemResult.hiddenRequiredCount}</p>
            {problemResult.publicResults.map((publicResult) => (
              <div key={publicResult.testCaseId} className="test-detail">
                <span>Public Test #{publicResult.order}</span>
                <p className="test-explanation">{explainPublicResult(publicResult)}</p>
                <span>input</span>
                <pre>{publicResult.stdin || "なし"}</pre>
                <span>expected</span>
                <pre>{publicResult.expectedStdout}</pre>
                <span>actual</span>
                <pre>{publicResult.actualStdout || publicResult.stderr}</pre>
              </div>
            ))}
          </article>
        ))}
      </div>
      <section className="review-suggestion-list" aria-label="Review suggestions">
        <h2>Review suggestions</h2>
        {reviewSuggestions.length > 0 ? (
          reviewSuggestions.map((suggestion) => (
            <Link
              key={suggestion.lessonId}
              className="lesson-row challenge-row"
              to={routePaths.pythonGrade3Lesson(suggestion.lessonId)}
            >
              <span>{suggestion.title}</span>
              <span>{suggestion.failedRequiredCount} required test gap</span>
            </Link>
          ))
        ) : (
          <p>復習候補はありません。この範囲は安定しています。</p>
        )}
      </section>
      <div className="completion-actions">
        <Link className="secondary-action inline-action" to={routePaths.pythonGrade3MockExam(exam.id)}>
          模擬試験へ戻る
        </Link>
        <Link className="primary-action inline-action" to={routePaths.pythonGrade3}>
          Curriculumへ戻る
        </Link>
      </div>
    </section>
  );
}
