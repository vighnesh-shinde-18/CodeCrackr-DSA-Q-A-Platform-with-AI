"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2 } from "lucide-react"

const columns = [
  {
    id: "index",
    header: "Sr.No.",
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="text-sm">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "topics",
    header: "Topics",
    cell: ({ row }) => {
      const topics = row.getValue("topics") || []
      return (
        <div className="flex flex-wrap gap-1">
          {topics.map((topic, index) => (
            <Badge key={index} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "replied",
    header: "You Replied",
    cell: ({ row }) => {
      const replied = row.getValue("replied")
      return replied ? (
        <div className="flex items-center gap-1 text-green-600 font-medium">
          <CheckCircle2 className="size-4" /> Replied
        </div>
      ) : (
        <span className="text-muted-foreground">Not Replied</span>
      )
    },
  },
  {
    accessorKey: "accepted",
    header: "Accepted",
    cell: ({ row }) =>
      row.getValue("accepted") ? (
        <div className="flex items-center gap-1 text-green-600 font-medium">
          <CheckCircle2 className="size-4" /> Accepted
        </div>
      ) : (
        <span className="text-muted-foreground">Not Accepted</span>
      ),
  },
]

export function ProblemTable() {
  const [filter, setFilter] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("All")
  const [acceptedFilter, setAcceptedFilter] = useState("All")
  const [repliedFilter, setRepliedFilter] = useState("All")
  const [problems, setProblems] = useState([])
  const [originalProblems, setOriginalProblems] = useState([])

  const navigate = useNavigate()

  // 🔹 Fetch all problems once for topic dropdown
  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/problems`, {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch")
        setOriginalProblems(data)
      } catch (err) {
        console.error("Fetch error (all):", err)
      }
    }

    fetchAllProblems()
  }, [])

  // 🔹 Fetch filtered problems based on filters
  useEffect(() => {
    const fetchFilteredProblems = async () => {
      try {
        const queryParams = new URLSearchParams()
        if (selectedTopic !== "All") queryParams.append("topic", selectedTopic)
        if (acceptedFilter !== "All") queryParams.append("accepted", acceptedFilter === "Accepted")
        if (repliedFilter !== "All") queryParams.append("replied", repliedFilter === "Replied")

        const res = await fetch(`http://localhost:5000/api/problems?${queryParams.toString()}`, {
          method: "GET",
          credentials: "include",
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch")
        setProblems(data)
      } catch (err) {
        console.error("Fetch error (filtered):", err)
      }
    }

    fetchFilteredProblems()
  }, [selectedTopic, acceptedFilter, repliedFilter])

  // 🔹 Topic dropdown (from unfiltered data)
  const topicOptions = useMemo(() => {
    const allTopics = new Set()
    originalProblems.forEach((p) => p.topics?.forEach((t) => allTopics.add(t)))
    return ["All", ...Array.from(allTopics)]
  }, [originalProblems])

  const filteredProblems = useMemo(() => {
    if (!filter) return problems
    return problems.filter((p) =>
      p.title.toLowerCase().includes(filter.toLowerCase())
    )
  }, [filter, problems])

  const table = useReactTable({
    data: filteredProblems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
  })

  const visitProblem = (problemId) => {
    navigate(`/solve-problem/${problemId}`)
  }

  return (
    <div className="w-full space-y-4">
      {/* 🔹 Filters Section */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Input
          placeholder="Search problems..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm"
        />

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-zinc-800 dark:text-white"
        >
          {topicOptions.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <select
          value={acceptedFilter}
          onChange={(e) => setAcceptedFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-zinc-800 dark:text-white"
        >
          <option value="All">All</option>
          <option value="Accepted">Accepted</option>
          <option value="Not Accepted">Not Accepted</option>
        </select>

        <select
          value={repliedFilter}
          onChange={(e) => setRepliedFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-zinc-800 dark:text-white"
        >
          <option value="All">All</option>
          <option value="Replied">Replied</option>
          <option value="Not Replied">Not Replied</option>
        </select>
      </div>

      {/* 🔹 Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer hover:bg-muted transition"
                  onClick={() => visitProblem(row.original.id)}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  No problems found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Pagination */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
