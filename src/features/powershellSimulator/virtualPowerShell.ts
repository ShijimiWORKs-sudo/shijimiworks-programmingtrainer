export interface VirtualPowerShellFileEntry {
  type: "file";
  content: string;
}

export interface VirtualPowerShellDirectoryEntry {
  type: "directory";
}

export type VirtualPowerShellFileSystemEntry = VirtualPowerShellFileEntry | VirtualPowerShellDirectoryEntry;

export interface VirtualPowerShellState {
  cwd: string;
  entries: Record<string, VirtualPowerShellFileSystemEntry>;
  history: string[];
}

export interface VirtualPowerShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  state: VirtualPowerShellState;
}

const defaultCwd = "C:\\Users\\student";

const defaultEntries: Record<string, VirtualPowerShellFileSystemEntry> = {
  "C:\\": { type: "directory" },
  "C:\\Users": { type: "directory" },
  "C:\\Users\\student": { type: "directory" },
  "C:\\Users\\student\\README.txt": {
    type: "file",
    content: "Welcome to the Programming Trainer virtual PowerShell.\n",
  },
  "C:\\Users\\student\\notes.txt": {
    type: "file",
    content: "Use Get-ChildItem, Set-Location, Get-Content, Write-Output, Get-Help, and Get-History.\n",
  },
  "C:\\Users\\student\\scripts": { type: "directory" },
};

function trimTrailingSlash(path: string) {
  return path.length > 3 ? path.replace(/\\+$/g, "") : path;
}

export function normalizePowerShellPath(cwd: string, rawPath: string) {
  const value = rawPath.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").replace(/\//g, "\\");
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

function cloneEntries(entries: Record<string, VirtualPowerShellFileSystemEntry>) {
  return Object.fromEntries(Object.entries(entries).map(([path, entry]) => [normalizePowerShellPath(defaultCwd, path), { ...entry }]));
}

export function createVirtualPowerShellState(seed?: Partial<VirtualPowerShellState>): VirtualPowerShellState {
  const entries = cloneEntries(seed?.entries ?? defaultEntries);
  const cwd = normalizePowerShellPath(defaultCwd, seed?.cwd ?? defaultCwd);

  return {
    cwd: entries[cwd]?.type === "directory" ? cwd : defaultCwd,
    entries,
    history: [...(seed?.history ?? [])],
  };
}

function parsePowerShellLine(commandLine: string) {
  const tokens = [...commandLine.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((match) => match[1] ?? match[2] ?? match[3]);
  const [command = "", ...args] = tokens;
  return { command: command.toLowerCase(), args };
}

function withHistory(state: VirtualPowerShellState, commandLine: string): VirtualPowerShellState {
  return { ...state, history: [...state.history, commandLine] };
}

function childNames(state: VirtualPowerShellState, directory: string) {
  const prefix = trimTrailingSlash(directory) + "\\";
  const children = new Map<string, VirtualPowerShellFileSystemEntry>();

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

function commandTarget(args: string[]) {
  const positional = args.filter((arg) => !arg.startsWith("-"));
  return positional.join(" ");
}

export function runPowerShellLine(state: VirtualPowerShellState, commandLine: string): VirtualPowerShellResult {
  const trimmed = commandLine.trim();
  if (!trimmed) {
    return { stdout: "", stderr: "", exitCode: 0, state };
  }

  const nextState = withHistory(state, trimmed);
  const { command, args } = parsePowerShellLine(trimmed);

  if (command === "get-help" || command === "help") {
    return {
      stdout: "Supported commands: Get-ChildItem, Set-Location, Get-Location, Get-Content, Write-Output, Get-Help, Clear-Host, Get-History\n",
      stderr: "",
      exitCode: 0,
      state: nextState,
    };
  }

  if (command === "clear-host" || command === "cls") {
    return { stdout: "", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "write-output" || command === "echo") {
    return { stdout: args.join(" ") + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "get-history" || command === "history") {
    return { stdout: nextState.history.map((entry, index) => `${index + 1}  ${entry}`).join("\n") + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "get-location" || command === "pwd") {
    return { stdout: nextState.cwd + "\n", stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "set-location" || command === "cd") {
    const targetArg = commandTarget(args);
    if (!targetArg) {
      return { stdout: nextState.cwd + "\n", stderr: "", exitCode: 0, state: nextState };
    }
    const target = normalizePowerShellPath(nextState.cwd, targetArg);
    if (nextState.entries[target]?.type !== "directory") {
      return { stdout: "", stderr: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    return { stdout: "", stderr: "", exitCode: 0, state: { ...nextState, cwd: target } };
  }

  if (command === "get-childitem" || command === "ls" || command === "dir") {
    const targetArg = commandTarget(args);
    const target = targetArg ? normalizePowerShellPath(nextState.cwd, targetArg) : nextState.cwd;
    if (nextState.entries[target]?.type !== "directory") {
      return { stdout: "", stderr: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    const lines = childNames(nextState, target).map(([name, entry]) => (entry.type === "directory" ? `d---- ${name}` : `-a--- ${name}`));
    return { stdout: `Directory: ${target}\n\nMode  Name\n${lines.join("\n")}${lines.length > 0 ? "\n" : ""}`, stderr: "", exitCode: 0, state: nextState };
  }

  if (command === "get-content" || command === "cat" || command === "type") {
    const targetArg = commandTarget(args);
    const target = normalizePowerShellPath(nextState.cwd, targetArg);
    const entry = nextState.entries[target];
    if (entry?.type !== "file") {
      return { stdout: "", stderr: `Cannot find path '${target}' because it does not exist in the virtual PowerShell filesystem.\n`, exitCode: 1, state: nextState };
    }
    return { stdout: entry.content, stderr: "", exitCode: 0, state: nextState };
  }

  return { stdout: "", stderr: `${commandLine}: The term is not recognized in the virtual PowerShell environment.\n`, exitCode: 1, state: nextState };
}

export function runPowerShellScript(sourceCode: string, initialState = createVirtualPowerShellState()): VirtualPowerShellResult {
  let state = initialState;
  let stdout = "";
  let stderr = "";
  let exitCode = 0;

  for (const line of sourceCode.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
    const result = runPowerShellLine(state, line);
    state = result.state;
    stdout += result.stdout;
    stderr += result.stderr;
    if (result.exitCode !== 0) {
      exitCode = result.exitCode;
    }
  }

  return { stdout, stderr, exitCode, state };
}
