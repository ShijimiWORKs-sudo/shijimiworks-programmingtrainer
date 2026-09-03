export type RunStatus = "success" | "runtime_error" | "timeout" | "cancelled" | "internal_error";
export type RunErrorType = "syntax_error" | "runtime_error" | "timeout" | "cancelled" | "unknown";

export interface RunRequest {
  sourceCode: string;
  stdin: string;
  timeoutMs: number;
}

export interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  durationMs: number;
  errorType?: RunErrorType;
}

export interface LanguageRunner {
  initialize(): Promise<void>;
  run(request: RunRequest): Promise<RunResult>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promise<void>;
}
