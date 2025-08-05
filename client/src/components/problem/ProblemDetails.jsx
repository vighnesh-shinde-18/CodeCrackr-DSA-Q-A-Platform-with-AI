import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProblemDetails({ problem, currentUser }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this problem?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/problem/${problem.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Problem deleted successfully.");
        navigate("/problems"); // or wherever your problems list route is
      } else {
        toast.error(data.error || "Failed to delete problem.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-md space-y-5 border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {problem.username && (
            <span className="text-sm text-muted-foreground">
              Uploaded by{" "}
              <span className="font-medium text-blue-600">{problem.username}</span>
            </span>
          )}
          {currentUser?.isAdmin && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 ml-3 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300">{problem.description}</p>

      <div>
        <strong>Topics:</strong>
        <div className="flex gap-2 mt-1 flex-wrap">
          {problem.topics.map((topic, i) => (
            <span
              key={i}
              className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white text-sm font-medium px-2.5 py-0.5 rounded"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div>
        <strong>Test Cases:</strong>
        <ul className="list-disc ml-5 mt-2 text-sm">
          {problem.testCases.map((tc, i) => (
            <li key={i}>
              <span className="font-medium">Input:</span> {tc.input}{" "}
              <span className="font-medium ml-2">Output:</span> {tc.output}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
