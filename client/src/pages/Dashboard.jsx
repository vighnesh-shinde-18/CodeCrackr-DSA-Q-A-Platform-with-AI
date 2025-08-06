import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SectionCards } from "@/components/card/SectionCards";
import { SiteHeader } from "@/components/header/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import LeaderboardTable from "@/components/leaderboard/Leaderboard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [counts, setCounts] = useState({
    users: 0,
    questions: 0,
    solutions: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const config = { withCredentials: true };

      const [userRes, userCountRes, questionCountRes, solutionCountRes] =
        await Promise.all([
          axios.get(`${BASE_URL}/api/user/profile`, config),
          axios.get(`${BASE_URL}/api/user/user-count`, config),
          axios.get(`${BASE_URL}/api/problems/problem-count`, config),
          axios.get(`${BASE_URL}/api/solutions/solution-count`, config),
        ]);

      setUser({
        email: userRes.data.data.email,
        username: userRes.data.data.username,
      });

      setCounts({
        users: userCountRes.data.data ?? -1,
        questions: questionCountRes.data.totalProblems ?? -1,
        solutions: solutionCountRes.data.totalSolutions ?? -1,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formattedName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "Loading...";

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
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome, {formattedName} 👋
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Here's your progress snapshot for the week.
                </p>
              </div>

              <SectionCards
                usersCount={counts.users}
                questionCount={counts.questions}
                solutionCount={counts.solutions}
              />

              <LeaderboardTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
