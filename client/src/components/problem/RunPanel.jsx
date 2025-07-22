"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

export default function RunPanel({ consoleOut, testVerdicts, onSubmit }) {
  const [customInput, setCustomInput] = useState("")

  const passCount = testVerdicts.filter(t => t.status === "pass").length

  return (
    <div className="h-full flex flex-col gap-3 p-3 overflow-auto">
      {/* ---- custom input ---- */}
      <div>
        <h4 className="text-sm font-medium mb-1">Custom Input</h4>
        <Textarea
          rows={3}
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Enter stdin if any"
        />
      </div>

      {/* ---- buttons ---- */}
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => onSubmit(customInput)}>
          Submit
        </Button>
      </div>

      {/* ---- console output ---- */}
      <div>
        <h4 className="text-sm font-medium mb-1">Console Output</h4>
        <pre className="bg-muted p-2 rounded text-xs max-h-32 overflow-auto whitespace-pre-wrap">
          {consoleOut || "—"}
        </pre>
      </div>

      {/* ---- verdict table ---- */}
      <div>
        <h4 className="text-sm font-medium mb-1">
          Test Cases <Badge variant="outline">{passCount} / {testVerdicts.length}</Badge>
        </h4>
        <ul className="space-y-1 text-sm">
          {testVerdicts.map(t => (
            <li key={t.id} className="flex items-center gap-2">
              {t.status === "pass" ? (
                <CheckCircle2 className="text-green-600 size-4" />
              ) : t.status === "fail" ? (
                <XCircle className="text-red-600 size-4" />
              ) : (
                <span className="inline-block size-3 bg-muted rounded-full" />
              )}
              <span>{t.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
