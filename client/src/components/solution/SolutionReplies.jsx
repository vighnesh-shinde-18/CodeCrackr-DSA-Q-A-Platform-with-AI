import { CheckCircle2, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function SolutionReplies({ replies, onViewReply, currentUserId }) {
  if (!replies.length) return <p className="text-muted-foreground">No replies yet.</p>;

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <SolutionCard
          key={reply.id}
          reply={reply}
          onViewReply={onViewReply}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

function SolutionCard({ reply, onViewReply, currentUserId }) {
 const [likesCount, setLikesCount] = useState(reply.likesCount || 0);
const [liked, setLiked] = useState(reply.liked || false); // 👈 Use `reply.liked`

  const toggleLike = async (e) => {
    e.stopPropagation(); // prevent opening the reply view
    try {
      const res = await fetch(`http://localhost:5000/api/solutions/like/${reply.id}`, {
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

  return (
    <div
      className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => onViewReply(reply)}
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold">{reply.username}</p>
        {reply.accepted && (
          <div className="flex items-center text-green-600 text-sm gap-1">
            <CheckCircle2 className="size-4" />
            Accepted
          </div>
        )}
      </div>

      <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
        {reply.explanation}
      </p>

      {/* 👍 Like UI */}
      <div className="flex items-center mt-3 gap-2 text-sm text-gray-500 dark:text-gray-300">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 hover:text-blue-500 transition ${
            liked ? "text-blue-500" : ""
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likesCount}</span>
        </button>
      </div>
    </div>
  );
}
