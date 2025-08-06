"use client";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import React from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProblemDetailsComponent({ problem, currentUser }) {
  const navigate = useNavigate();

  const handleDelete = useCallback(async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this problem?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/problem/${problem.id}`, {
        withCredentials: true,
      });

      toast.success("Problem deleted successfully.");
      navigate("/problems");
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to delete problem.";
      console.error("Delete failed:", err);
      toast.error(msg);
    }
  }, [navigate, problem.id]);

  return (
    <div className="bg-white dark:bg-gray-900 shadow p-6 rounded-md space-y-5 border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {problem.username && (
            <span className="text-sm text-muted-foreground">
              Uploaded by <span className="font-medium text-blue-600">{problem.username}</span>
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
          {problem.topics?.map((topic, i) => (
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
          {problem.testCases?.map((tc, i) => (
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

const ProblemDetails = React.memo(ProblemDetailsComponent);

export default ProblemDetails;