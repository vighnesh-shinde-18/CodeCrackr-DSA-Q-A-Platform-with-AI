"use client"

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
  IconSettingsAutomation,
  IconUpload,
} from "@tabler/icons-react"

import { NavMain } from "@/components/navbar/NavMain"
import { NavSecondary } from "@/components/navbar/NavSecondary"
import { NavUser } from "@/components/navbar/NavUser"; // ✅ correct usage

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function AppSidebarComponent(props) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  })

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/profile`, {
        withCredentials: true,
      })

      setUserData((prev) => ({
        ...prev,
        username: res.data.username,
        email: res.data.email,
      }))
    } catch (err) {
      console.error("Error fetching user profile:", err)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const mainNav = useMemo(
    () => [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Problems", url: "/problems", icon: IconListCheck },
      { title: "Problem Manager", url: "/problem-manager", icon: IconUpload },
      { title: "History", url: "/history", icon: IconHistory },
      { title: "Code Playground", url: "/code-playground", icon: IconFileCode },
    ],
    []
  )

  const aiToolsNav = useMemo(
    () => [
      { title: "Debug Code", url: "/debug", icon: IconBug },
      { title: "Generate Code", url: "/generate", icon: IconFileCode },
      { title: "Review & Refactor Code", url: "/review", icon: IconSettingsAutomation },
      { title: "Explain Code", url: "/explain", icon: IconBulb },
      { title: "Convert Code", url: "/convert", icon: IconRepeat },
      { title: "Test Cases", url: "/testcases", icon: IconFileText },
    ],
    []
  )

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">CodeCracker</span>
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

export const AppSidebar = React.memo(AppSidebarComponent);