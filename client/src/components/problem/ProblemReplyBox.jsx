import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ProblemReplyBox({ onSubmit }) {
  const [reply, setReply] = useState("")

  const handleSubmit = () => {
    if (!reply.trim()) return
    onSubmit(reply)
    setReply("")
  }

  return (
    <div className="space-y-3 mt-6">
      <h3 className="font-medium">Your Reply</h3>
      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write your suggestion or approach..."
        rows={4}
      />
      <Button onClick={handleSubmit}>Submit Reply</Button>
    </div>
  )
}
