import { useState } from "react";
import ProblemDetails from "@/components/problem/ProblemDetails";
import SolutionReplies from "@/components/solution/SolutionReplies";
import SolutionInput from "@/components/solution/SolutionInput";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProblemSolvingPage() {
  const currentUserId = "user123"; // Logged in user ID

  const problem = {
    id: "1",
    title: "Two Sum",
    description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    topics: ["Array", "HashMap"],
    username: "user123", // ✅ This is the problem creator
    testCases: [
      { input: "[2, 7, 11, 15], target = 9", output: "[0, 1]" },
      { input: "[3, 2, 4], target = 6", output: "[1, 2]" }
    ],
    replies: [
      {
        userId: "user999",
        username: "JohnDoe",
        explanation: "Use a hash map to store values and their indices while iterating.",
        code: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    let diff = target - nums[i];
    if (map[diff] !== undefined) {
      return [map[diff], i];
    }
    map[nums[i]] = i;
  }
}`,
        accepted: true
      },
      {
        userId: "user456",
        username: "JaneSmith",
        explanation: "Try brute force first then optimize.",
        code: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
}`,
        accepted: false
      }
    ]
  };

  const [selectedReply, setSelectedReply] = useState(null);
  const [showEditor, setShowEditor] = useState(true);
  const [allReplies, setAllReplies] = useState(problem.replies);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleViewReply = (reply) => {
    setSelectedReply(reply);
    setShowEditor(false);
  };

  const handleResetEditor = () => {
    setSelectedReply(null);
    setShowEditor(true);
  };

  const handleAcceptReply = (replyIndex) => {
    const updatedReplies = allReplies.map((r, idx) => ({
      ...r,
      accepted: idx === replyIndex,
    }));
    setAllReplies(updatedReplies);
    setSelectedReply(updatedReplies[replyIndex]);
    alert("✅ Marked this solution as Accepted");
  };

  const filteredReplies = allReplies.filter((reply) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "accepted") return reply.accepted;
    if (filterStatus === "not_accepted") return !reply.accepted;
    if (filterStatus === "mine") return reply.userId === currentUserId;
    return true;
  });

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
            {/* Left column: Problem details and replies */}
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
                  showAcceptButton={currentUserId === problem.username} 
                  onAcceptReply={handleAcceptReply}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {showEditor
                    ? "Submit Your Solution"
                    : `${selectedReply.username}'s Solution`}
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
                isUploader={currentUserId === problem.username} 
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
