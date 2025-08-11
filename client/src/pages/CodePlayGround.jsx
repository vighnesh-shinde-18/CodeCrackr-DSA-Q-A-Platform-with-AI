"use client";

import React, { useState, useMemo } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Available languages: backend value + Monaco editor value
const LANGUAGES = [
  { value: "cpp", label: "C++", monaco: "cpp" },
  { value: "c", label: "C", monaco: "c" },
  { value: "python", label: "Python", monaco: "python" },
  { value: "java", label: "Java", monaco: "java" },
  { value: "javascript", label: "JavaScript", monaco: "javascript" },
  { value: "typescript", label: "TypeScript", monaco: "typescript" },
  { value: "csharp", label: "C#", monaco: "csharp" },
  { value: "go", label: "Go", monaco: "go" },
  { value: "php", label: "PHP", monaco: "php" },
  { value: "ruby", label: "Ruby", monaco: "ruby" },
  { value: "swift", label: "Swift", monaco: "swift" },
  { value: "rust", label: "Rust", monaco: "rust" },
  { value: "sql", label: "SQL", monaco: "sql" },
];

const CodePlayGround = () => {
  const [language, setLanguage] = useState("cpp");
  const [sourceCode, setSourceCode] = useState("// Write your code here...");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const sidebarStyle = useMemo(
    () => ({
      "--sidebar-width": "calc(var(--spacing) * 72)",
      "--header-height": "calc(var(--spacing) * 12)",
    }),
    []
  );

  const runCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/playground/run`, {
        language,
        sourceCode,
        input,
      });
      setOutput(res.data.error ? res.data.error : res.data.output || "No output");
    } catch (err) {
      console.error(err);
      setOutput("Error running code");
    } finally {
      setLoading(false);
    }
  };

  const currentMonacoLang =
    LANGUAGES.find((lang) => lang.value === language)?.monaco || "plaintext";

  return (
    <SidebarProvider style={sidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col px-4 py-6 md:px-6 space-y-6">
          <h1 className="text-2xl font-bold">Code Playground</h1>

          {/* Language Selector */}
          <div>
            <label className="block font-medium mb-1">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border bg-white dark:bg-black p-2 rounded"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Monaco Code Editor */}
          <div className="border rounded overflow-hidden" style={{ height: "400px" }}>
            <Editor
              height="100%"
              language={currentMonacoLang}
              value={sourceCode}
              onChange={(value) => setSourceCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
              }}
            />
          </div>

          {/* Input Box */}
          <div>
            <label className="block font-medium mb-1">Custom Input (optional):</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 rounded w-full h-20 font-mono"
              placeholder="Enter input if required..."
            />
          </div>

          {/* Run Button */}
          <div>
            <button
              onClick={runCode}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {loading ? "Running..." : "Run Code"}
            </button>
          </div>

        {output &&  <div>
            <label className="block font-medium mt-4">Output:</label>
            <pre className="border p-2 rounded bg-white dark:bg-black whitespace-pre-wrap">
              {output}
            </pre>
          </div>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default React.memo(CodePlayGround);
