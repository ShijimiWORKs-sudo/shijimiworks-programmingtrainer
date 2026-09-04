import { describe, expect, it } from "vitest";
import type { Exercise, ProjectExercise } from "../../domain/curriculum";
import {
  createProjectFileSnapshot,
  getEntryProjectFile,
  hasProjectFiles,
  isSafeProjectFilePath,
  listEditableProjectFiles,
  validateProjectExercise,
} from "./projectExercise";

const singleFileExercise: Exercise = {
  id: "single",
  lessonId: "lesson",
  type: "code",
  promptMd: "prompt",
  starterCode: "print('hello')\n",
  gradingMode: "stdout",
  timeoutMs: 3000,
  completionCriteria: "passes",
  testCases: [],
};

const project: ProjectExercise = {
  entryFilePath: "main.py",
  files: [
    {
      path: "main.py",
      language: "python",
      content: "from helper import label\nprint(label())\n",
      editable: true,
      purpose: "entry",
    },
    {
      path: "helper.py",
      language: "python",
      content: "def label():\n    return 'ok'\n",
      editable: true,
      purpose: "support",
    },
    {
      path: "tests/test_label.py",
      language: "python",
      content: "assert True\n",
      editable: false,
      purpose: "test",
    },
  ],
};

const projectExercise: Exercise = {
  ...singleFileExercise,
  id: "project",
  project,
};

describe("project exercise helpers", () => {
  it("keeps existing single-file exercises representable as one editable main.py snapshot", () => {
    expect(hasProjectFiles(singleFileExercise)).toBe(false);

    expect(createProjectFileSnapshot(singleFileExercise, "print('changed')\n")).toEqual([
      {
        path: "main.py",
        language: "python",
        content: "print('changed')\n",
        editable: true,
      },
    ]);
  });

  it("lists project entry and editable files without changing support file content", () => {
    expect(hasProjectFiles(projectExercise)).toBe(true);
    expect(getEntryProjectFile(projectExercise)).toMatchObject({ path: "main.py", purpose: "entry" });
    expect(listEditableProjectFiles(projectExercise).map((file) => file.path)).toEqual(["main.py", "helper.py"]);

    expect(createProjectFileSnapshot(projectExercise, "print('entry changed')\n")).toEqual([
      {
        path: "main.py",
        language: "python",
        content: "print('entry changed')\n",
        editable: true,
      },
      {
        path: "helper.py",
        language: "python",
        content: "def label():\n    return 'ok'\n",
        editable: true,
      },
      {
        path: "tests/test_label.py",
        language: "python",
        content: "assert True\n",
        editable: false,
      },
    ]);
  });

  it("accepts only relative project file paths", () => {
    expect(isSafeProjectFilePath("main.py")).toBe(true);
    expect(isSafeProjectFilePath("pkg/helper.py")).toBe(true);
    expect(isSafeProjectFilePath("")).toBe(false);
    expect(isSafeProjectFilePath("/tmp/main.py")).toBe(false);
    expect(isSafeProjectFilePath("C:\\tmp\\main.py")).toBe(false);
    expect(isSafeProjectFilePath("../main.py")).toBe(false);
    expect(isSafeProjectFilePath("pkg//main.py")).toBe(false);
  });

  it("reports invalid project model definitions", () => {
    expect(validateProjectExercise(project)).toEqual([]);
    expect(validateProjectExercise({
      entryFilePath: "src/main.py",
      files: [
        { ...project.files[0], path: "src/main.py" },
        { ...project.files[1], path: "src/main.py" },
        { ...project.files[2], path: "../tests/test_label.py" },
      ],
    })).toEqual([
      "file path must be unique: src/main.py",
      "file path must be a non-empty relative path: ../tests/test_label.py",
    ]);
  });
});
