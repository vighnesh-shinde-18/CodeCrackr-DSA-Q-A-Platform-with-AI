import {
  IconUsers,
  IconMessageQuestion,
  IconMessageCircleCode,
  IconCpu,
} from "@tabler/icons-react"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SectionCards({ usersCount, questionCount, solutionCount }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Users */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Registered Users</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">{usersCount}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="font-medium flex items-center gap-1">
            Growing Community <IconUsers className="size-4" />
          </span>
          <span className="text-muted-foreground">Active DSA learners & helpers</span>
        </CardFooter>
      </Card>

      {/* Total Questions */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Questions Posted</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">{questionCount}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="font-medium flex items-center gap-1">
            High engagement <IconMessageQuestion className="size-4" />
          </span>
          <span className="text-muted-foreground">All DSA levels covered</span>
        </CardFooter>
      </Card>

      {/* Total Answers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Answers Provided</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">{solutionCount}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="font-medium flex items-center gap-1">
            Peer support <IconMessageCircleCode className="size-4" />
          </span>
          <span className="text-muted-foreground">Community-driven problem solving</span>
        </CardFooter>
      </Card>
    </div>
  )
}
