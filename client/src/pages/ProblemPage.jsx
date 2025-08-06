import React, { useMemo } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProblemTable } from "@/components/problem/ProblemTable";

const ProblemsPage = () => {
  const sidebarStyle = useMemo(() => ({
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  }), []);

  return (
    <SidebarProvider style={sidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col px-4 py-6 md:px-6">
          <h1 className="text-2xl font-bold mb-4">DSA Problems</h1>
          <ProblemTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default React.memo(ProblemsPage);
