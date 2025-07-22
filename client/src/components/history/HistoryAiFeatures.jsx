"use client"

import { useEffect, useState } from "react"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function HistoryAiFeatures() {
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ai/interactions", {
          method: "GET",
          credentials: "include",
        })

        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Failed to fetch AI history")

        const formatted = result.data.map((item, idx) => ({
          id: idx + 1,
          feature: convertFeature(item.featureType),
          prompt: item.userInput,
          date: new Date(item.createdAt).toLocaleDateString(),
        }))

        setHistory(formatted)
      } catch (err) {
        console.error("Failed to fetch AI interactions:", err)
      }
    }

    fetchInteractions()
  }, [])

  const convertFeature = (key) => {
    const map = {
      codeDebugging: "Debug Code",
      codeReview: "Review Code",
      codeGeneration: "Generate Code",
      explainCode: "Explain Code",
      convertCode: "Convert Code",
      generateTestCases: "Generate Test Cases",
    }
    return map[key] || key
  }

  const filtered = filter === "all"
    ? history
    : history.filter(f => f.feature === filter)

  const uniqueFeatures = Array.from(new Set(history.map(f => f.feature)))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">AI Feature Usage</h3>
        <Select defaultValue="all" onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Feature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {uniqueFeatures.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Feature</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length ? (
            filtered.map(f => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell><Badge variant="outline">{f.feature}</Badge></TableCell>
                <TableCell>{f.prompt}</TableCell>
                <TableCell className="text-muted-foreground">{f.date}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No AI feature usage found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
