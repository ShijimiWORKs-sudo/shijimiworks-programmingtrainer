import { describe, expect, it } from "vitest";
import { createVirtualPowerShellState, runPowerShellLine, runPowerShellScript } from "./virtualPowerShell";

describe("virtual PowerShell", () => {
  it("lists and reads only files from the virtual filesystem", () => {
    const state = createVirtualPowerShellState({
      entries: {
        "C:\\": { type: "directory" },
        "C:\\Users": { type: "directory" },
        "C:\\Users\\student": { type: "directory" },
        "C:\\Users\\student\\hello.txt": { type: "file", content: "virtual only\n" },
      },
    });

    const listed = runPowerShellLine(state, "Get-ChildItem");
    const read = runPowerShellLine(listed.state, "Get-Content hello.txt");

    expect(listed.stdout).toContain("Directory: C:\\Users\\student");
    expect(listed.stdout).toContain("hello.txt");
    expect(read).toMatchObject({ exitCode: 0, stdout: "virtual only\n", stderr: "" });
  });

  it("treats host-looking paths as virtual paths and never reads the host filesystem", () => {
    const state = createVirtualPowerShellState();
    const result = runPowerShellLine(state, "Get-Content C:\\Users\\user\\secret.txt");

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("virtual PowerShell filesystem");
    expect(result.stderr).toContain("C:\\Users\\user\\secret.txt");
  });

  it("tracks location and command history in virtual state", () => {
    const state = createVirtualPowerShellState();
    const changed = runPowerShellLine(state, "Set-Location scripts");
    const location = runPowerShellLine(changed.state, "Get-Location");
    const history = runPowerShellLine(location.state, "Get-History");

    expect(changed.state.cwd).toBe("C:\\Users\\student\\scripts");
    expect(location.stdout).toBe("C:\\Users\\student\\scripts\n");
    expect(history.stdout).toContain("1  Set-Location scripts");
    expect(history.stdout).toContain("3  Get-History");
  });

  it("supports common beginner aliases without invoking host PowerShell", () => {
    const result = runPowerShellScript("pwd\nls\ntype notes.txt\necho hello");

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("C:\\Users\\student");
    expect(result.stdout).toContain("README.txt");
    expect(result.stdout).toContain("Use Get-ChildItem");
    expect(result.stdout).toContain("hello");
  });

  it("filters and selects virtual file entries through a pipeline", () => {
    const result = runPowerShellScript("Get-ChildItem | Where-Object Name -Like *.txt | Select-Object Name");

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("README.txt");
    expect(result.stdout).toContain("notes.txt");
    expect(result.stdout).not.toContain("scripts");
  });

  it("measures filtered pipeline output", () => {
    const result = runPowerShellScript("Get-ChildItem | Where-Object Type -eq file | Measure-Object");

    expect(result).toMatchObject({ exitCode: 0, stdout: "Count: 2\n", stderr: "" });
  });

  it("creates directories and writes files inside the virtual filesystem", () => {
    const result = runPowerShellScript("New-Item -ItemType Directory -Path reports\nSet-Content -Path reports\\summary.txt -Value ready");

    expect(result.exitCode).toBe(0);
    expect(result.state.entries["C:\\Users\\student\\reports"]).toEqual({ type: "directory" });
    expect(result.state.entries["C:\\Users\\student\\reports\\summary.txt"]).toEqual({ type: "file", content: "ready\n" });
  });

  it("copies, moves, and removes entries without touching host files", () => {
    const result = runPowerShellScript(
      "Set-Content -Path draft.txt -Value draft\nCopy-Item draft.txt backup.txt\nMove-Item draft.txt final.txt\nRemove-Item backup.txt"
    );

    expect(result.exitCode).toBe(0);
    expect(result.state.entries["C:\\Users\\student\\final.txt"]).toEqual({ type: "file", content: "draft\n" });
    expect(result.state.entries["C:\\Users\\student\\draft.txt"]).toBeUndefined();
    expect(result.state.entries["C:\\Users\\student\\backup.txt"]).toBeUndefined();
  });

  it("reports unsupported pipeline commands without changing virtual state", () => {
    const state = createVirtualPowerShellState();
    const result = runPowerShellLine(state, "Get-ChildItem | Remove-Item");

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("not recognized in the virtual PowerShell pipeline");
    expect(result.state.entries["C:\\Users\\student\\README.txt"]).toBeDefined();
  });
});
