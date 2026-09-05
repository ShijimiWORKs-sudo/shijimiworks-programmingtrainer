import { describe, expect, it } from "vitest";
import type { TestCaseGradeResult } from "./GradingEngine";
import { explainTestCaseResult } from "./explain";

function result(overrides: Partial<TestCaseGradeResult>): TestCaseGradeResult {
  return {
    testCaseId: "test",
    order: 1,
    visibility: "public",
    passed: false,
    required: true,
    stdin: "input\n",
    expectedStdout: "expected\n",
    actualStdout: "actual\n",
    stderr: "",
    status: "success",
    errorType: undefined,
    durationMs: 1,
    ...overrides,
  };
}

describe("explainTestCaseResult", () => {
  it("explains public wrong answers without treating them as runtime errors", () => {
    expect(explainTestCaseResult(result({ status: "success" }))).toContain("出力が期待値と違います");
  });

  it("explains public runtime errors from stderr context", () => {
    expect(explainTestCaseResult(result({ status: "runtime_error", errorType: "runtime_error", stderr: "Traceback" }))).toContain("実行時エラー");
  });

  it("keeps hidden failure details private", () => {
    const explanation = explainTestCaseResult(result({
      visibility: "hidden",
      stdin: undefined,
      expectedStdout: undefined,
      actualStdout: "SECRET_ACTUAL",
      stderr: "SECRET_STDERR",
    }));

    expect(explanation).toContain("詳細は表示されません");
    expect(explanation).not.toContain("SECRET_ACTUAL");
    expect(explanation).not.toContain("SECRET_STDERR");
  });

  it("explains DOM results without leaking hidden DOM details", () => {
    expect(explainTestCaseResult(result({ testCaseId: "dom:heading", passed: false }))).toContain("HTML構造");

    const explanation = explainTestCaseResult(result({
      testCaseId: "dom:private-selector",
      visibility: "hidden",
      stdin: undefined,
      expectedStdout: undefined,
      actualStdout: "main.profile-card p",
    }));

    expect(explanation).toContain("非公開DOM条件");
    expect(explanation).not.toContain("main.profile-card p");
  });

  it("explains style results without leaking hidden CSS details", () => {
    expect(explainTestCaseResult(result({ testCaseId: "style:padding", passed: false }))).toContain("CSS");

    const explanation = explainTestCaseResult(result({
      testCaseId: "style:responsive-padding",
      visibility: "hidden",
      stdin: undefined,
      expectedStdout: undefined,
      actualStdout: "@media (max-width: 700px)",
    }));

    expect(explanation).toContain("非公開CSS条件");
    expect(explanation).not.toContain("@media");
  });
});
