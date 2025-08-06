import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CodeEditor from "@/components/codeEditor/CodeEditor";

import AiResponseViewer from "@/components/aiResponse/AiResponseViewer";
import CodeDebugViewer from "@/components/aiResponse/CodeDebugViewer";
import CodeReviewViewer from "@/components/aiResponse/CodeReviewViewer";
import CodeGenerationViewer from "@/components/aiResponse/CodeGenerationViewer";
import ConvertCodeViewer from "@/components/aiResponse/ConvertCodeViewer";
import ExplainCodeViewer from "@/components/aiResponse/ExplainCodeViewer";
import TestCasesViewer from "@/components/aiResponse/TestCasesViewer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AIFeaturePage({ featureName }) {
  const [aiResponse, setAiResponse] = useState(null);
  const responseRef = useRef(null);

  const typeToName = useMemo(() => ({
    codeDebugging: "Debug Code",
    codeReview: "Review & Optimize Code",
    codeGeneration: "Generate Code",
    convertCode: "Convert Code",
    explainCode: "Explain Code",
    generateTestCases: "Generate Test Cases",
  }), []);

  const viewerMap = useMemo(() => ({
    codeDebugging: CodeDebugViewer,
    codeReview: CodeReviewViewer,
    codeGeneration: CodeGenerationViewer,
    convertCode: ConvertCodeViewer,
    explainCode: ExplainCodeViewer,
    generateTestCases: TestCasesViewer,
  }), []);

  const FeatureViewer = viewerMap[featureName] || AiResponseViewer;

  useEffect(() => {
    if (aiResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [aiResponse]);

  const handleRunAI = useCallback(async (code, language) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/ai/generate`,
        {
          featureType: featureName,
          userInput: code,
          targetLanguage: language || "",
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.data.success) {
        console.error("❌ AI Error:", res.data.message || "Failed to generate AI response");
        return;
      }

      setAiResponse(res.data.data);
    } catch (err) {
      console.error("❌ Request Error:", err);
    }
  }, [featureName]);

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
                <h1 className="text-2xl font-bold tracking-tight">
                  {typeToName[featureName]}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Use AI to assist to {typeToName[featureName]?.toLowerCase()}.
                </p>
              </div>

              <div className="px-4 lg:px-6 mt-6">
                <CodeEditor onRun={handleRunAI} />
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
