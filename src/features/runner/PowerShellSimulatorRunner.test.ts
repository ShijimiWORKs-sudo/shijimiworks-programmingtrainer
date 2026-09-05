import { describe, expect, it } from "vitest";
import { PowerShellSimulatorRunner } from "./PowerShellSimulatorRunner";

describe("PowerShellSimulatorRunner", () => {
  it("runs PowerShell-like scripts against the virtual environment", async () => {
    const runner = new PowerShellSimulatorRunner();

    const result = await runner.run({ sourceCode: "Write-Output hello\nGet-Content README.txt", stdin: "", timeoutMs: 1000 });

    expect(result).toMatchObject({
      status: "success",
      stderr: "",
    });
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("Programming Trainer virtual PowerShell");
  });

  it("does not expose host filesystem paths through PowerShell execution", async () => {
    const runner = new PowerShellSimulatorRunner();

    const result = await runner.run({ sourceCode: "Get-Content C:\\Users\\user\\secret.txt", stdin: "", timeoutMs: 1000 });

    expect(result.status).toBe("runtime_error");
    expect(result.stderr).toContain("virtual PowerShell filesystem");
    expect(result.stdout).toBe("");
  });

  it("resets virtual state back to the initial location and history", async () => {
    const runner = new PowerShellSimulatorRunner();

    await runner.run({ sourceCode: "Set-Location scripts\nWrite-Output changed", stdin: "", timeoutMs: 1000 });
    await runner.reset();

    const snapshot = runner.getSnapshot();
    expect(snapshot.cwd).toBe("C:\\Users\\student");
    expect(snapshot.history).toEqual([]);
  });

  it("runs safe PowerShell pipelines against virtual entries", async () => {
    const runner = new PowerShellSimulatorRunner();

    const result = await runner.run({
      sourceCode: "Get-ChildItem | Where-Object Name -Like *.txt | Select-Object Name",
      stdin: "",
      timeoutMs: 1000,
    });

    expect(result.status).toBe("success");
    expect(result.stdout).toContain("README.txt");
    expect(result.stdout).toContain("notes.txt");
    expect(result.stdout).not.toContain("scripts");
  });

  it("keeps file mutations inside the virtual PowerShell snapshot", async () => {
    const runner = new PowerShellSimulatorRunner();

    const result = await runner.run({
      sourceCode: "New-Item -ItemType Directory -Path reports\nSet-Content -Path reports\\summary.txt -Value ready",
      stdin: "",
      timeoutMs: 1000,
    });

    const snapshot = runner.getSnapshot();
    expect(result.status).toBe("success");
    expect(snapshot.entries["C:\\Users\\student\\reports\\summary.txt"]).toEqual({ type: "file", content: "ready\n" });
  });

  it("returns timeout for scripts over the foundation line limit", async () => {
    const runner = new PowerShellSimulatorRunner();
    const sourceCode = Array.from({ length: 201 }, () => "Write-Output x").join("\n");

    const result = await runner.run({ sourceCode, stdin: "", timeoutMs: 1000 });

    expect(result.status).toBe("timeout");
    expect(result.stderr).toContain("200 line foundation limit");
  });
});
