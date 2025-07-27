import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SectionCards } from "@/components/card/section-cards"
import { SiteHeader } from "@/components/header/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import LeaderboardTable from "../components/leaderboard/Leaderboard"

export default function Dashboard() {
  const [user, setUser] = useState({})
  const [counts, setCounts] = useState({
    users: 0,
    questions: 0,
    solutions: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, userCountRes, questionCountRes, solutionCountRes] = await Promise.all([
          fetch("http://localhost:5000/api/user/profile", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/user/user-count", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/problems/problem-count", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/solutions/solution-count", {
            credentials: "include",
          }),
        ])

  
        const userData = await userRes.json()
        const users = await userCountRes.json()
        const questions = await questionCountRes.json()
        const solutions = await solutionCountRes.json()

        setUser({...user ,email:userData.data.email, username:userData.data.username});

       setCounts({
  users: users?.data ?? -1,
  questions: questions.totalProblems ?? -1,
  solutions: solutions.totalSolutions ?? -1
})
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      }
    }

    fetchData()
  }, [])

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
  Welcome, {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Loading..."} 👋
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
  )
}
