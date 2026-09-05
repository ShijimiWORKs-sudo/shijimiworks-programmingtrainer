import type { LanguageRunner, RunRequest, RunResult } from "./LanguageRunner";
import type { RubyWorkerRequest, RubyWorkerResponse } from "./rubyProtocol";

interface RunnerWorker {
  postMessage(message: RubyWorkerRequest): void;
  terminate(): void;
  addEventListener(type: "message", listener: (event: MessageEvent<RubyWorkerResponse>) => void): void;
  removeEventListener(type: "message", listener: (event: MessageEvent<RubyWorkerResponse>) => void): void;
}

type WorkerFactory = () => RunnerWorker;

function createDefaultWorker(): RunnerWorker {
  return new Worker(new URL("./ruby.worker.ts", import.meta.url), { type: "module" });
}

function nextRequestId() {
  return "ruby-" + crypto.randomUUID();
}

export class RubyRunner implements LanguageRunner {
  private worker: RunnerWorker;
  private initialized = false;
  private activeRequest:
    | {
        cleanup: () => void;
        reject: (reason?: unknown) => void;
      }
    | undefined;

  constructor(private readonly workerFactory: WorkerFactory = createDefaultWorker) {
    this.worker = this.workerFactory();
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    await this.sendAndWait("initialize", {}, 5_000);
    this.initialized = true;
  }

  async run(request: RunRequest): Promise<RunResult> {
    const startedAt = performance.now();

    try {
      await this.initialize();
      const response = await this.sendAndWait(
        "run",
        {
          sourceCode: request.sourceCode,
          stdin: request.stdin,
          timeoutMs: request.timeoutMs,
        },
        request.timeoutMs
      );

      if (response.type === "run-result") {
        return response.result;
      }

      if (response.type === "error") {
        return {
          status: response.errorType === "timeout" ? "timeout" : "internal_error",
          stdout: "",
          stderr: response.message,
          durationMs: response.durationMs ?? Math.round(performance.now() - startedAt),
          errorType: response.errorType,
        };
      }

      return {
        status: "internal_error",
        stdout: "",
        stderr: "Unexpected worker response.",
        durationMs: Math.round(performance.now() - startedAt),
        errorType: "unknown",
      };
    } catch (error) {
      if (error instanceof Error && error.message === "timeout") {
        this.recreateWorker();
        return {
          status: "timeout",
          stdout: "",
          stderr: "Execution timed out and the Ruby worker was restarted.",
          durationMs: Math.round(performance.now() - startedAt),
          errorType: "timeout",
        };
      }

      if (error instanceof Error && error.message === "cancelled") {
        return {
          status: "cancelled",
          stdout: "",
          stderr: "Execution was cancelled and the Ruby worker was restarted.",
          durationMs: Math.round(performance.now() - startedAt),
          errorType: "cancelled",
        };
      }

      return {
        status: "internal_error",
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown runner error.",
        durationMs: Math.round(performance.now() - startedAt),
        errorType: "unknown",
      };
    }
  }

  async cancel() {
    const activeRequest = this.activeRequest;
    activeRequest?.cleanup();
    activeRequest?.reject(new Error("cancelled"));
    this.recreateWorker();
  }

  async reset() {
    this.recreateWorker();
    await this.initialize();
  }

  async dispose() {
    const activeRequest = this.activeRequest;
    activeRequest?.cleanup();
    activeRequest?.reject(new Error("cancelled"));
    this.worker.terminate();
    this.initialized = false;
  }

  private recreateWorker() {
    this.worker.terminate();
    this.worker = this.workerFactory();
    this.initialized = false;
    this.activeRequest = undefined;
  }

  private sendAndWait(
    type: RubyWorkerRequest["type"],
    payload: Partial<RubyWorkerRequest>,
    timeoutMs: number
  ): Promise<RubyWorkerResponse> {
    const id = nextRequestId();
    const message = { id, type, ...payload } as RubyWorkerRequest;
    const worker = this.worker;

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        window.clearTimeout(timer);
        worker.removeEventListener("message", handleMessage);
        if (this.activeRequest?.cleanup === cleanup) {
          this.activeRequest = undefined;
        }
      };
      const handleMessage = (event: MessageEvent<RubyWorkerResponse>) => {
        if (event.data.id !== id) {
          return;
        }
        cleanup();
        resolve(event.data);
      };
      const timer = window.setTimeout(() => {
        cleanup();
        reject(new Error("timeout"));
      }, timeoutMs);

      this.activeRequest = { cleanup, reject };
      worker.addEventListener("message", handleMessage);
      worker.postMessage(message);
    });
  }
}
