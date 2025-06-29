import {
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Solved */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Questions Solved</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">320</CardTitle>
        
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="font-medium flex items-center gap-1">
            Consistent progress <IconTrendingUp className="size-4" />
          </span>
          <span className="text-muted-foreground">Track across all levels</span>
        </CardFooter>
      </Card>

      {/* Easy */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Easy Questions Solved</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">150</CardTitle>
         
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="font-medium flex items-center gap-1">
            Good foundation <IconTrendingUp className="size-4" />
          </span>
          <span className="text-muted-foreground">Basic DSA practice</span>
        </CardFooter>
      </Card>

      {/* Medium */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Medium Questions Solved</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">120</CardTitle>
      
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="font-medium flex items-center gap-1">
            Slight drop <IconTrendingDown className="size-4" />
          </span>
          <span className="text-muted-foreground">Revise key patterns</span>
        </CardFooter>
      </Card>

      {/* Hard */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Hard Questions Solved</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">50</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="font-medium flex items-center gap-1">
            Solid progress <IconTrendingUp className="size-4" />
          </span>
          <span className="text-muted-foreground">Advanced DSA skills</span>
        </CardFooter>
      </Card>
    </div>
  )
}
