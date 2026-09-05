export interface VirtualFileEntry {
  type: "file";
  content: string;
}

export interface VirtualDirectoryEntry {
  type: "directory";
}

export type VirtualFileSystemEntry = VirtualFileEntry | VirtualDirectoryEntry;

export interface VirtualTerminalState {
  cwd: string;
  entries: Record<string, VirtualFileSystemEntry>;
  history: string[];
}

export interface VirtualCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  state: VirtualTerminalState;
}

const defaultCwd = "C:\\Users\\student";

const defaultEntries: Record<string, VirtualFileSystemEntry> = {
  "C:\\": { type: "directory" },
  "C:\\Users": { type: "directory" },
  "C:\\Users\\student": { type: "directory" },
  "C:\\Users\\student\\README.txt": {
    type: "file",
    content: "Welcome to the Programming Trainer virtual command prompt.\n",
  },
  "C:\\Users\\student\\notes.txt": {
    type: "file",
    content: "Use dir, cd, type, echo, help, cls, ver, and history.\n",
  },
  "C:\\Users\\student\\projects": { type: "directory" },
};

function cloneEntries(entries: Record<string, VirtualFileSystemEntry>) {
  return Object.fromEntries(Object.entries(entries).map(([path, entry]) => [normalizeVirtualPath(defaultCwd, path), { ...entry }]));
}

export function createVirtualTerminalState(seed?: Partial<VirtualTerminalState>): VirtualTerminalState {
  const entries = cloneEntries(seed?.entries ?? defaultEntries);
  const cwd = normalizeVirtualPath(defaultCwd, seed?.cwd ?? defaultCwd);
  return {
    cwd: entries[cwd]?.type === "directory" ? cwd : defaultCwd,
    entries,
    history: [...(seed?.history ?? [])],
  };
}

function trimTrailingSlash(path: string) {
  return path.length > 3 ? path.replace(/\\+$/g, "") : path;
}

export function normalizeVirtualPath(cwd: string, rawPath: string) {
  const value = rawPath.trim().replace(/^"(.*)"$/, "$1").replace(/\//g, "\\");
  const absolute = /^[A-Za-z]:\\/.test(value) ? value : `${trimTrailingSlash(cwd)}\\${value}`;
  const drive = absolute.slice(0, 2).toUpperCase();
  const parts = absolute
    .slice(3)
    .split("\\")
    .filter(Boolean)
    .reduce<string[]>((nextParts, part) => {
      if (part === ".") {
        return nextParts;
      }
      if (part === "..") {
        return nextParts.slice(0, -1);
      }
      return [...nextParts, part];
    }, []);

  return parts.length > 0 ? `${drive}\\${parts.join("\\")}` : `${drive}\\`;
}

function parseCommandLine(commandLine: string) {
  const tokens = [...commandLine.matchAll(/"([^"]*)"|(\S+)/g)].map((match) => match[1] ?? match[2]);
  const [command = "", ...args] = tokens;
  return { command: command.toLowerCase(), args };
}

function childNames(state: VirtualTerminalState, directory: string) {
  const prefix = trimTrailingSlash(directory) + "\\";
  const children = new Map<string, VirtualFileSystemEntry>();

  for (const [path, entry] of Object.entries(state.entries)) {
    if (path === directory || !path.startsWith(prefix)) {
      continue;
    }
    const [name] = path.slice(prefix.length).split("\\");
    const childPath = prefix + name;
    children.set(name, state.entries[childPath] ?? entry);
  }

  return [...children.entries()].sort(([left], [right]) => left.localeCompare(right));
}

function withHistory(state: VirtualTerminalState, commandLine: string): VirtualTerminalState {
  return { ...state, history: [...state.history, commandLine] };
}

export function runCommandLine(state: VirtualTerminalState, commandLine: string): VirtualCommandResult {
  const trimmed = commandLine.trim();
  if (!trimmed) {
    return { stdout: "", stderr: "", exitCode: 0, state };
  }

  const nextState = withHistory(state, trimmed);
  const { command, args } = parseCommandLine(trimmed);

  if (command === "help") {
    return {
      stdout: "Supported commands: dir, cd, type, echo, help, cls, ver, history\n",
      stderr: "",
      exitCode: 0,
      state: nextState,
    };
  }

  if (command === "ver") {
    return { stdout: "Programming Trainer Virtual Command 0.1\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "cls") {
    return { stdout: "", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "echo") {
    return { stdout: args.join(" ") + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "history") {
    return { stdout: nextState.history.map((entry, index) => `${index + 1}: ${entry}`).join("\n") + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "cd") {
    if (args.length === 0) {
      return { stdout: nextState.cwd + "\n", stderr: "", exitCode: 0, state: nextState };
    }
    const target = normalizeVirtualPath(nextState.cwd, args.join(" "));
    if (nextState.entries[target]?.type !== "directory") {
      return { stdout: "", stderr: `The system cannot find the path specified: ${target}\n`, exitCode: 1, state: nextState };
    }
    return { stdout: "", stderr: "", exitCode: 0, state: { ...nextState, cwd: target } };
  }

  if (command === "dir") {
    const target = args.length > 0 ? normalizeVirtualPath(nextState.cwd, args.join(" ")) : nextState.cwd;
    if (nextState.entries[target]?.type !== "directory") {
      return { stdout: "", stderr: `Directory not found in virtual filesystem: ${target}\n`, exitCode: 1, state: nextState };
    }
    const lines = childNames(nextState, target).map(([name, entry]) => (entry.type === "directory" ? `<DIR> ${name}` : name));
    return { stdout: ` Directory of ${target}\n\n${lines.join("\n")}${lines.length > 0 ? "\n" : ""}`, stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "type") {
    const target = normalizeVirtualPath(nextState.cwd, args.join(" "));
    const entry = nextState.entries[target];
    if (entry?.type !== "file") {
      return { stdout: "", stderr: `File not found in virtual filesystem: ${target}\n`, exitCode: 1, state: nextState };
    }
    return { stdout: entry.content, stderr: "", exitCode: 0, state: nextState };
  }

  if (["copy", "del", "erase", "mkdir", "move", "rmdir"].includes(command)) {
    return {
      stdout: "",
      stderr: `${command} is not available in the foundation simulator yet. File mutation is handled in the next checkpoint.\n`,
      exitCode: 1,
      state: nextState,
    };
  }

  return { stdout: "", stderr: `'${command}' is not recognized by the virtual command prompt.\n`, exitCode: 1, state: nextState };
}

export function runCommandScript(sourceCode: string, initialState = createVirtualTerminalState()): VirtualCommandResult {
  let state = initialState;
  let stdout = "";
  let stderr = "";
  let exitCode = 0;

  for (const line of sourceCode.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
    const result = runCommandLine(state, line);
    state = result.state;
    stdout += result.stdout;
    stderr += result.stderr;
    if (result.exitCode !== 0) {
      exitCode = result.exitCode;
    }
  }

  return { stdout, stderr, exitCode, state };
}
