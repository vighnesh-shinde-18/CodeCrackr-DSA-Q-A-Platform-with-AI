"use client"

import { useState, useEffect } from "react"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

export function HistoryProblems() {
  const [problems, setProblems] = useState([])
  const [topicFilter, setTopicFilter] = useState("All")
  const [acceptedFilter, setAcceptedFilter] = useState("All")

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/problems/solved", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topicFilter,
            accepted:
              acceptedFilter === "All"
                ? undefined
                : acceptedFilter === "Accepted"
                  ? true
                  : false,
          }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch problems")

        setProblems(data)
      } catch (err) {
        console.error("Failed to load solved problems:", err)
      }
    }

    fetchProblems()
  }, [topicFilter, acceptedFilter])


  const allTopics = Array.from(new Set(problems.flatMap(p => p.topics)))
  const filtered = problems.map((p, index) => ({
    ...p,
    serialId: index + 1,
  }))

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-medium">Replied Problems</h3>

        <div className="flex gap-4">
          <Select defaultValue="All" onValueChange={setTopicFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Topics</SelectItem>
              {allTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="All" onValueChange={setAcceptedFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Not Accepted">Not Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr.No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Topics</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
       <TableBody>
  {filtered.length > 0 ? (
    filtered.map((p) => (
      <TableRow
        key={p.id}
        onClick={() =>
          window.location.href = `http://localhost:5173/solve-problem/${p.id}`
        }
        className="cursor-pointer hover:bg-muted transition-colors"
      >
        <TableCell>{p.serialId}</TableCell>
        <TableCell>{p.title}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {p.topics.map((t, i) => (
              <Badge key={i} variant="secondary">{t}</Badge>
            ))}
          </div>
        </TableCell>
        <TableCell>
          {p.accepted ? (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle2 className="size-4" /> Accepted
            </div>
          ) : (
            <span className="text-muted-foreground">Not Accepted</span>
          )}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-8">
        No problems found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </div>
  )
}
