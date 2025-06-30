import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CodeEditor from "@/components/codeEditor/CodeEditor";
import AiResponseViewer from "@/components/aiResponse/AiResponseViewer";
import { useRef, useState } from "react";

export default function FeaturePage({ featureName }) {
  const [aiResponse, setAiResponse] = useState({
    title: "Code Conversion: JavaScript to Python",
    convertedCode: "def sum(a, b):\n    return a + b",
    conversionNotes: "Function syntax changed, semicolons removed.",
    languageTips: ["Python uses indentation instead of braces", "No need for variable declaration"],
  });

  const responseRef = useRef(null); // ref to scroll to AI response

  const handleRunAI = async (code, language) => {
    setTimeout(() => {
      responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ code, language, featureType: featureName }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setAiResponse(data.output);

      // Scroll to AI response after a short delay
    } catch (err) {
      setAiResponse({ error: "AI failed to respond." });
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
                <h1 className="text-2xl font-bold tracking-tight">{featureName}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Use AI to assist with {featureName.toLowerCase()}.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <div className="mt-6">
                  <CodeEditor onRun={handleRunAI} />
                </div>
              </div>
            </div>

            {/* Response Section with scroll target */}
            <div ref={responseRef}>
              <AiResponseViewer response={aiResponse} featureType={featureName} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
