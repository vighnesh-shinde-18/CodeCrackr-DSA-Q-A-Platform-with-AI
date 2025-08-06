"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProblemManagerPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    topics: "",
    testCases: [{ input: "", output: "" }],
  });

  const [myProblems, setMyProblems] = useState([]);
  const [topicFilter, setTopicFilter] = useState("all");

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTestCaseChange = useCallback((index, key, value) => {
    const updated = [...form.testCases];
    updated[index][key] = value;
    handleChange("testCases", updated);
  }, [form.testCases, handleChange]);

  const addTestCase = useCallback(() => {
    handleChange("testCases", [...form.testCases, { input: "", output: "" }]);
  }, [form.testCases, handleChange]);

  const fetchMyProblems = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/problems/uploaded`,
        { topic: topicFilter === "all" ? null : topicFilter },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setMyProblems(data);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to fetch problems");
      console.error("Fetch Error:", err);
    }
  }, [topicFilter]);

  useEffect(() => {
    fetchMyProblems();
  }, [fetchMyProblems]);

  const handleSubmit = useCallback(async () => {
    if (!form.title || !form.description || !form.topics) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      topics: form.topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      testCases: form.testCases,
    };

    try {
      await axios.post(`${BASE_URL}/api/problems/`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Problem submitted successfully!");
      setForm({
        title: "",
        description: "",
        topics: "",
        testCases: [{ input: "", output: "" }],
      });
      fetchMyProblems();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Submission failed");
      console.error("Submit Error:", err);
    }
  }, [form, fetchMyProblems]);

  const allTopics = useMemo(
    () => Array.from(new Set(myProblems.flatMap((p) => p.topics || []))),
    [myProblems]
  );

  const filteredProblems = useMemo(() => {
    return topicFilter === "all"
      ? myProblems
      : myProblems.filter((p) => p.topics.includes(topicFilter));
  }, [myProblems, topicFilter]);

  const visitProblem = useCallback(
    (problemId) => {
      navigate(`/solve-problem/${problemId}`);
    },
    [navigate]
  );

  const submittedPlural = useCallback(
    (count) => (count === 1 ? "" : "s"),
    []
  );

  const sidebarStyle = useMemo(() => ({
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
  }), []);

  return (
    <SidebarProvider style={sidebarStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Manage Your Problems</h2>

          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upload">Upload Problem</TabsTrigger>
              <TabsTrigger value="myproblems">My Problems</TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload">
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Submit a problem with title, description, topics, and test cases.
                </p>
                <Separator className="mb-4" />

                {/* Title */}
                <Label>Title</Label>
                <Input
                  className="my-3"
                  placeholder="Enter problem title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />

                {/* Description */}
                <Label>Description</Label>
                <Textarea
                  className="my-3"
                  placeholder="Describe the problem in detail"
                  rows={6}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />

                {/* Topics */}
                <Label>Topics (comma separated)</Label>
                <Input
                  className="my-3"
                  placeholder="e.g. arrays, dp, sliding window"
                  value={form.topics}
                  onChange={(e) => handleChange("topics", e.target.value)}
                />

                {/* Test Cases */}
                <Label>Test Cases</Label>
                {form.testCases.map((tc, index) => (
                  <div key={index} className="flex gap-4 mb-2">
                    <Input
                      placeholder="Input"
                      value={tc.input}
                      onChange={(e) =>
                        handleTestCaseChange(index, "input", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Expected Output"
                      value={tc.output}
                      onChange={(e) =>
                        handleTestCaseChange(index, "output", e.target.value)
                      }
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTestCase}>
                  + Add Test Case
                </Button>

                {/* Submit */}
                <Button onClick={handleSubmit}>Submit Problem</Button>
              </div>
            </TabsContent>

            {/* My Problems Tab */}
            <TabsContent value="myproblems">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Your Uploaded Problems</h3>
                {allTopics.length > 0 && (
                  <Select defaultValue="all" onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {allTopics.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {filteredProblems.length === 0 ? (
                <p className="text-muted-foreground">
                  No problems match the selected topic.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredProblems.map((problem, index) => (
                    <div
                      key={index}
                      onClick={() => visitProblem(problem.id)}
                      className="cursor-pointer border rounded-md p-4 shadow-sm hover:bg-muted transition-all hover:scale-[1.01]"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-lg">
                          {index + 1}. {problem.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {problem.createdAt
                            ? new Date(problem.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {problem.topics.map((t, idx) => (
                          <Badge key={idx} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        {(problem.description?.slice(0, 100) || "No description provided") +
                          (problem.description?.length > 100 ? "..." : "")}
                      </p>
                      <div className="mt-3 text-sm text-green-700 font-medium">
                        {problem.solutionCount} Solution
                        {submittedPlural(problem.solutionCount)} submitted
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default React.memo(ProblemManagerPage);
