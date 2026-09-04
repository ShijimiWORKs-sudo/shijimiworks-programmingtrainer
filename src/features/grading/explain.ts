import type { TestCaseGradeResult } from "./GradingEngine";

export function explainTestCaseResult(result: TestCaseGradeResult): string {
  const isDomResult = result.testCaseId.startsWith("dom:");

  if (result.visibility === "hidden") {
    return result.passed
      ? "非公開テストも合格しています。"
      : isDomResult
        ? "非公開DOM条件の詳細は表示されません。公開条件以外のHTML構造も満たしているか見直してください。"
        : "非公開テストの詳細は表示されません。公開テスト以外の入力でも同じ条件を満たすか見直してください。";
  }

  if (isDomResult) {
    return result.passed
      ? "HTML構造が条件を満たしています。"
      : "HTML構造が条件と一致していません。selector、タグ名、class名、テキストを確認してください。";
  }

  if (result.passed) {
    return "期待どおりの出力です。";
  }

  if (result.status === "timeout") {
    return "実行が制限時間内に終わりませんでした。ループ条件や入力待ちを確認してください。";
  }

  if (result.status === "runtime_error") {
    return result.errorType === "syntax_error"
      ? "文法エラーが発生しました。stderr の内容と、かっこ・引用符・字下げを確認してください。"
      : "実行時エラーが発生しました。stderr の内容と、変数名や入力変換を確認してください。";
  }

  if (result.status === "cancelled") {
    return "実行がキャンセルされました。もう一度実行できます。";
  }

  if (result.status === "internal_error") {
    return "実行環境でエラーが発生しました。時間をおいて再実行してください。";
  }

  return "出力が期待値と違います。input、expected、actual を1行ずつ比べてください。";
}
