import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuestionProgressCard from "../questionsProgress/QuestionProgressCard";
import QuestionRadialCard from "../questionsProgress/questionRadialCard";

const questionData = {
  easy: { solved: 120, total: 452 },
  medium: { solved: 80, total: 550 },
  hard: { solved: 30, total: 320 },
};

export function SectionCards() {
  const totalSolved = questionData.easy.solved + questionData.medium.solved + questionData.hard.solved;
  const totalQuestions = questionData.easy.total + questionData.medium.total + questionData.hard.total;
  const percent = Math.round((totalSolved / totalQuestions) * 100);

  return (
 <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
  {/* Radial Chart Card */}
  <QuestionRadialCard
    easy={questionData.easy.solved}
    medium={questionData.medium.solved}
    hard={questionData.hard.solved}
  />

  {/* Combined Progress Card */}
  <QuestionProgressCard
    easy={{ solved: questionData.easy.solved, total: questionData.easy.total }}
    medium={{ solved: questionData.medium.solved, total: questionData.medium.total }}
    hard={{ solved: questionData.hard.solved, total: questionData.hard.total}}
  />
</div>

  );
}
