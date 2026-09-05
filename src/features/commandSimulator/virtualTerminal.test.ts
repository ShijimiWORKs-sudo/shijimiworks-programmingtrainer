import { describe, expect, it } from "vitest";
import { createVirtualTerminalState, runCommandLine, runCommandScript } from "./virtualTerminal";

describe("virtual command terminal", () => {
  it("lists and reads only files from the virtual filesystem", () => {
    const state = createVirtualTerminalState({
      entries: {
        "C:\\": { type: "directory" },
        "C:\\Users": { type: "directory" },
        "C:\\Users\\student": { type: "directory" },
        "C:\\Users\\student\\hello.txt": { type: "file", content: "virtual only\n" },
      },
    });

    const listed = runCommandLine(state, "dir");
    const typed = runCommandLine(listed.state, "type hello.txt");

    expect(listed.stdout).toContain("hello.txt");
    expect(typed).toMatchObject({ exitCode: 0, stdout: "virtual only\n", stderr: "" });
  });

  it("treats host-looking paths as virtual paths and never reads the host filesystem", () => {
    const state = createVirtualTerminalState();
    const result = runCommandLine(state, "type C:\\Users\\user\\secret.txt");

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("File not found in virtual filesystem");
    expect(result.stderr).toContain("C:\\Users\\user\\secret.txt");
  });

  it("tracks cwd and command history in virtual state", () => {
    const state = createVirtualTerminalState();
    const changed = runCommandLine(state, "cd projects");
    const cwd = runCommandLine(changed.state, "cd");
    const history = runCommandLine(cwd.state, "history");

    expect(changed.state.cwd).toBe("C:\\Users\\student\\projects");
    expect(cwd.stdout).toBe("C:\\Users\\student\\projects\n");
    expect(history.stdout).toContain("1: cd projects");
    expect(history.stdout).toContain("3: history");
  });

  it("deletes files inside the virtual filesystem", () => {
    const state = createVirtualTerminalState();
    const result = runCommandLine(state, "del README.txt");

    expect(result.exitCode).toBe(0);
    expect(result.state.entries["C:\\Users\\student\\README.txt"]).toBeUndefined();
  });

  it("creates files with echo redirection inside the virtual filesystem", () => {
    const state = createVirtualTerminalState();
    const result = runCommandLine(state, "echo report ready > report.txt");

    expect(result.exitCode).toBe(0);
    expect(result.state.entries["C:\\Users\\student\\report.txt"]).toEqual({ type: "file", content: "report ready\n" });
  });

  it("creates directories and copies files without touching the host filesystem", () => {
    const state = createVirtualTerminalState();
    const directory = runCommandLine(state, "mkdir archive");
    const copied = runCommandLine(directory.state, "copy C:\\Users\\student\\README.txt archive\\README-copy.txt");

    expect(copied.exitCode).toBe(0);
    expect(copied.stdout).toContain("copied");
    expect(copied.state.entries["C:\\Users\\student\\archive"]).toEqual({ type: "directory" });
    expect(copied.state.entries["C:\\Users\\student\\archive\\README-copy.txt"]).toEqual(state.entries["C:\\Users\\student\\README.txt"]);
  });

  it("moves files and leaves the old virtual path absent", () => {
    const state = createVirtualTerminalState({
      entries: {
        "C:\\": { type: "directory" },
        "C:\\Users": { type: "directory" },
        "C:\\Users\\student": { type: "directory" },
        "C:\\Users\\student\\draft.txt": { type: "file", content: "draft\n" },
      },
    });

    const result = runCommandLine(state, "move draft.txt final.txt");

    expect(result.exitCode).toBe(0);
    expect(result.state.entries["C:\\Users\\student\\draft.txt"]).toBeUndefined();
    expect(result.state.entries["C:\\Users\\student\\final.txt"]).toEqual({ type: "file", content: "draft\n" });
  });

  it("removes only empty virtual directories", () => {
    const state = createVirtualTerminalState();
    const created = runCommandLine(state, "mkdir empty");
    const removed = runCommandLine(created.state, "rmdir empty");
    const withFile = runCommandLine(created.state, "echo keep > empty\\keep.txt");
    const nonEmpty = runCommandLine(withFile.state, "rmdir empty");

    expect(removed.exitCode).toBe(0);
    expect(removed.state.entries["C:\\Users\\student\\empty"]).toBeUndefined();
    expect(nonEmpty.exitCode).toBe(1);
    expect(nonEmpty.stderr).toContain("not empty");
  });

  it("runs multi-line command scripts against virtual state", () => {
    const result = runCommandScript("echo hello\ndir\ntype notes.txt");

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("hello");
    expect(result.stdout).toContain("README.txt");
    expect(result.stdout).toContain("Use dir, cd, type, echo");
    expect(result.state.history).toEqual(["echo hello", "dir", "type notes.txt"]);
  });
});
