import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

loader.config({ monaco });

interface CodeEditorProps {
  value: string;
  fontSize: number;
  tabSize: number;
  readOnly?: boolean;
  onChange(value: string): void;
}

export function CodeEditor({ value, fontSize, tabSize, readOnly = false, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language="python"
      theme="vs-dark"
      value={value}
      onChange={(nextValue) => onChange(nextValue ?? "")}
      options={{
        automaticLayout: true,
        fontSize,
        tabSize,
        insertSpaces: true,
        lineNumbers: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        ariaLabel: "Python code editor",
        readOnly,
      }}
    />
  );
}
