"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/header/site-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

export default function ProblemManagerPage() {
  const submittedPlural = (count) => count === 1 ? "" : "s"

  const [form, setForm] = useState({
    title: "",
    description: "",
    topics: "",
    testCases: [{ input: "", output: "" }],
  })

  const [myProblems, setMyProblems] = useState([])
  const [topicFilter, setTopicFilter] = useState("all")

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleTestCaseChange = (index, key, value) => {
    const updated = [...form.testCases]
    updated[index][key] = value
    handleChange("testCases", updated)
  }

  const addTestCase = () => {
    handleChange("testCases", [...form.testCases, { input: "", output: "" }])
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.topics) {
      toast.error("Please fill all required fields")
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      topics: form.topics.split(",").map(t => t.trim()).filter(Boolean),
      testCases: form.testCases,
    }

    try {
      const res = await fetch("http://localhost:5000/api/problems/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // include cookies for auth
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Submission failed")
        return
      }

      toast.success("Problem submitted successfully!")
      setForm({
        title: "",
        description: "",
        topics: "",
        testCases: [{ input: "", output: "" }]
      })
      fetchMyProblems() // refresh list
    } catch (err) {
      toast.error("Something went wrong")
      console.error(err)
    }
  }

  const fetchMyProblems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/problems/uploaded', {
        method: "POST", // ✅ Change to POST
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          topic: topicFilter === "all" ? null : topicFilter
        })
      })


      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to fetch problems")
        return
      }

      setMyProblems(data)
    } catch (err) {
      toast.error("Network error")
      console.error(err)
    }
  }


  useEffect(() => {
    fetchMyProblems()
  }, [topicFilter])


  const allTopics = Array.from(new Set(myProblems.flatMap(p => p.topics || [])))

  const filteredProblems = topicFilter === "all"
    ? myProblems
    : myProblems.filter(p => p.topics.includes(topicFilter))

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
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

                <div className="space-y-5">
                  <div>
                    <Label>Title</Label>
                    <Input
                      className="my-3"
                      placeholder="Enter problem title"
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      className="my-3"
                      placeholder="Describe the problem in detail"
                      rows={6}
                      value={form.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Topics (comma separated)</Label>
                    <Input
                      className="my-3"
                      placeholder="e.g. arrays, sliding window, dp"
                      value={form.topics}
                      onChange={(e) => handleChange("topics", e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Test Cases</Label>
                    {form.testCases.map((tc, index) => (
                      <div key={index} className="flex gap-4">
                        <Input
                          placeholder="Input"
                          value={tc.input}
                          onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                        />
                        <Input
                          placeholder="Expected Output"
                          value={tc.output}
                          onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                        />
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addTestCase}>
                      + Add Test Case
                    </Button>
                  </div>

                  <div>
                    <Button onClick={handleSubmit}>Submit Problem</Button>
                  </div>
                </div>
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
                <p className="text-muted-foreground">No problems match the selected topic.</p>
              ) : (
                <div className="space-y-4">
                  {filteredProblems.map((problem, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-4 shadow-sm hover:bg-muted/50 transition"
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
                        {problem.solutionCount} Solution{submittedPlural(problem.solutionCount)} submitted
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
}
