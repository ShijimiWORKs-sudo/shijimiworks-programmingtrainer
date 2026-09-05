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

  it("keeps file mutation commands unavailable in the foundation simulator", () => {
    const state = createVirtualTerminalState();
    const result = runCommandLine(state, "del README.txt");

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("not available in the foundation simulator yet");
    expect(result.state.entries["C:\\Users\\student\\README.txt"]).toEqual(state.entries["C:\\Users\\student\\README.txt"]);
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
