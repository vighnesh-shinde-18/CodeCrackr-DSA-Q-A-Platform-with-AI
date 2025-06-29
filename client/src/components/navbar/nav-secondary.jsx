"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"
import { Label } from "@/components/ui/label"

export function NavSecondary({ items, ...props }) {
  const location = useLocation()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="mt-3 border-t pt-4">
        <Label
          className="
            text-2xl
            text-muted-foreground 
            px-1 pb-3 
            uppercase 
            tracking-widest 
            font-semibold 
            text-[15px]
          "
        >
          ⚡ AI Features
        </Label>

        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={isActive ? "bg-primary text-primary-foreground" : ""}
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
