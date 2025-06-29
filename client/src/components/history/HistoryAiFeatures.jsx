// src/components/history/HistoryAiFeatures.jsx
"use client"

import { useState } from "react"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const aiFeatureHistory = [
  { id: 1, feature: "Debug Code", prompt: "Fix foo()", date: "2024-06-10" },
  { id: 2, feature: "Generate Code", prompt: "Binary search", date: "2024-06-11" },
  { id: 3, feature: "Explain Code", prompt: "Merge sort", date: "2024-06-12" },
]

export function HistoryAiFeatures() {
  const [filter, setFilter] = useState("all")

  const filtered = filter === "all"
    ? aiFeatureHistory
    : aiFeatureHistory.filter(f => f.feature === filter)

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
            <SelectItem value="Debug Code">Debug Code</SelectItem>
            <SelectItem value="Generate Code">Generate Code</SelectItem>
            <SelectItem value="Explain Code">Explain Code</SelectItem>
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
              <TableCell colSpan={4} className="text-center py-8">No AI feature usage found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
