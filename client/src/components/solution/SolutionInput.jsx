import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

// 🔹 Detects dark mode and sets Monaco theme
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
  { value: 'cpp', label: "C++" },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'javascript', label: 'Javascript' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'php', label: 'PHP' },
  { value: 'r', label: 'R' },
  { value: 'rust', label: 'Rust' },
  { value: 'scala', label: 'Scala' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'Typescript' },
  { value: 'csharp', label: 'C#' }
];

export default function SolutionInput({
  showEditor,
  selectedReply,
  currentUserId,
  isUploader,
  allReplies,
  fetchReplies
}) {
  const [code, setCode] = useState("// Write your solution...");
  const [explanation, setExplanation] = useState("");
  const [language, setLanguage] = useState("javascript");

  const theme = useMonacoTheme();

  // Reset the editor when showEditor is true
  useEffect(() => {
    if (showEditor) {
      setCode("// Write your solution...");
      setExplanation("");
      setLanguage("javascript");
    }
  }, [showEditor]);

  // 🔹 Submit new solution
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
          problemId: window.location.pathname.split("/").pop(),
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

      toast.success("✅ Solution submitted successfully!");
      fetchReplies(); // Refresh the list
      setCode("// Write your solution...");
      setExplanation("");
      setLanguage("javascript");

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("❌ An error occurred while submitting.");
    }
  };

  // 🔹 Accept someone else's reply
  const onAcceptReply = async (solutionId) => {
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

      toast.success("Solution marked as accepted!");
      fetchReplies();

    } catch (error) {
      console.error("Error accepting solution:", error);
      toast.error("An error occurred.");
    }
  };

  // 🔹 If we're not showing the editor, display selected reply
  if (!showEditor && selectedReply) {
    return (
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Viewing {selectedReply.username}'s Solution
          </h3>
          {selectedReply.accepted && (
            <span className="text-green-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="size-4" /> Accepted
            </span>
          )}
        </div>

        <Editor
          height="200px"
          defaultLanguage="javascript"
          theme={theme}
          value={selectedReply.code}
          options={{ readOnly: true }}
        />

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border text-sm">
          <strong>Explanation:</strong>
          <p className="mt-2">{selectedReply.explanation}</p>
        </div>

        {isUploader && !selectedReply.accepted && (
          <Button
            onClick={() => onAcceptReply(selectedReply.id)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark as Accepted
          </Button>
        )}
         {isUploader && selectedReply.accepted && (
          <Button
            onClick={() => onAcceptReply(selectedReply.id)}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-md transition"
          >
            <X className="w-4 h-4" />
            Remove Acceptence
          </Button>
        )}
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
        className="w-full p-2 border rounded-md dark:bg-gray-800"
        placeholder="Explain your solution..."
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
      />

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
