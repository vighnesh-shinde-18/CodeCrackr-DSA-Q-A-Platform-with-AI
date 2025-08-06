"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProblemTableComponent = () => {
  const [filter, setFilter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [acceptedFilter, setAcceptedFilter] = useState("All");
  const [repliedFilter, setRepliedFilter] = useState("All");
  const [problems, setProblems] = useState([]);

  const navigate = useNavigate();

  const fetchProblems = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/problems`, {
        withCredentials: true,
      });
      setProblems(res.data);
    } catch (error) {
      console.error("❌ Error fetching problems:", error);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const topicOptions = useMemo(() => {
    const allTopics = new Set();
    problems.forEach((p) => p.topics.forEach((t) => allTopics.add(t)));
    return ["All", ...Array.from(allTopics)];
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(filter.toLowerCase());
      const matchesTopic = selectedTopic === "All" || p.topics.includes(selectedTopic);
      const matchesAccepted =
        acceptedFilter === "All" ||
        (acceptedFilter === "Accepted" && p.accepted) ||
        (acceptedFilter === "Not Accepted" && !p.accepted);
      const matchesReplied =
        repliedFilter === "All" ||
        (repliedFilter === "Replied" && p.replied) ||
        (repliedFilter === "Not Replied" && !p.replied);
      return matchesSearch && matchesTopic && matchesAccepted && matchesReplied;
    });
  }, [filter, selectedTopic, acceptedFilter, repliedFilter, problems]);

  const columns = useMemo(() => [
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
        const topics = row.getValue("topics") || [];
        return (
          <div className="flex flex-wrap gap-1">
            {topics.map((topic, index) => (
              <Badge key={index} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "replied",
      header: "You Replied",
      cell: ({ row }) => {
        const replied = row.getValue("replied");
        return replied ? (
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle2 className="size-4" /> Replied
          </div>
        ) : (
          <span className="text-muted-foreground">Not Replied</span>
        );
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
  ], []);

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
  });

  const visitProblem = useCallback((id) => {
    navigate(`/solve-problem/${id}`);
  }, [navigate]);

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search problems..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm"
        />
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="dark:bg-zinc-800 dark:text-white px-3 py-2 border rounded-md text-sm">
          {topicOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={acceptedFilter} onChange={(e) => setAcceptedFilter(e.target.value)} className="dark:bg-zinc-800 dark:text-white px-3 py-2 border rounded-md text-sm">
          <option>All</option>
          <option>Accepted</option>
          <option>Not Accepted</option>
        </select>
        <select value={repliedFilter} onChange={(e) => setRepliedFilter(e.target.value)} className="dark:bg-zinc-800 dark:text-white px-3 py-2 border rounded-md text-sm">
          <option>All</option>
          <option>Replied</option>
          <option>Not Replied</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer hover:bg-muted" onClick={() => visitProblem(row.original.id)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">No problems found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
      </div>
    </div>
  );
};

export const ProblemTable = React.memo(ProblemTableComponent);
