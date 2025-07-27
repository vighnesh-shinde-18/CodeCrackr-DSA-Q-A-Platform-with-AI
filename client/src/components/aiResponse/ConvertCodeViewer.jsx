import React from "react";
import CodeOutputBlock from "./CodeOutputBlock";

export default function ConvertCodeViewer({ response }) {
  const { title, convertedCode, conversionNotes, languageTips } = response;

  return (
    <div className="m-6 border rounded bg-white dark:bg-black dark:border-gray-700 p-6 shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Converted Code</h3>
        <CodeOutputBlock code={convertedCode} language="javascript" />
      </div>

      <p className="text-gray-700 dark:text-gray-300"><strong>Conversion Notes:</strong> {conversionNotes}</p>

      <div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Language Tips</h3>
        <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
          {languageTips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>
    </div>
  );
}
