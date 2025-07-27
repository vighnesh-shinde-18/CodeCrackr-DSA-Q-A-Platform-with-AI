// pages/AIFeaturePage.jsx
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CodeEditor from "@/components/codeEditor/CodeEditor";
import { useRef, useState, useEffect } from "react";

// Dynamic imports
import AiResponseViewer from "@/components/aiResponse/AiResponseViewer";
import CodeDebugViewer from "@/components/aiResponse/CodeDebugViewer";
import CodeReviewViewer from "@/components/aiResponse/CodeReviewViewer";
import CodeGenerationViewer from "@/components/aiResponse/CodeGenerationViewer";
import ConvertCodeViewer from "@/components/aiResponse/ConvertCodeViewer";
import ExplainCodeViewer from "@/components/aiResponse/ExplainCodeViewer";
import TestCasesViewer from "@/components/aiResponse/TestCasesViewer";

const typeToName = {
  codeDebugging: "Debug Code",
  codeReview: "Review & Optimize Code",
  codeGeneration: "Generate Code",
  convertCode: "Convert Code",
  explainCode: "Explain Code",
  generateTestCases: "Generate Test Cases",
};

const viewerMap = {
  codeDebugging: CodeDebugViewer,
  codeReview: CodeReviewViewer,
  codeGeneration: CodeGenerationViewer,
  convertCode: ConvertCodeViewer,
  explainCode: ExplainCodeViewer,
  generateTestCases: TestCasesViewer,
};

export default function AIFeaturePage({ featureName }) {
  const [aiResponse, setAiResponse] = useState(null);
  const responseRef = useRef(null);
  const FeatureViewer = viewerMap[featureName] || AiResponseViewer;

  // ✅ Smooth scroll on AI response update
  useEffect(() => {
    if (aiResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [aiResponse]);

  const handleRunAI = async (code, language) => {
    try {
      const res = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          featureType: featureName,
          userInput: code,
          targetLanguage: language || "",
        }),
      });

      const result = await res.json();
      console.log("✅ AI Output:", result);

      if (!res.ok || !result.success) {
        console.error("❌ AI Error:", result.message || "Failed to generate AI response");
        return;
      }

      setAiResponse(result.data);
    } catch (err) {
      console.error("❌ Request Error:", err);
    }
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">{typeToName[featureName]}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Use AI to assist to {typeToName[featureName].toLowerCase()}.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <div className="mt-6">
                  <CodeEditor onRun={handleRunAI} />
                </div>
              </div>
            </div>

            <div ref={responseRef}>
              {aiResponse && (
                <FeatureViewer response={aiResponse} featureType={featureName} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
