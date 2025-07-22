import { CheckCircle2 } from "lucide-react";

export default function SolutionReplies({ replies, onViewReply }) {
  if (!replies.length) return <p className="text-muted-foreground">No replies yet.</p>;

  return (
    <div className="space-y-4">
      {replies.map((reply, i) => (
        <div
          key={i}
          className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => onViewReply(reply)}
        >
          <div className="flex justify-between">
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
        </div>
      ))}
    </div>
  );
}
