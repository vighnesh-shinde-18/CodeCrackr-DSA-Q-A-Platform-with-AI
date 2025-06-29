import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SectionCards } from "@/components/card/section-cards"
import { SiteHeader } from "@/components/header/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Dashboard() {
  const username = "Vighnesh" // Later pull from context or backend

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
                <h1 className="text-2xl font-bold tracking-tight">Welcome, {username} 👋</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Here's your progress snapshot for the week.
                </p>
              </div>
 
              <SectionCards />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
