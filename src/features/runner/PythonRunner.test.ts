import { describe, expect, it, vi } from "vitest";
import { PythonRunner, type PythonWorkerRequest, type PythonWorkerResponse } from ".";

class FakeWorker {
  messages: PythonWorkerRequest[] = [];
  terminated = false;
  listener: ((event: MessageEvent<PythonWorkerResponse>) => void) | undefined;

  constructor(private readonly shouldRespond = true) {}

  postMessage(message: PythonWorkerRequest) {
    this.messages.push(message);
    if (!this.shouldRespond) {
      return;
    }
    const response: PythonWorkerResponse =
      message.type === "run"
        ? {
            id: message.id,
            type: "run-result",
            result: { status: "success", stdout: "ok\n", stderr: "", durationMs: 1 },
          }
        : { id: message.id, type: message.type === "initialize" ? "initialized" : "reset-done" };
    window.setTimeout(() => this.listener?.({ data: response } as MessageEvent<PythonWorkerResponse>), 0);
  }

  terminate() {
    this.terminated = true;
  }

  addEventListener(_type: "message", listener: (event: MessageEvent<PythonWorkerResponse>) => void) {
    this.listener = listener;
  }

  removeEventListener() {
    this.listener = undefined;
  }
}

describe("PythonRunner protocol", () => {
  it("sends initialize and run messages to the worker", async () => {
    const worker = new FakeWorker();
    const runner = new PythonRunner(() => worker);

    const result = await runner.run({ sourceCode: "print('ok')", stdin: "", timeoutMs: 1000 });

    expect(result.stdout).toBe("ok\n");
    expect(worker.messages.map((message) => message.type)).toEqual(["initialize", "run"]);
  });

  it("terminates and recreates the worker on timeout", async () => {
    vi.useFakeTimers();
    const workers = [new FakeWorker(false), new FakeWorker(true)];
    const runner = new PythonRunner(() => workers.shift() ?? new FakeWorker(true));

    const runPromise = runner.run({ sourceCode: "while True:\n    pass", stdin: "", timeoutMs: 10 });
    await vi.runAllTimersAsync();
    const result = await runPromise;

    expect(result.status).toBe("timeout");
    expect(workers.length).toBe(0);
    vi.useRealTimers();
  });
});
