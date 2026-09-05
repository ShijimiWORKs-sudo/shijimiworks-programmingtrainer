import { describe, expect, it } from "vitest";
import type { Exercise } from "../../domain/curriculum";
import { explainTestCaseResult } from "../grading";
import { gradeCommandVirtualFileSystemExercise } from "./commandGrading";

const baseEnvironment = {
  cwd: "C:\\Users\\student",
  entries: [
    { path: "C:\\", type: "directory" },
    { path: "C:\\Users", type: "directory" },
    { path: "C:\\Users\\student", type: "directory" },
    { path: "C:\\Users\\student\\draft.txt", type: "file", content: "draft\n" },
    { path: "C:\\Users\\student\\old.tmp", type: "file", content: "delete me\n" },
  ],
} satisfies Exercise["commandEnvironment"];

const exercise: Exercise = {
  id: "ex_command3_02_files_01",
  lessonId: "lesson_command3_02_virtual_files",
  type: "code",
  promptMd: "Create, move, and delete files in the virtual command prompt.",
  starterCode: "echo report ready > report.txt\nmove draft.txt final.txt\ndel old.tmp",
  gradingMode: "command_virtual_fs",
  timeoutMs: 1000,
  completionCriteria: "The virtual filesystem matches all required states.",
  testCases: [],
  commandEnvironment: baseEnvironment,
  commandFileRequirements: [
    {
      id: "report-created",
      order: 1,
      visibility: "public",
      kind: "file_content_equals",
      path: "report.txt",
      description: "report.txt exists with the requested content.",
      expectedContent: "report ready\n",
      required: true,
    },
    {
      id: "draft-moved",
      order: 2,
      visibility: "public",
      kind: "file_not_exists",
      path: "draft.txt",
      description: "draft.txt has been moved away from the starting location.",
      required: true,
    },
    {
      id: "final-created",
      order: 3,
      visibility: "hidden",
      kind: "file_content_equals",
      path: "final.txt",
      description: "The moved file keeps its content.",
      expectedContent: "draft\n",
      required: true,
    },
    {
      id: "old-deleted",
      order: 4,
      visibility: "hidden",
      kind: "file_not_exists",
      path: "old.tmp",
      description: "The temporary file is deleted.",
      required: true,
    },
  ],
};

describe("command virtual filesystem grading", () => {
  it("passes when create, move, and delete requirements match the virtual state", () => {
    const result = gradeCommandVirtualFileSystemExercise(
      exercise,
      "echo report ready > report.txt\nmove draft.txt final.txt\ndel old.tmp"
    );

    expect(result).toMatchObject({
      passed: true,
      passedRequired: 4,
      totalRequired: 4,
    });
    expect(result.results[0].testCaseId).toBe("cmdfs:report-created");
    expect(result.results[0].actualStdout).toContain("report ready");
  });

  it("fails safely without exposing hidden file details", () => {
    const result = gradeCommandVirtualFileSystemExercise(exercise, "echo wrong > report.txt");
    const hiddenResult = result.results.find((item) => item.visibility === "hidden");

    expect(result.passed).toBe(false);
    expect(hiddenResult?.actualStdout).toBe("");
    expect(hiddenResult?.stderr).toBe("");
    expect(explainTestCaseResult(hiddenResult!)).toContain("非公開ファイル条件");
  });

  it("treats host-looking paths as virtual paths during grading", () => {
    const hostPathExercise: Exercise = {
      ...exercise,
      commandFileRequirements: [
        {
          id: "host-looking-path",
          order: 1,
          visibility: "public",
          kind: "file_content_equals",
          path: "C:\\Users\\user\\secret.txt",
          description: "The path is still evaluated inside the virtual state.",
          expectedContent: "virtual only\n",
          required: true,
        },
      ],
    };

    const result = gradeCommandVirtualFileSystemExercise(
      hostPathExercise,
      "mkdir C:\\Users\\user\necho virtual only > C:\\Users\\user\\secret.txt"
    );

    expect(result.passed).toBe(true);
    expect(result.results[0].actualStdout).toContain("C:\\Users\\user\\secret.txt");
  });
});
