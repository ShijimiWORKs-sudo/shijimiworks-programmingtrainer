import { createVirtualTerminalState, runCommandScript, type VirtualTerminalState } from "../commandSimulator";
import type { LanguageRunner, RunRequest, RunResult } from "./LanguageRunner";

export class CommandSimulatorRunner implements LanguageRunner {
  private initialState: VirtualTerminalState;
  private state: VirtualTerminalState;
  private cancelled = false;

  constructor(seed?: Partial<VirtualTerminalState>) {
    this.initialState = createVirtualTerminalState(seed);
    this.state = createVirtualTerminalState(this.initialState);
  }

  async initialize() {
    this.cancelled = false;
  }

  async run(request: RunRequest): Promise<RunResult> {
    const startedAt = performance.now();
    await this.initialize();

    if (request.sourceCode.split(/\r\n|\r|\n/).length > 200) {
      return {
        status: "timeout",
        stdout: "",
        stderr: "Virtual command script exceeded the 200 line foundation limit.",
        durationMs: Math.round(performance.now() - startedAt),
        errorType: "timeout",
      };
    }

    if (this.cancelled) {
      return {
        status: "cancelled",
        stdout: "",
        stderr: "Execution was cancelled.",
        durationMs: Math.round(performance.now() - startedAt),
        errorType: "cancelled",
      };
    }

    const result = runCommandScript(request.sourceCode, this.state);
    this.state = result.state;

    return {
      status: result.exitCode === 0 ? "success" : "runtime_error",
      stdout: result.stdout,
      stderr: result.stderr,
      durationMs: Math.round(performance.now() - startedAt),
      errorType: result.exitCode === 0 ? undefined : "runtime_error",
    };
  }

  async cancel() {
    this.cancelled = true;
  }

  async reset() {
    this.cancelled = false;
    this.state = createVirtualTerminalState(this.initialState);
  }

  async dispose() {
    await this.reset();
  }

  getSnapshot() {
    return createVirtualTerminalState(this.state);
  }
}
