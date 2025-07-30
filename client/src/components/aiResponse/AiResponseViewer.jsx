// src/components/aiResponse/AiResponseViewer.jsx
import React from "react";

// Import all specific viewer components
import CodeDebugViewer from "./CodeDebugViewer";
import CodeGenerationViewer from "./CodeGenerationViewer";
import CodeReviewViewer from "./CodeReviewViewer";
import ConvertCodeViewer from "./ConvertCodeViewer";
import ExplainCodeViewer from "./ExplainCodeViewer";
import TestCasesViewer from "./TestCasesViewer";

export default function AiResponseViewer({ response, featureType, isHistory = false }) {
  if (!response || Object.keys(response).length === 0) return null;

  if (!featureType) {
    return (
      <div className="p-4 rounded bg-red-100 text-red-700">
        Feature type is missing.
      </div>
    );
  }

  let parsedResponse;
  try {
    parsedResponse = typeof response === "string" ? JSON.parse(response) : response;
  } catch (err) {
    return (
      <div className="mt-4 p-3 rounded bg-red-100 text-red-600 text-sm">
        Invalid AI response format
      </div>
    );
  }

  const renderViewer = () => {
    switch (featureType) {
      case "debug":
        return <CodeDebugViewer response={parsedResponse} />;
      case "generate":
        return <CodeGenerationViewer response={parsedResponse} />;
      case "review":
        return <CodeReviewViewer response={parsedResponse} />;
      case "convert":
        return <ConvertCodeViewer response={parsedResponse} />;
      case "explain":
        return <ExplainCodeViewer response={parsedResponse} />;
      case "testcases":
        return <TestCasesViewer response={parsedResponse} />;
      default:
        return (
          <div className="mt-4 p-3 rounded bg-yellow-100 text-yellow-700 text-sm">
            Unknown feature type: {featureType}
          </div>
        );
    }
  };

  return isHistory ? (
    <div className="m-6 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Response</h2>
      {renderViewer()}
    </div>
  ) : (
   <>
   {renderViewer()}
   </> 
  );
}
