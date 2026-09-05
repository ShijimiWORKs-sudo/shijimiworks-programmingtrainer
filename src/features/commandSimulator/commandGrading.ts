import type { CommandFileRequirement, CommandVirtualEnvironment, Exercise } from "../../domain/curriculum";
import type { GradeResult, TestCaseGradeResult } from "../grading";
import { createVirtualTerminalState, normalizeVirtualPath, runCommandScript, type VirtualFileSystemEntry, type VirtualTerminalState } from "./virtualTerminal";

export function createVirtualTerminalStateFromEnvironment(environment?: CommandVirtualEnvironment): VirtualTerminalState {
  if (!environment) {
    return createVirtualTerminalState();
  }

  const entries: Record<string, VirtualFileSystemEntry> = {};
  for (const entry of environment.entries) {
    entries[entry.path] = entry.type === "directory" ? { type: "directory" } : { type: "file", content: entry.content ?? "" };
  }

  return createVirtualTerminalState({
    cwd: environment.cwd,
    entries,
  });
}

function requirementPassed(requirement: CommandFileRequirement, state: VirtualTerminalState, initialCwd: string) {
  const path = normalizeVirtualPath(initialCwd, requirement.path);
  const entry = state.entries[path];

  if (requirement.kind === "file_exists") {
    return entry?.type === "file";
  }

  if (requirement.kind === "file_not_exists") {
    return entry === undefined;
  }

  if (requirement.kind === "directory_exists") {
    return entry?.type === "directory";
  }

  return entry?.type === "file" && entry.content === (requirement.expectedContent ?? "");
}

function describePublicActual(requirement: CommandFileRequirement, state: VirtualTerminalState, initialCwd: string) {
  const path = normalizeVirtualPath(initialCwd, requirement.path);
  const entry = state.entries[path];

  if (!entry) {
    return `Missing virtual entry: ${path}`;
  }

  if (entry.type === "directory") {
    return `Virtual directory exists: ${path}`;
  }

  if (requirement.kind === "file_content_equals") {
    return `Virtual file content at ${path}:\n${entry.content}`;
  }

  return `Virtual file exists: ${path}`;
}

function resultForRequirement(
  requirement: CommandFileRequirement,
  state: VirtualTerminalState,
  initialCwd: string,
  executionStatus: TestCaseGradeResult["status"],
  stderr: string,
  durationMs: number
): TestCaseGradeResult {
  const passed = executionStatus === "success" && requirementPassed(requirement, state, initialCwd);
  const isPublic = requirement.visibility === "public";

  return {
    testCaseId: `cmdfs:${requirement.id}`,
    order: requirement.order,
    visibility: requirement.visibility,
    passed,
    required: requirement.required,
    stdin: isPublic ? "" : undefined,
    expectedStdout: isPublic ? requirement.description : undefined,
    actualStdout: isPublic ? describePublicActual(requirement, state, initialCwd) : "",
    stderr: isPublic ? stderr : "",
    status: executionStatus,
    errorType: executionStatus === "success" ? undefined : "runtime_error",
    durationMs,
  };
}

export function gradeCommandVirtualFileSystemExercise(exercise: Exercise, sourceCode: string): GradeResult {
  const startedAt = performance.now();
  const initialState = createVirtualTerminalStateFromEnvironment(exercise.commandEnvironment);
  const runResult = runCommandScript(sourceCode, initialState);
  const durationMs = Math.round(performance.now() - startedAt);
  const status = runResult.exitCode === 0 ? "success" : "runtime_error";
  const requirements = [...(exercise.commandFileRequirements ?? [])].sort((a, b) => a.order - b.order);
  const results = requirements.map((requirement) =>
    resultForRequirement(requirement, runResult.state, initialState.cwd, status, runResult.stderr, durationMs)
  );
  const requiredResults = results.filter((result) => result.required);
  const passedRequired = requiredResults.filter((result) => result.passed).length;

  return {
    passed: requiredResults.length > 0 && passedRequired === requiredResults.length,
    totalRequired: requiredResults.length,
    passedRequired,
    results,
  };
}
