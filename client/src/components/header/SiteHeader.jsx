"use client";

import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// 🚀 Static page title map (outside component for stability)
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/problems": "Problems",
  "/history": "History",
  "/debug": "AI Feature",
  "/generate": "AI Feature",
  "/review": "AI Feature",
  "/explain": "AI Feature",
  "/convert": "AI Feature",
  "/testcases": "AI Feature",
};

function SiteHeaderComponenet() {
  const location = useLocation();

  const pageTitle = useMemo(() => {
    return PAGE_TITLES[location.pathname] || "CodeKracker";
  }, [location.pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export const SiteHeader = React.memo(SiteHeaderComponenet, (prevProps, nextProps) => {
  return true;
});
