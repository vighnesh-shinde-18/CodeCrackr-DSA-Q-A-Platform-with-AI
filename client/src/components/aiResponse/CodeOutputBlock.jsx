// src/components/aiResponse/CodeOutputBlock.jsx
import React from "react";
import Editor from "@monaco-editor/react";
import CopyButton from "./CopyButton";

export default function CodeOutputBlock({ code = "", language = "javascript", height = "300px" }) {
  return (
    <div className="relative my-4 border rounded-md overflow-hidden shadow-sm dark:border-gray-700">
      {/* Floating Copy Button */}
      <div className="absolute top-2 right-2 z-10">
        <CopyButton content={code} />
      </div>

      {/* Monaco Code Viewer */}
      <Editor
        height={height}
        defaultLanguage={language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
        }}
      />
    </div>
  );
}
