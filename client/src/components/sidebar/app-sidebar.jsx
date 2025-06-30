import * as React from "react"
import {
  IconDashboard,
  IconListCheck,
  IconHistory,
  IconSettings,
  IconUser,
  IconBug,
  IconFileCode,
  IconRepeat,
  IconBulb,
  IconFileText,
  IconLogout,
  IconInnerShadowTop,
  IconSettingsAutomation
} from "@tabler/icons-react"

import { NavMain } from "@/components/navbar/nav-main"
import { NavSecondary } from "@/components/navbar/nav-secondary"
import { NavUser } from "@/components/navbar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const userData = {
  name: "Vighnesh",
  email: "vighnesh@example.com",
  avatar: "/avatars/shadcn.jpg",
}

const mainNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Problems",
    url: "/problems",
    icon: IconListCheck,
  },
  {
    title: "History",
    url: "/history",
    icon: IconHistory,
  },
]

const aiToolsNav = [
  {
    title: "Debug Code",
    url: "/debug",
    icon: IconBug,
  },
  {
    title: "Generate Code",
    url: "/generate",
    icon: IconFileCode,
  },
  {
    title: "Review & Refactor Code",
    url: "/review",
    icon: IconSettingsAutomation,
  },,{
    title: "Explain Code",
    url: "/explain",
    icon: IconBulb,
  },
  {
    title: "Convert Code",
    url: "/convert",
    icon: IconRepeat,
  },
  {
    title: "Test Cases",
    url: "/testcases",
    icon: IconFileText,
  },
]

const secondaryNav = [
  {
    title: "Profile",
    url: "/profile",
    icon: IconUser,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: IconLogout,
  },
]

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">CodeKracker</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        
        <NavMain title="Navigation" items={mainNav} />

        <NavSecondary title="AI Features" items={aiToolsNav} />


      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
