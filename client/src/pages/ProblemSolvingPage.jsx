import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ProblemDetails from "@/components/problem/ProblemDetails";
import SolutionReplies from "@/components/solution/SolutionReplies";
import SolutionInput from "@/components/solution/SolutionInput";
import { SiteHeader } from "@/components/header/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProblemSolvingPage() {
  const { id } = useParams(); // Get problem ID from route
  const [problem, setProblem] = useState(null);
  const [allSolutions, setAllSolutions] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showEditor, setShowEditor] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedSolutionId, setSelectedSolutionId] = useState(null);

  // 🔹 Fetch logged-in user
  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/user/profile`, {
        withCredentials: true,
      });
      setCurrentUser(data.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setCurrentUser("");
    }
  };

  // 🔹 Fetch solutions for a given problem
  const fetchSolutions = async (problemId) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/solutions/problem/${problemId}`,
        {
          withCredentials: true,
        }
      );
      setAllSolutions(data);
    } catch (err) {
      console.error("Error fetching replies:", err);
      setAllSolutions([]);
    }
  };

  // 🔹 Fetch the problem
  const fetchProblem = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/problems/${id}`, {
        withCredentials: true,
      });
      setProblem(data);
      fetchSolutions(data.id); // Make sure `data.id` is correct field
    } catch (err) {
      console.error("Error fetching problem:", err);
      setError(
        err?.response?.data?.error || "Failed to load problem. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Fetch on mount
  useEffect(() => {
    fetchCurrentUser();
    fetchProblem();
  }, [id]);

  // Sync selected reply with updated replies
  useEffect(() => {
    if (selectedSolution) {
      const updated = allSolutions.find(
        (r) =>
          r._id === selectedSolution._id || r.id === selectedSolution.id
      );
      if (updated) {
        setSelectedSolution(updated);
      }
    }
  }, [allSolutions]);

  // 🔹 Accept Reply Handler
  const handleAcceptSolution = (solutionIndex) => {
    const updatedSolutions = allSolutions.map((r, idx) => ({
      ...r,
      accepted: idx === solutionIndex,
    }));
    setAllSolutions(updatedSolutions);
    setSelectedSolution(updatedSolutions[solutionIndex]);

  };

  // 🔹 View/Reset Handler
  const handleViewSolution = (solution) => {
    setSelectedSolution(solution);
    setShowEditor(false);
    setSelectedSolutionId(solution.id);
  };

  const handleResetEditor = () => {
    setSelectedSolution(null);
    setShowEditor(true);
    setSelectedSolutionId(null);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col gap-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProblemDetails problem={problem} currentUser={currentUser} />
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Other User Replies</h3>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border px-2 py-1 rounded text-sm dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="accepted">Accepted</option>
                    <option value="not_accepted">Not Accepted</option>
                    <option value="mine">Submitted by Me</option>
                  </select>
                </div>
                <SolutionReplies
                  allSolutions={allSolutions}
                  onViewSolution={handleViewSolution}
                  selectedSolutionId={selectedSolutionId}
                  setSelectedSolutionId={setSelectedSolutionId}
                  currentUserId={currentUser._id}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {showEditor
                    ? "Submit Your Solution"
                    : `${selectedSolution?.username}'s Solution`}
                </h2>
                {!showEditor && (
                  <button
                    onClick={handleResetEditor}
                    className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    + Submit Your Own Solution
                  </button>
                )}
              </div>
              <SolutionInput
                showEditor={showEditor}
                selectedSolution={selectedSolution}
                currentUser={currentUser}
                isUploader={currentUser._id === problem.userId}
                handleAcceptSolution={handleAcceptSolution}
                fetchSolutions={fetchSolutions}
                problemId={problem.id}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
