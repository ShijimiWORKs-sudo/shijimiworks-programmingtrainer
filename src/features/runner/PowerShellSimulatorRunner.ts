import { createVirtualPowerShellState, runPowerShellScript, type VirtualPowerShellState } from "../powershellSimulator";
import type { LanguageRunner, RunRequest, RunResult } from "./LanguageRunner";

export class PowerShellSimulatorRunner implements LanguageRunner {
  private initialState: VirtualPowerShellState;
  private state: VirtualPowerShellState;
  private cancelled = false;

  constructor(seed?: Partial<VirtualPowerShellState>) {
    this.initialState = createVirtualPowerShellState(seed);
    this.state = createVirtualPowerShellState(this.initialState);
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
        stderr: "Virtual PowerShell script exceeded the 200 line foundation limit.",
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

    const result = runPowerShellScript(request.sourceCode, this.state);
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
    this.state = createVirtualPowerShellState(this.initialState);
  }

  async dispose() {
    await this.reset();
  }

  getSnapshot() {
    return createVirtualPowerShellState(this.state);
  }
}
