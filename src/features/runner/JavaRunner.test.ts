import { describe, expect, it, vi } from "vitest";
import { JavaRunner, type JavaWorkerRequest, type JavaWorkerResponse } from ".";

type FakeWorkerMode = "all" | "none" | "initialize-only";

class FakeWorker {
  messages: JavaWorkerRequest[] = [];
  terminated = false;
  listener: ((event: MessageEvent<JavaWorkerResponse>) => void) | undefined;

  constructor(private readonly mode: FakeWorkerMode = "all") {}

  postMessage(message: JavaWorkerRequest) {
    this.messages.push(message);
    if (this.mode === "none" || (this.mode === "initialize-only" && message.type === "run")) {
      return;
    }
    const response: JavaWorkerResponse =
      message.type === "run"
        ? {
            id: message.id,
            type: "run-result",
            result: { status: "success", stdout: "ok\n", stderr: "", durationMs: 1 },
          }
        : { id: message.id, type: message.type === "initialize" ? "initialized" : "reset-done" };
    window.setTimeout(() => this.listener?.({ data: response } as MessageEvent<JavaWorkerResponse>), 0);
  }

  terminate() {
    this.terminated = true;
  }

  addEventListener(_type: "message", listener: (event: MessageEvent<JavaWorkerResponse>) => void) {
    this.listener = listener;
  }

  removeEventListener() {
    this.listener = undefined;
  }
}

describe("JavaRunner protocol", () => {
  it("sends initialize and run messages to the worker", async () => {
    const worker = new FakeWorker();
    const runner = new JavaRunner(() => worker);

    const result = await runner.run({
      sourceCode: "public class Main { public static void main(String[] args) { System.out.println(\"ok\"); } }",
      stdin: "",
      timeoutMs: 1000,
    });

    expect(result.stdout).toBe("ok\n");
    expect(worker.messages.map((message) => message.type)).toEqual(["initialize", "run"]);
  });

  it("terminates and recreates the worker on timeout", async () => {
    vi.useFakeTimers();
    const workers = [new FakeWorker("none"), new FakeWorker("all")];
    const runner = new JavaRunner(() => workers.shift() ?? new FakeWorker("all"));

    const runPromise = runner.run({
      sourceCode: "public class Main { public static void main(String[] args) { while (true) {} } }",
      stdin: "",
      timeoutMs: 10,
    });
    await vi.runAllTimersAsync();
    const result = await runPromise;

    expect(result.status).toBe("timeout");
    expect(workers.length).toBe(0);
    vi.useRealTimers();
  });

  it("cleans up a cancelled run and executes on the recreated worker", async () => {
    const createdWorkers: FakeWorker[] = [];
    const runner = new JavaRunner(() => {
      const worker = new FakeWorker(createdWorkers.length === 0 ? "initialize-only" : "all");
      createdWorkers.push(worker);
      return worker;
    });

    const runPromise = runner.run({
      sourceCode: "public class Main { public static void main(String[] args) { while (true) {} } }",
      stdin: "",
      timeoutMs: 1000,
    });
    await vi.waitFor(() => expect(createdWorkers[0].messages.map((message) => message.type)).toContain("run"));

    await runner.cancel();
    const cancelledResult = await runPromise;
    const recoveredResult = await runner.run({
      sourceCode: "public class Main { public static void main(String[] args) { System.out.println(\"ok\"); } }",
      stdin: "",
      timeoutMs: 1000,
    });

    expect(cancelledResult.status).toBe("cancelled");
    expect(createdWorkers[0].terminated).toBe(true);
    expect(createdWorkers[0].listener).toBeUndefined();
    expect(recoveredResult.status).toBe("success");
    expect(recoveredResult.stdout).toBe("ok\n");
    expect(createdWorkers).toHaveLength(2);
  });
});
