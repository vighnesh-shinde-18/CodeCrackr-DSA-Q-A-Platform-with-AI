"use client";

import React, { useMemo } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

const NavMainComponent = ({ items }) => {
  const location = useLocation();

  const menuItems = useMemo(() => {
    return items.map((item) => {
      const isActive = location.pathname === item.url;
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            className={isActive ? "bg-primary text-primary-foreground" : ""}
          >
            <Link to={item.url}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  }, [items, location.pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>{menuItems}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const NavMain = React.memo(NavMainComponent);
