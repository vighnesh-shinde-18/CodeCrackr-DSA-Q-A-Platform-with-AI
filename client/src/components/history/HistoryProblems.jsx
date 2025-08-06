"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function HistoryProblems() {
  const [problems, setProblems] = useState([]);
  const [topicFilter, setTopicFilter] = useState("All");
  const [acceptedFilter, setAcceptedFilter] = useState("All");

  const navigate = useNavigate();

  const fetchProblems = useCallback(async (topic, accepted) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/problems/solved`,
        {
          topic,
          accepted:
            accepted === "All"
              ? undefined
              : accepted === "Accepted"
              ? true
              : false,
        },
        { withCredentials: true }
      );
      setProblems(response.data);
    } catch (err) {
      console.error("Failed to load solved problems:", err);
    }
  }, []);

  const debouncedFetch = useMemo(() => debounce(fetchProblems, 300), [fetchProblems]);

  useEffect(() => {
    debouncedFetch(topicFilter, acceptedFilter);
  }, [topicFilter, acceptedFilter, debouncedFetch]);

  const allTopics = useMemo(() => {
    const topics = problems.flatMap((p) => p.topics);
    return Array.from(new Set(topics));
  }, [problems]);

  const filtered = useMemo(
    () =>
      problems.map((p, index) => ({
        ...p,
        serialId: index + 1,
      })),
    [problems]
  );

  const handleNavigate = useCallback(
    (id) => {
      navigate(`/solve-problem/${id}`);
    },
    [navigate]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-medium">Replied Problems</h3>

        <div className="flex gap-4">
          <Select value={topicFilter} onValueChange={setTopicFilter}>
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

          <Select value={acceptedFilter} onValueChange={setAcceptedFilter}>
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
                onClick={() => handleNavigate(p.id)}
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
  );
}
