import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
];

export default function SolutionInput({
  showEditor,
  selectedReply,
  currentUserId,
  isUploader,
  onAcceptReply,
  allReplies
}) {
  const [code, setCode] = useState("// Write your solution...");
  const [explanation, setExplanation] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    if (showEditor) {
      setCode("// Write your solution...");
      setExplanation("");
      setLanguage("javascript");
    }
  }, [showEditor]);

  const handleSubmit = () => {
    console.log("Submit:", {
      userId: currentUserId,
      code,
      explanation,
      language,
    });
    alert("✅ Submitted your solution!");
    setCode("// Write your solution...");
    setExplanation("");
    setLanguage("javascript");
  };

  if (!showEditor && selectedReply) {
    const replyIndex = allReplies.findIndex(
      (r) => r.userId === selectedReply.userId && r.code === selectedReply.code
    );

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
          value={selectedReply.code}
          options={{ readOnly: true }}
        />

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border text-sm">
          <strong>Explanation:</strong>
          <p className="mt-2">{selectedReply.explanation}</p>
        </div>

       {isUploader && !selectedReply.accepted && (
  <Button
    onClick={() => onAcceptReply(replyIndex)}
    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-md transition"
  >
    <CheckCircle2 className="w-4 h-4" />
    Mark as Accepted
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
          className="border rounded px-2 py-1 text-sm"
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
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          readOnly: !showEditor,
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
