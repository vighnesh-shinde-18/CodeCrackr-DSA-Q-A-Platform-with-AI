import { CheckCircle2, ThumbsUp, Flag, MessageSquare } from "lucide-react";
import { useState } from "react";


export default function SolutionReplies({ allSolutions,currentUserId, onViewSolution, selectedSolutionId, setSelectedSolutionId  }) {


  if (!allSolutions.length) return <p className="text-muted-foreground">No solutions yet.</p>;

  return (
    <div className="space-y-4">
      {allSolutions.map((solution) => (
        <SolutionCard
          key={solution.id}
          solution={solution}
          onViewSolution={(solution) => {
            setSelectedSolutionId(solution.id); // update selected
            onViewSolution(solution);           // pass up to parent
          }}
          currentUserId={currentUserId}
          isSelected={selectedSolutionId === solution.id} // pass selection state
          setSelectedSolutionId = {setSelectedSolutionId}
        />
      ))}
    </div>
  );
}


function SolutionCard({ solution, onViewSolution, isSelected }) {
  const [likesCount, setLikesCount] = useState(solution.likesCount || 0);
  const [liked, setLiked] = useState(solution.liked || false);

  const [reportCount, setReportCount] = useState(solution.reportCount || 0);
  const [reported, setReported] = useState(solution.reported || false);

  const [replyCount, setReplyCount] = useState(solution.replyCount || 0); 

  const toggleLike = async (e) => {
    e.stopPropagation();
    const id = solution.id;
    try {
      const res = await fetch(`http://localhost:5000/api/solutions/like/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      setLikesCount(data.likesCount);
      setLiked(data.liked);
    } catch (error) {
      console.error("Like toggle failed", error);
    }
  };

  const toggleReport = async (e) => {
    e.stopPropagation();
   const id = solution.id;
    try {
      const res = await fetch(`http://localhost:5000/api/solutions/report/${id}`, {
        method: "PATCH",
        credentials: "include",
      }); 
      setReported(!reported);
      setReportCount((prev) => (reported ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Report toggle failed", error);
    }
  };

  return (
    <div
      className={`p-4 border rounded-md cursor-pointer transition 
        ${isSelected
          ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      onClick={() => onViewSolution(solution)}
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
          onClick={toggleLike}
          className={`flex items-center gap-1 hover:text-blue-500 transition ${liked ? "text-blue-500" : ""}`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={toggleReport}
          className={`flex items-center gap-1 hover:text-red-500 transition ${reported ? "text-red-500" : ""}`}
        >
          <Flag className="w-4 h-4" />
          <span>{reportCount}</span>
        </button>
        <div className="flex items-center gap-1 cursor-default text-gray-500">
          <MessageSquare className="w-4 h-4" />
          <span>{replyCount}</span>
        </div>
      </div>
    </div>
  );
}
