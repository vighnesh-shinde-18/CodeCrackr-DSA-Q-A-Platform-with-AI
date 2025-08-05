import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  X,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

function useMonacoTheme() {
  const [theme, setTheme] = useState("vs");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "vs-dark" : "vs");

    const observer = new MutationObserver(() => {
      const isNowDark = document.documentElement.classList.contains("dark");
      setTheme(isNowDark ? "vs-dark" : "vs");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

const languageOptions = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "javascript", label: "Javascript" },
  { value: "kotlin", label: "Kotlin" },
  { value: "php", label: "PHP" },
  { value: "r", label: "R" },
  { value: "rust", label: "Rust" },
  { value: "scala", label: "Scala" },
  { value: "sql", label: "SQL" },
  { value: "swift", label: "Swift" },
  { value: "typescript", label: "Typescript" },
  { value: "csharp", label: "C#" },
];

export default function SolutionInput({
  showEditor,
  selectedSolution,
  currentUser,
  handleAcceptSolution,
  isUploader,
  fetchSolutions,
  problemId
}) {
  const [code, setCode] = useState("// Write your solution...");
  const [explanation, setExplanation] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const theme = useMonacoTheme();
  const isAdmin = currentUser.isAdmin === true;

  useEffect(() => {
    if (showEditor) {
      setCode("// Write your solution...");
      setExplanation("");
      setLanguage("javascript");
    }
  }, [showEditor]);

  useEffect(() => {
    if (selectedSolution && selectedSolution.replies) {
      setReplies(selectedSolution.replies);
    }
  }, [selectedSolution]);

  const handleSubmit = async () => {
    if (!code.trim() || !explanation.trim() || !language) {
      toast.warning("❌ Please fill in all fields before submitting.");
      return;
    }  

    try {
      const res = await fetch(`http://localhost:5000/api/solutions/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId: problemId,
          code,
          explanation,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`❌ ${data.error || "Failed to submit solution."}`);
        return;
      }

      toast.success(" Solution submitted successfully!");
      fetchSolutions(problemId);
      setCode("// Write your solution...");
      setExplanation("");
      setLanguage("javascript");

      handleAcceptSolution();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting.");
    }
  };

  const handlePostReply = async () => {
    if (!replyText.trim()) {
      toast.warning("⚠️ Please enter your reply.");
      return;
    }

    try {
      setIsSubmittingReply(true);
      const res = await fetch(
        `http://localhost:5000/api/solutions/reply/${selectedSolution.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: replyText }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to post reply.");
        return;
      }

      toast.success("Reply added successfully!");
      setReplyText("");
      const refreshed = await fetch(`http://localhost:5000/api/solutions/${selectedSolution.id}`, {
        method: "GET",
        credentials: "include",
      });
      const refreshedData = await refreshed.json();

      setReplies(refreshedData.replies || []);
    } catch (err) {
      console.error("Reply error:", err);
      toast.error("Something went wrong while replying.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteSolution = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this solution?");
    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/solutions/${selectedSolution.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete solution.");
        return;
      }

      toast.success("Solution deleted successfully.");
      fetchSolutions();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong.");
    }
  };

  const onAcceptSolution = async (solutionId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/solutions/mark-accepted/${solutionId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(`❌ ${data.error || "Failed to mark as accepted"}`);
        return;
      }

      toast.success("Solution updated successfully!");
      fetchSolutions();
    } catch (error) {
      console.error("Error accepting solution:", error);
      toast.error("An error occurred.");
    }
  };

  useEffect(() => {
    const fetchSolutionDetails = async () => {
      if (!selectedSolution?.id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/solutions/${selectedSolution.id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch solution details.");
          return;
        }
        
        setReplies(data.replies || []);
      } catch (error) {
        console.error("Error fetching solution by ID:", error);
        toast.error("Server error while loading solution replies.");
      }
    };

    fetchSolutionDetails();
  }, [selectedSolution]);


  if (!showEditor && selectedSolution) {
    return (
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Viewing {selectedSolution.username}'s Solution
          </h3>
          {selectedSolution.accepted && (
            <span className="text-green-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="size-4" /> Accepted
            </span>
          )}
        </div>

        <Editor
          height="200px"
          defaultLanguage={selectedSolution.language || "javascript"}
          theme={theme}
          value={selectedSolution.code}
          options={{ readOnly: true }}
        />

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border text-sm">
          <strong>Explanation:</strong>
          <p className="mt-2">{selectedSolution.explanation}</p>
        </div>

        {isUploader && !selectedSolution.accepted && (
          <Button
            onClick={() => onAcceptSolution(selectedSolution.id)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark as Accepted
          </Button>
        )}

        {isUploader && selectedSolution.accepted && (
          <Button
            onClick={() => onAcceptSolution(selectedSolution.id)}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Remove Acceptance
          </Button>
        )}

        {isAdmin && (
          <Button
            onClick={handleDeleteSolution}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Solution
          </Button>
        )}

        {/* 🗨️ Replies Section */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4" /> Replies ({replies.length})
          </h4>

          <div className="space-y-2">
            {replies
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((r) => (
                <div
                  key={r.id}
                  className="border p-3 rounded-md bg-gray-50 dark:bg-zinc-800 dark:text-white"
                >
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="font-medium text-primary">{r.username}</span>
                    <span className="text-xs">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm">{r.reply}</p>
                </div>
              ))}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <textarea
              rows="3"
              className="w-full p-2 border rounded-md text-sm dark:bg-zinc-800 dark:text-white"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button
              onClick={handlePostReply}
              disabled={isSubmittingReply}
              className="self-end bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmittingReply ? "Posting..." : "Reply"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-semibold">Your Solution</h3>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Choose Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-2 py-1 rounded text-sm dark:bg-zinc-800 dark:text-white"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <Editor
        height="200px"
        defaultLanguage={language}
        language={language}
        theme={theme}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          readOnly: false,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
      <textarea
        rows="4"
        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
        placeholder="Explain your solution..."
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
