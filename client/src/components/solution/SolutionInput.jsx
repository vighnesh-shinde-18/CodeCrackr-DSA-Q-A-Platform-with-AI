"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useMonacoTheme() {
  const [theme, setTheme] = useState("vs");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "vs-dark" : "vs");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return theme;
}

export default function SolutionInput({
  showEditor,
  selectedSolution,
  currentUser,
  handleAcceptSolution,
  isUploader,
  fetchSolutions,
  problemId,
}) {
  const theme = useMonacoTheme();
  const [code, setCode] = useState("// Write your solution...");
  const [explanation, setExplanation] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isAdmin = currentUser?.isAdmin;

  const languageOptions = useMemo(
    () => [
      "cpp", "python", "java", "c", "go", "javascript", "kotlin",
      "php", "r", "rust", "scala", "sql", "swift", "typescript", "csharp"
    ],
    []
  );

  useEffect(() => {
    if (showEditor) {
      setCode("// Write your solution...");
      setExplanation("");
      setLanguage("javascript");
    }
  }, [showEditor]);

  useEffect(() => {
    if (selectedSolution?.replies) setReplies(selectedSolution.replies);
  }, [selectedSolution]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim() || !explanation.trim()) {
      toast.warning("❌ Please fill in all fields before submitting.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/solutions/`, {
        problemId, code, explanation, language,
      }, { withCredentials: true });

      toast.success("✅ Solution submitted successfully!");
      handleAcceptSolution();
      fetchSolutions(problemId);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to submit solution.");
    }
  }, [code, explanation, language, problemId, fetchSolutions, handleAcceptSolution]);

  const handlePostReply = useCallback(async () => {
    if (!replyText.trim()) {
      toast.warning("⚠️ Please enter your reply.");
      return;
    }

    setIsSubmittingReply(true);
    try {
      await axios.post(`${BASE_URL}/api/solutions/reply/${selectedSolution.id}`, {
        text: replyText,
      }, { withCredentials: true });

      const res = await axios.get(`${BASE_URL}/api/solutions/${selectedSolution.id}`, {
        withCredentials: true,
      });

      setReplies(res.data.replies || []);
      setReplyText("");
      toast.success("Reply posted.");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Reply failed.");
    } finally {
      setIsSubmittingReply(false);
    }
  }, [replyText, selectedSolution]);

  const handleDeleteSolution = useCallback(async () => {
    try {
      await axios.delete(`${BASE_URL}/api/solutions/${selectedSolution.id}`, {
        withCredentials: true,
      });

      fetchSolutions(problemId);
      toast.success("Solution deleted.");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Delete failed.");
    }
  }, [selectedSolution, fetchSolutions, problemId]);

  const handleAccept = useCallback(async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/solutions/mark-accepted/${selectedSolution.id}`,
        {},
        { withCredentials: true }
      );
      fetchSolutions();
      toast.success("Marked as accepted.");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Accept failed.");
    }
  }, [selectedSolution, fetchSolutions]);

  return showEditor ? (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-semibold">Your Solution</h3>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Choose Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <Editor
        height="200px"
        language={language}
        theme={theme}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          readOnly: false,
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />

      <textarea
        rows="4"
        className="w-full p-2 border rounded-md"
        placeholder="Explain your solution..."
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
      />

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  ) : selectedSolution ? (
    <div className="space-y-4 border p-4 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{selectedSolution.username}'s Solution</h3>
        {selectedSolution.accepted && (
          <span className="text-green-600 flex items-center gap-1 font-medium">
            <CheckCircle2 className="size-4" /> Accepted
          </span>
        )}
      </div>

      <Editor
        height="200px"
        language={selectedSolution.language || "javascript"}
        theme={theme}
        value={selectedSolution.code}
        options={{ readOnly: true }}
      />

      <div className="p-4 rounded-md border bg-muted text-sm">
        <strong>Explanation:</strong>
        <p className="mt-2">{selectedSolution.explanation}</p>
      </div>

      {isUploader && (
        <Button onClick={handleAccept} className={`mt-4 flex gap-2 text-white font-semibold ${
          selectedSolution.accepted ? "bg-red-600" : "bg-green-600"
        }`}>
          {selectedSolution.accepted ? <><X className="w-4 h-4" /> Remove Acceptance</> : <><CheckCircle2 className="w-4 h-4" /> Accept</>}
        </Button>
      )}

      {isAdmin && (
        <Button onClick={handleDeleteSolution} className="mt-4 bg-red-600 text-white font-semibold flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete Solution
        </Button>
      )}

      <div className="mt-6 space-y-3">
        <h4 className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          <MessageCircle className="w-4 h-4" /> Replies ({replies.length})
        </h4>

        <div className="space-y-2">
          {replies.map((r) => (
            <div key={r.id} className="border p-3 rounded-md bg-muted">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{r.username}</span>
                <span className="text-xs">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm">{r.reply}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <textarea
            rows="3"
            className="w-full p-2 border rounded-md text-sm"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button
            onClick={handlePostReply}
            disabled={isSubmittingReply}
            className="self-end bg-blue-600 text-white"
          >
            {isSubmittingReply ? "Posting..." : "Reply"}
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
