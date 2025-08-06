import { CheckCircle2, ThumbsUp, Flag, MessageSquare } from "lucide-react";
import { useState, useCallback, memo } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SolutionReplies({
  allSolutions,
  currentUserId,
  onViewSolution,
  selectedSolutionId,
  setSelectedSolutionId,
}) {
  if (!allSolutions.length)
    return <p className="text-muted-foreground">No solutions yet.</p>;

  return (
    <div className="space-y-4">
      {allSolutions.map((solution) => (
        <MemoizedSolutionCard
          key={solution.id}
          solution={solution}
          isSelected={selectedSolutionId === solution.id}
          onSelect={() => {
            setSelectedSolutionId(solution.id);
            onViewSolution(solution);
          }}
        />
      ))}
    </div>
  );
}

const SolutionCard = ({ solution, isSelected, onSelect }) => {
  const [likesCount, setLikesCount] = useState(solution.likesCount || 0);
  const [liked, setLiked] = useState(solution.liked || false);
  const [reportCount, setReportCount] = useState(solution.reportCount || 0);
  const [reported, setReported] = useState(solution.reported || false);
  const replyCount = solution.replyCount || 0;

  const handleToggleLike = useCallback(async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/solutions/like/${solution.id}`,
        {},
        { withCredentials: true }
      );
      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  }, [solution.id]);

  const handleToggleReport = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await axios.patch(
        `${BASE_URL}/api/solutions/report/${solution.id}`,
        {},
        { withCredentials: true }
      );
      setReported(!reported);
      setReportCount((prev) => (reported ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Report toggle failed:", error);
    }
  }, [reported, solution.id]);

  return (
    <div
      onClick={onSelect}
      className={`p-4 border rounded-md cursor-pointer transition ${
        isSelected
          ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold">{solution.username}</p>
        {solution.accepted && (
          <div className="flex items-center text-green-600 text-sm gap-1">
            <CheckCircle2 className="size-4" />
            Accepted
          </div>
        )}
      </div>

      <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
        {solution.explanation}
      </p>

      <div className="flex items-center mt-3 gap-4 text-sm text-gray-500 dark:text-gray-300">
        <button
          onClick={handleToggleLike}
          className={`flex items-center gap-1 hover:text-blue-500 ${liked ? "text-blue-500" : ""}`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={handleToggleReport}
          className={`flex items-center gap-1 hover:text-red-500 ${reported ? "text-red-500" : ""}`}
        >
          <Flag className="w-4 h-4" />
          <span>{reportCount}</span>
        </button>

        <div className="flex items-center gap-1 cursor-default">
          <MessageSquare className="w-4 h-4" />
          <span>{replyCount}</span>
        </div>
      </div>
    </div>
  );
};

export const MemoizedSolutionCard = memo(SolutionCard);

 