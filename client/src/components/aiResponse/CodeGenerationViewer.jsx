import React from "react";
import CodeOutputBlock from "./CodeOutputBlock";

export default function CodeGenerationViewer({ response }) {
  const { title, generatedCode, codeExplanation, importantSteps } = response;

  return (
    <div className="m-6 border rounded bg-white dark:bg-black dark:border-gray-700 p-6 shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Generated Code</h3>
        <CodeOutputBlock code={generatedCode} language="javascript" />
      </div>

      <p className="text-gray-700 dark:text-gray-300">
        <strong>Explanation:</strong> {codeExplanation}
      </p>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Important Steps</h3>
        <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
          {importantSteps.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
      </div>
    </div>
  );
}
