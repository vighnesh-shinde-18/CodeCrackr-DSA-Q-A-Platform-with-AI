// src/components/history/HistoryProblems.jsx
"use client"

import { useState } from "react"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

const problemsHistory = [
  { id: 1, title: "Two Sum", difficulty: "Easy", completed: true },
  { id: 2, title: "Longest Substring", difficulty: "Medium", completed: false },
  { id: 3, title: "Merge K Sorted Lists", difficulty: "Hard", completed: true },
]

export function HistoryProblems() {
  const [filter, setFilter] = useState("all")

  const filtered = filter === "all"
    ? problemsHistory
    : problemsHistory.filter(p => p.difficulty === filter)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Solved / Attempted Problems</h3>
        <Select defaultValue="all" onValueChange={setFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length ? (
            filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.title}</TableCell>
                <TableCell>
                  <Badge variant={
                    p.difficulty === "Easy" ? "default" :
                    p.difficulty === "Medium" ? "secondary" : "destructive"
                  }>
                    {p.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  {p.completed ? (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle2 className="size-4" />
                      Solved
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not Solved</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">No problems found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
