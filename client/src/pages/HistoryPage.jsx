// src/pages/HistoryPage.jsx
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/header/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistoryProblems } from "@/components/history/HistoryProblems"
import { HistoryAiFeatures } from "@/components/history/HistoryAiFeatures"

export default function HistoryPage() {
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
  )
}
