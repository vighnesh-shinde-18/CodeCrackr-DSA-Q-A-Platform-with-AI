import React from "react";

export default function ExplainCodeViewer({ response }) {
  const {
    title,
    summary,
    lineByLineExplanation,
    importantFunctions,
    controlFlow,
    edgeCases,
  } = response;

  return (
    <div className="m-6 border rounded bg-white dark:bg-black dark:border-gray-700 p-6 shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>

      <p className="text-gray-700 dark:text-gray-300"><strong>Summary:</strong> {summary}</p>
      <p className="text-gray-700 dark:text-gray-300"><strong>Control Flow:</strong> {controlFlow}</p>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Line-by-Line Explanation</h3>
        <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
          {lineByLineExplanation.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Important Functions</h3>
        <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
          {importantFunctions.map((func, i) => <li key={i}>{func}</li>)}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Edge Cases</h3>
        <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
          {edgeCases.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>
    </div>
  );
}
