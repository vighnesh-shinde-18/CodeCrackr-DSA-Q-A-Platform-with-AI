"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  Label,
} from "recharts"

export default function QuestionRadialCard({
  easy = 150,
  medium = 120,
  hard = 50,
  size = 220,          // diameter in px
}) {
  const total = easy + medium + hard

  /* Recharts expects an array; we create one merged slice per difficulty */
  const data = [
    { name: "Easy",   value: easy,   fill: "var(--chart-easy, #22c55e)" },
    { name: "Medium", value: medium, fill: "var(--chart-med, #eab308)" },
    { name: "Hard",   value: hard,   fill: "var(--chart-hard, #ef4444)" },
  ]

  return (
    <Card className="lg:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle>DSA Progress</CardTitle>
        <CardDescription>Static radial view of solved questions</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row items-center justify-center gap-6">

        {/* ---- ring ---- */}
        <div style={{ width: size, height: size }} className="relative">
          <RadialBarChart
            width={size}
            height={size}
            data={data}
            innerRadius={70}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
          >
            <PolarGrid radialLines={false} stroke="none" />
            <RadialBar dataKey="value" background />
            {/* ❗ central label */}
            <Label
              value={`${total}`}
              position="center"
              className="fill-foreground text-3xl font-bold"
            />
          </RadialBarChart>
        </div>

        {/* ---- legend ---- */}
        <div className="flex flex-col gap-2 text-sm">
          <Legend color="var(--chart-easy, #22c55e)"   label="Easy"   count={easy} />
          <Legend color="var(--chart-med, #eab308)"    label="Medium" count={medium} />
          <Legend color="var(--chart-hard, #ef4444)"   label="Hard"   count={hard} />
          <Legend color="var(--primary, #6366f1)" label="Total"  count={total} />
        </div>
      </CardContent>
    </Card>
  )
}

function Legend({ color, label, count }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block size-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="capitalize">{label}</span>
      <span className="ml-auto font-medium tabular-nums">{count}</span>
    </div>
  )
}
