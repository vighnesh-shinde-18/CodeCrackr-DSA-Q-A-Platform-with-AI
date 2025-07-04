import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function QuestionProgressCard({ easy, medium, hard }) {
  const rows = [
    { label: "Easy",   solved: easy.solved,   total: easy.total,   color: "bg-green-500" },
    { label: "Medium", solved: medium.solved, total: medium.total, color: "bg-yellow-500" },
    { label: "Hard",   solved: hard.solved,   total: hard.total,   color: "bg-red-500"   },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-semibold">Problem Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {rows.map(({ label, solved, total, color }) => {
          const percent = Math.round((solved / total) * 100)
          return (
            <div key={label}>
              <div className="flex justify-between text-sm font-medium">
                <span>{label}</span>
                <span className="text-muted-foreground">
                  {solved} / {total}
                </span>
              </div>

              <Progress
                value={percent}
                barColor={color}
                className="mt-1"
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
