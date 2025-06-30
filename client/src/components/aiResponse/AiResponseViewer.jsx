// src/components/ai-response/AiResponseViewer.jsx
import React from "react";

const Section = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
    <div className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{children}</div>
  </div>
);

export default function AiResponseViewer({ response, featureType }) {
  if (!response || Object.keys(response).length === 0) return null;

  try {
    const parsed = typeof response === "string" ? JSON.parse(response) : response;

    return (
      <div className="m-6  border border-gray-300 rounded-lg bg-white shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">AI Response</h2>

        {Object.entries(parsed).map(([key, value]) => (
          <Section key={key} title={key.replace(/([A-Z])/g, " $1")}>
            {Array.isArray(value)
              ? value.map((item, idx) => <div key={idx}>• {item}</div>)
              : <pre className="bg-gray-100 mx-3 p-2 rounded-md overflow-x-auto">{value}</pre>}
          </Section>
        ))}
      </div>
    );
  } catch (err) {
    return (
      <div className="mt-4 p-3 rounded bg-red-100 text-red-600 text-sm">
        Invalid AI response format
      </div>
    );
  }
}
