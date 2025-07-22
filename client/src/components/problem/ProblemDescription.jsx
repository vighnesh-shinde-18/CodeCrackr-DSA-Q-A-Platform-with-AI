// src/components/problem/ProblemDescription.jsx
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle } from "lucide-react"

export default function ProblemDescription() {
  const problem = {
    number:1,
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Hash Table", "Array"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    isSolved: true
  }

  return (
    <Card className="h-full rounded-none border-none shadow-none p-4 overflow-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{problem.number}. {problem.title}</CardTitle>
        <div className="flex items-center gap-3 mt-2">
          <Badge variant="outline" className="capitalize">{problem.difficulty}</Badge>
          {problem.topics.map(topic => (
            <Badge key={topic} variant="secondary">{topic}</Badge>
          ))}
          <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
            {problem.isSolved ? (
              <>
                <CheckCircle className="text-green-500 w-4 h-4" />
                Solved
              </>
            ) : (
              <>
                <Circle className="text-red-500 w-4 h-4" />
                Not Solved
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 text-sm text-muted-foreground whitespace-pre-line">
        {problem.description}
      </CardContent>
    </Card>
  )
}
