import { describe, expect, it } from "vitest";
import { CommandSimulatorRunner } from "./CommandSimulatorRunner";

describe("CommandSimulatorRunner", () => {
  it("runs command scripts against the virtual terminal", async () => {
    const runner = new CommandSimulatorRunner();

    const result = await runner.run({ sourceCode: "echo hello\ntype README.txt", stdin: "", timeoutMs: 1000 });

    expect(result).toMatchObject({
      status: "success",
      stderr: "",
    });
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("Programming Trainer virtual command prompt");
  });

  it("does not expose host filesystem paths through command execution", async () => {
    const runner = new CommandSimulatorRunner();

    const result = await runner.run({ sourceCode: "type C:\\Users\\user\\secret.txt", stdin: "", timeoutMs: 1000 });

    expect(result.status).toBe("runtime_error");
    expect(result.stderr).toContain("File not found in virtual filesystem");
    expect(result.stdout).toBe("");
  });

  it("resets virtual state back to the initial directory and history", async () => {
    const runner = new CommandSimulatorRunner();

    await runner.run({ sourceCode: "cd projects\necho changed", stdin: "", timeoutMs: 1000 });
    await runner.reset();

    const snapshot = runner.getSnapshot();
    expect(snapshot.cwd).toBe("C:\\Users\\student");
    expect(snapshot.history).toEqual([]);
  });

  it("returns timeout for scripts over the foundation line limit", async () => {
    const runner = new CommandSimulatorRunner();
    const sourceCode = Array.from({ length: 201 }, () => "echo x").join("\n");

    const result = await runner.run({ sourceCode, stdin: "", timeoutMs: 1000 });

    expect(result.status).toBe("timeout");
    expect(result.stderr).toContain("200 line foundation limit");
  });
});
