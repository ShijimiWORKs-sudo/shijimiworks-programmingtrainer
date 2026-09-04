import type { RunErrorType, RunResult } from "./LanguageRunner";

export type JavaScriptWorkerRequest =
  | { id: string; type: "initialize" }
  | { id: string; type: "run"; sourceCode: string; stdin: string; timeoutMs: number }
  | { id: string; type: "reset" };

export type JavaScriptWorkerResponse =
  | { id: string; type: "initialized" }
  | { id: string; type: "run-result"; result: RunResult }
  | { id: string; type: "reset-done" }
  | { id: string; type: "error"; errorType: RunErrorType; message: string; durationMs?: number };
