import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2 } from "lucide-react"

const problems = [
  { id: "1", title: "Two Sum", difficulty: "Easy", completed: true, acceptance: "45%" },
  { id: "2", title: "Longest Substring", difficulty: "Medium", completed: false, acceptance: "38%" },
  { id: "3", title: "Merge K Sorted Lists", difficulty: "Hard", completed: true, acceptance: "29%" },
  { id: "4", title: "Palindrome Number", difficulty: "Easy", completed: false, acceptance: "54%" },
  { id: "5", title: "Search in Rotated Array", difficulty: "Medium", completed: true, acceptance: "33%" },
]

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="text-sm">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const value = row.getValue("difficulty")
      const variant =
        value === "Easy" ? "default" : value === "Medium" ? "secondary" : "destructive"
      return <Badge variant={variant}>{value}</Badge>
    },
  },
  {
    accessorKey: "completed",
    header: "Completed",
    cell: ({ row }) =>
      row.getValue("completed") ? (
        <div className="flex items-center gap-1 text-green-600 font-medium">
          <CheckCircle2 className="size-4" /> Solved
        </div>
      ) : (
        <span className="text-muted-foreground">Not Solved</span>
      ),
  },
  {
    accessorKey: "acceptance",
    header: "Acceptance",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue("acceptance")}</span>
    ),
  },
]

export function ProblemTable() {
  const [filter, setFilter] = useState("")

  const table = useReactTable({
    data: problems,
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search problems..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>

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
                <TableRow key={row.id}>
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
