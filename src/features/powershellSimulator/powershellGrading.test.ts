import { describe, expect, it } from "vitest";
import type { Exercise } from "../../domain/curriculum";
import { gradePowerShellVirtualFileSystemExercise } from "./powershellGrading";

const exercise: Exercise = {
  id: "ex_powershell_fs_test",
  lessonId: "lesson_powershell_fs_test",
  type: "code",
  promptMd: "Create a report file.",
  starterCode: "",
  gradingMode: "powershell_virtual_fs",
  timeoutMs: 1000,
  completionCriteria: "Virtual filesystem requirements pass.",
  testCases: [],
  powershellEnvironment: {
    cwd: "C:\\Users\\student",
    entries: [
      { path: "C:\\", type: "directory" },
      { path: "C:\\Users", type: "directory" },
      { path: "C:\\Users\\student", type: "directory" },
      { path: "draft.txt", type: "file", content: "draft\n" },
    ],
  },
  powershellFileRequirements: [
    {
      id: "reports_dir",
      order: 1,
      visibility: "public",
      kind: "directory_exists",
      path: "reports",
      description: "reports directory exists",
      required: true,
    },
    {
      id: "summary_content",
      order: 2,
      visibility: "public",
      kind: "file_content_equals",
      path: "reports\\summary.txt",
      description: "summary.txt contains ready",
      expectedContent: "ready\n",
      required: true,
    },
    {
      id: "draft_removed",
      order: 3,
      visibility: "hidden",
      kind: "file_not_exists",
      path: "draft.txt",
      description: "draft.txt is removed",
      required: true,
    },
  ],
};

describe("PowerShell virtual filesystem grading", () => {
  it("grades virtual filesystem requirements without host filesystem access", () => {
    const result = gradePowerShellVirtualFileSystemExercise(
      exercise,
      "New-Item -ItemType Directory -Path reports\nSet-Content -Path reports\\summary.txt -Value ready\nRemove-Item draft.txt"
    );

    expect(result).toMatchObject({ passed: true, totalRequired: 3, passedRequired: 3 });
    expect(result.results[1].actualStdout).toContain("ready");
    expect(result.results[2]).toMatchObject({ visibility: "hidden", actualStdout: "", stderr: "" });
  });

  it("keeps public failure details generic to the virtual path and hidden details empty", () => {
    const result = gradePowerShellVirtualFileSystemExercise(exercise, "Set-Content -Path reports\\summary.txt -Value wrong");

    expect(result).toMatchObject({ passed: false, totalRequired: 3, passedRequired: 0 });
    expect(result.results[0].actualStdout).toContain("Missing virtual entry");
    expect(result.results[2].actualStdout).toBe("");
  });
});
