import { describe, expect, it, vi } from "vitest";
import { JavaScriptRunner, type JavaScriptWorkerRequest, type JavaScriptWorkerResponse } from ".";

type FakeWorkerMode = "all" | "none" | "initialize-only";

class FakeWorker {
  messages: JavaScriptWorkerRequest[] = [];
  terminated = false;
  listener: ((event: MessageEvent<JavaScriptWorkerResponse>) => void) | undefined;

  constructor(private readonly mode: FakeWorkerMode = "all") {}

  postMessage(message: JavaScriptWorkerRequest) {
    this.messages.push(message);
    if (this.mode === "none" || (this.mode === "initialize-only" && message.type === "run")) {
      return;
    }
    const response: JavaScriptWorkerResponse =
      message.type === "run"
        ? {
            id: message.id,
            type: "run-result",
            result: { status: "success", stdout: "ok\n", stderr: "", durationMs: 1 },
          }
        : { id: message.id, type: message.type === "initialize" ? "initialized" : "reset-done" };
    window.setTimeout(() => this.listener?.({ data: response } as MessageEvent<JavaScriptWorkerResponse>), 0);
  }

  terminate() {
    this.terminated = true;
  }

  addEventListener(_type: "message", listener: (event: MessageEvent<JavaScriptWorkerResponse>) => void) {
    this.listener = listener;
  }

  removeEventListener() {
    this.listener = undefined;
  }
}

describe("JavaScriptRunner protocol", () => {
  it("sends initialize and run messages to the worker", async () => {
    const worker = new FakeWorker();
    const runner = new JavaScriptRunner(() => worker);

    const result = await runner.run({ sourceCode: "console.log('ok')", stdin: "", timeoutMs: 1000 });

    expect(result.stdout).toBe("ok\n");
    expect(worker.messages.map((message) => message.type)).toEqual(["initialize", "run"]);
  });

  it("terminates and recreates the worker on timeout", async () => {
    vi.useFakeTimers();
    const workers = [new FakeWorker("none"), new FakeWorker("all")];
    const runner = new JavaScriptRunner(() => workers.shift() ?? new FakeWorker("all"));

    const runPromise = runner.run({ sourceCode: "while (true) {}", stdin: "", timeoutMs: 10 });
    await vi.runAllTimersAsync();
    const result = await runPromise;

    expect(result.status).toBe("timeout");
    expect(workers.length).toBe(0);
    vi.useRealTimers();
  });

  it("cleans up a cancelled run and executes on the recreated worker", async () => {
    const createdWorkers: FakeWorker[] = [];
    const runner = new JavaScriptRunner(() => {
      const worker = new FakeWorker(createdWorkers.length === 0 ? "initialize-only" : "all");
      createdWorkers.push(worker);
      return worker;
    });

    const runPromise = runner.run({ sourceCode: "while (true) {}", stdin: "", timeoutMs: 1000 });
    await vi.waitFor(() => expect(createdWorkers[0].messages.map((message) => message.type)).toContain("run"));

    await runner.cancel();
    const cancelledResult = await runPromise;
    const recoveredResult = await runner.run({ sourceCode: "console.log('ok')", stdin: "", timeoutMs: 1000 });

    expect(cancelledResult.status).toBe("cancelled");
    expect(createdWorkers[0].terminated).toBe(true);
    expect(createdWorkers[0].listener).toBeUndefined();
    expect(recoveredResult.status).toBe("success");
    expect(recoveredResult.stdout).toBe("ok\n");
    expect(createdWorkers).toHaveLength(2);
  });
});
