import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProblemDetails from "@/components/problem/ProblemDetails";
import SolutionReplies from "@/components/solution/SolutionReplies";
import SolutionInput from "@/components/solution/SolutionInput";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProblemSolvingPage() {
  const { id } = useParams(); // Get problem ID from route
  const [problem, setProblem] = useState(null);
  const [allReplies, setAllReplies] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedReply, setSelectedReply] = useState(null);
  const [showEditor, setShowEditor] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // 🔹 Fetch logged-in user
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUserId(data._id); // Make sure _id is returned in backend
      } else {
        throw new Error("User not authenticated");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setCurrentUserId(""); // Fallback
    }
  };

  // 🔹 Fetch problem & replies
  useEffect(() => {
    const fetchProblemAndReplies = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/problems/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load problem");

        setProblem(data);
        fetchReplies(data.id);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReplies = async (problemId) => {
      try {
        const res = await fetch(`http://localhost:5000/api/solutions/${problemId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load replies");
        setAllReplies(data);
      } catch (err) {
        console.error("Error fetching replies:", err);
        setAllReplies([]);
      }
    };

    fetchCurrentUser();
    fetchProblemAndReplies();
  }, [id]);

  // 🔹 Accept Reply Handler
  const handleAcceptReply = (replyIndex) => {
    const updatedReplies = allReplies.map((r, idx) => ({
      ...r,
      accepted: idx === replyIndex,
    }));
    setAllReplies(updatedReplies);
    setSelectedReply(updatedReplies[replyIndex]);
    alert("✅ Marked this solution as Accepted");
  };

  // 🔹 Filtered Replies
  const filteredReplies = allReplies.filter((reply) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "accepted") return reply.accepted;
    if (filterStatus === "not_accepted") return !reply.accepted;
    if (filterStatus === "mine") return reply.userId === currentUserId;
    return true;
  });

  // 🔹 View/Reset Handler
  const handleViewReply = (reply) => {
    setSelectedReply(reply);
    setShowEditor(false);
  };

  const handleResetEditor = () => {
    setSelectedReply(null);
    setShowEditor(true);
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
            {/* 🔹 Left column: Problem details & replies */}
            <div className="space-y-6">
              <ProblemDetails problem={problem} />

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Other User Replies</h3>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="all">All</option>
                    <option value="accepted">Accepted</option>
                    <option value="not_accepted">Not Accepted</option>
                    <option value="mine">Submitted by Me</option>
                  </select>
                </div>

                <SolutionReplies
                  replies={filteredReplies}
                  onViewReply={handleViewReply}
                  showAcceptButton={currentUserId === problem.user}
                  onAcceptReply={handleAcceptReply}
                />
              </div>
            </div>

            {/* 🔹 Right column: Submit/View Solution */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {showEditor
                    ? "Submit Your Solution"
                    : `${selectedReply?.username}'s Solution`}
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
                selectedReply={selectedReply}
                currentUserId={currentUserId}
                isUploader={currentUserId === problem.user}
                onAcceptReply={handleAcceptReply}
                allReplies={allReplies}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
