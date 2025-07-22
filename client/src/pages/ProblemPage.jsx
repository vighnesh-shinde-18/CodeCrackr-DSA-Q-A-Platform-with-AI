// app/problems/page.tsx

import React from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/header/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProblemTable } from "@/components/problem/problem-table"

export default function ProblemsPage() {
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
        <div className="flex flex-1 flex-col px-4 py-6 md:px-6">
          <h1 className="text-2xl font-bold mb-4">DSA Problems</h1>
          <ProblemTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
