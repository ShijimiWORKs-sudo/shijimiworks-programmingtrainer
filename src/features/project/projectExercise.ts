import type { ChallengeExercise, Exercise, MockExamProblem, ProjectExercise, ProjectExerciseFile } from "../../domain/curriculum";

export type ProjectCapableExercise = Exercise | ChallengeExercise | MockExamProblem;

export interface ProjectFileSnapshot {
  path: string;
  language: string;
  content: string;
  editable: boolean;
}

const windowsDrivePathPattern = /^[A-Za-z]:[\\/]/;

export function isSafeProjectFilePath(path: string) {
  const normalizedPath = path.replace(/\\/g, "/");
  const segments = normalizedPath.split("/");

  return (
    path.trim().length > 0 &&
    !normalizedPath.startsWith("/") &&
    !windowsDrivePathPattern.test(path) &&
    !segments.includes("..") &&
    !segments.includes("")
  );
}

export function validateProjectExercise(project: ProjectExercise) {
  const errors: string[] = [];
  const seenPaths = new Set<string>();

  if (!isSafeProjectFilePath(project.entryFilePath)) {
    errors.push("entryFilePath must be a non-empty relative path.");
  }

  for (const file of project.files) {
    if (!isSafeProjectFilePath(file.path)) {
      errors.push(`file path must be a non-empty relative path: ${file.path}`);
    }
    if (seenPaths.has(file.path)) {
      errors.push(`file path must be unique: ${file.path}`);
    }
    seenPaths.add(file.path);
  }

  if (!project.files.some((file) => file.path === project.entryFilePath)) {
    errors.push("entryFilePath must match one project file.");
  }

  return errors;
}

export function hasProjectFiles(exercise: ProjectCapableExercise): exercise is ProjectCapableExercise & { project: ProjectExercise } {
  return Boolean(exercise.project);
}

export function getEntryProjectFile(exercise: ProjectCapableExercise): ProjectExerciseFile | undefined {
  return exercise.project?.files.find((file) => file.path === exercise.project?.entryFilePath);
}

export function listEditableProjectFiles(exercise: ProjectCapableExercise) {
  return exercise.project?.files.filter((file) => file.editable) ?? [];
}

export function createProjectFileSnapshot(exercise: ProjectCapableExercise, sourceCode: string): ProjectFileSnapshot[] {
  if (!hasProjectFiles(exercise)) {
    return [
      {
        path: "main.py",
        language: "python",
        content: sourceCode,
        editable: true,
      },
    ];
  }

  return exercise.project.files.map((file) => ({
    path: file.path,
    language: file.language,
    content: file.path === exercise.project.entryFilePath ? sourceCode : file.content,
    editable: file.editable,
  }));
}
