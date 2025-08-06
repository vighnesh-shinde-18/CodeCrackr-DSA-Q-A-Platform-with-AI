import React, { useMemo } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryProblems } from "@/components/history/HistoryProblems";
import { HistoryAiFeatures } from "@/components/history/HistoryAiFeatures";

const HistoryPage = () => {
  const sidebarStyle = useMemo(() => ({
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  }), []);

  return (
    <SidebarProvider style={sidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">History</h2>
          <Tabs defaultValue="problems" className="space-y-4">
            <TabsList>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="ai">AI Features</TabsTrigger>
            </TabsList>

            <TabsContent value="problems">
              <HistoryProblems />
            </TabsContent>
            <TabsContent value="ai">
              <HistoryAiFeatures />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default React.memo(HistoryPage);
