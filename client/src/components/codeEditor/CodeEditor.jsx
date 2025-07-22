// src/components/code-editor/CodeEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, RotateCcw, Play } from 'lucide-react';

const CodeEditor = ({ onRun }) => {
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  const [code, setCode] = useState('// Write your solution here...');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'go', label: 'Go' },
    { value: 'javascript', label: 'Javascript' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'php', label: 'PHP' },
    { value: 'r', label: 'R' },
    { value: 'rust', label: 'Rust' },
    { value: 'scala', label: 'Scala' },
    { value: 'sql', label: 'SQL' },
    { value: 'swift', label: 'Swift' },
    { value: 'typescript', label: 'Typescript' },
    { value: 'csharp', label: 'C#' },
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
    script.onload = () => {
      window.require.config({
        paths: {
          vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs',
        },
      });

      window.require(['vs/editor/editor.main'], () => {
        initializeEditor();
      });
    };
    document.head.appendChild(script);

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  const initializeEditor = () => {
    if (monacoRef.current && window.monaco) {
      const editor = window.monaco.editor.create(monacoRef.current, {
        value: code,
        language,
        theme: 'vs-dark', // ✅ Use a dark theme with syntax colors
        fontSize,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      });

      editor.onDidChangeModelContent(() => {
        setCode(editor.getValue());
      });

      editorRef.current = editor;
    }
  };

  useEffect(() => {
    if (editorRef.current && window.monaco) {
      window.monaco.editor.setModelLanguage(editorRef.current.getModel(), language);
    }
  }, [language]);

  useEffect(() => {
    if (editorRef.current && window.monaco) {
      editorRef.current.updateOptions({ fontSize });
    }
  }, [fontSize]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const handleReset = () => {
    setCode('// Write your solution here...');
    if (editorRef.current) {
      editorRef.current.setValue('// Write your fycking solution here...');
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun(code, language);
    }
  };

  return (
    <div className="bg-white border rounded-md shadow-sm p-4 space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <div className="flex gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border text-sm rounded-md px-3 py-1 focus:outline-none bg-white text-black"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="border text-sm rounded-md px-3 py-1 focus:outline-none bg-white text-black"
          >
            {[12, 14, 16, 18].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition"
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <Check size={14} /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy size={14} /> Copy
              </span>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1 rounded-md text-sm bg-yellow-100 hover:bg-yellow-200 transition flex items-center gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={handleRun}
            className="px-4 py-1 rounded-md text-sm bg-green-600 hover:bg-green-700 text-white transition flex items-center gap-1"
          >
            <Play size={14} />
            Run Code
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={monacoRef}
        className="rounded-md border h-[400px] w-full overflow-hidden"
      />
    </div>
  );
};

export default CodeEditor;
