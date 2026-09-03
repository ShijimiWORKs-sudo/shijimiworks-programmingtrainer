import type { LanguageRunner, RunRequest, RunResult } from "./LanguageRunner";
import type { PythonWorkerRequest, PythonWorkerResponse } from "./pythonProtocol";

interface RunnerWorker {
  postMessage(message: PythonWorkerRequest): void;
  terminate(): void;
  addEventListener(type: "message", listener: (event: MessageEvent<PythonWorkerResponse>) => void): void;
  removeEventListener(type: "message", listener: (event: MessageEvent<PythonWorkerResponse>) => void): void;
}

type WorkerFactory = () => RunnerWorker;

function createDefaultWorker(): RunnerWorker {
  return new Worker(new URL("./python.worker.ts", import.meta.url), { type: "module" });
}

function nextRequestId() {
  return "py-" + crypto.randomUUID();
}

export class PythonRunner implements LanguageRunner {
  private worker: RunnerWorker;
  private initialized = false;
  private activeReject: ((reason?: unknown) => void) | undefined;

  constructor(private readonly workerFactory: WorkerFactory = createDefaultWorker) {
    this.worker = this.workerFactory();
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    await this.sendAndWait("initialize", {}, 60_000);
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
          stderr: "Execution timed out and the Python worker was restarted.",
          durationMs: Math.round(performance.now() - startedAt),
          errorType: "timeout",
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
    this.activeReject?.(new Error("cancelled"));
    this.recreateWorker();
  }

  async reset() {
    this.recreateWorker();
    await this.initialize();
  }

  async dispose() {
    this.activeReject?.(new Error("cancelled"));
    this.worker.terminate();
    this.initialized = false;
  }

  private recreateWorker() {
    this.worker.terminate();
    this.worker = this.workerFactory();
    this.initialized = false;
    this.activeReject = undefined;
  }

  private sendAndWait(
    type: PythonWorkerRequest["type"],
    payload: Partial<PythonWorkerRequest>,
    timeoutMs: number
  ): Promise<PythonWorkerResponse> {
    const id = nextRequestId();
    const message = { id, type, ...payload } as PythonWorkerRequest;

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        window.clearTimeout(timer);
        this.worker.removeEventListener("message", handleMessage);
        this.activeReject = undefined;
      };
      const handleMessage = (event: MessageEvent<PythonWorkerResponse>) => {
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

      this.activeReject = reject;
      this.worker.addEventListener("message", handleMessage);
      this.worker.postMessage(message);
    });
  }
}

