import { QuizResult } from "../types";
import { Button } from "@/components/ui/button";

interface QuizResultsScreenProps {
  result: QuizResult;
  quizTitle: string;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function QuizResultsScreen({
  result,
  quizTitle,
  onRestart,
  onBackToMenu,
}: QuizResultsScreenProps) {
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-400", emoji: "🌟" };
    if (percentage >= 80) return { grade: "A", color: "text-green-400", emoji: "⭐" };
    if (percentage >= 70) return { grade: "B", color: "text-blue-400", emoji: "👍" };
    if (percentage >= 60) return { grade: "C", color: "text-yellow-400", emoji: "📚" };
    return { grade: "D", color: "text-red-400", emoji: "📖" };
  };

  const { grade, color, emoji } = getGrade(result.percentage);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
      <div className="container mx-auto max-w-3xl">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
          <h1 className="text-5xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl text-slate-300">{quizTitle}</p>
        </div>

        {/* Results Card */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`text-7xl font-bold mb-4 ${color}`}>{grade}</div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {result.correct} / {result.total}
            </div>
            <p className="text-xl text-slate-300">Correct Answers</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{result.correct}</div>
              <p className="text-sm text-slate-400">Correct</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-400">
                {result.total - result.correct}
              </div>
              <p className="text-sm text-slate-400">Incorrect</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {Math.round(result.percentage)}%
              </div>
              <p className="text-sm text-slate-400">Score</p>
            </div>
          </div>

          {/* Performance Message */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
            <p className="text-lg">
              {result.percentage >= 80 ? (
                <>
                  🎉 <strong>Excellent work!</strong> You&apos;re well-prepared for emergencies!
                </>
              ) : result.percentage >= 60 ? (
                <>
                  👍 <strong>Good job!</strong> Review the material to improve your safety
                  knowledge.
                </>
              ) : (
                <>
                  📚 <strong>Keep learning!</strong> Practice more to build your emergency
                  preparedness skills.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
          >
            🔄 Retry Quiz
          </Button>
          <Button
            onClick={onBackToMenu}
            className="bg-slate-700 hover:bg-slate-600 text-lg px-8 py-6"
          >
            ← Back to Menu
          </Button>
        </div>

        {/* Learning Resources */}
        <div className="mt-8 bg-amber-500/20 border border-amber-500/50 rounded-lg p-6">
          <h3 className="font-bold text-amber-400 mb-2 text-center">💡 Keep Learning</h3>
          <p className="text-sm text-slate-300 text-center">
            Check out our training modules to learn more about emergency preparedness and
            safety protocols!
          </p>
        </div>
      </div>
    </div>
  );
}
