import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DisasterScenario } from "../types";

interface ResultsScreenProps {
  score: number;
  scenarios: DisasterScenario[];
  onRestart: () => void;
}

export function ResultsScreen({ score, scenarios, onRestart }: ResultsScreenProps) {
  const maxPossibleScore = scenarios.reduce((acc, s) => acc + (s.correctItems.length * 10), 0);
  const percentage = Math.max(0, Math.round((score / maxPossibleScore) * 100));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : percentage >= 40 ? "👍" : "📚"}
          </div>
          <h2 className="text-4xl font-bold mb-4">
            {percentage >= 80 ? "Expert Prepper!" : percentage >= 60 ? "Well Prepared!" : percentage >= 40 ? "Good Effort!" : "Keep Learning!"}
          </h2>
          <p className="text-xl text-slate-300 mb-6">You&apos;ve completed all disaster scenarios!</p>
          
          <div className="bg-blue-500/20 rounded-lg p-6 mb-6">
            <div className="text-5xl font-bold text-blue-400 mb-2">{score}</div>
            <div className="text-lg text-slate-300">Total Points</div>
            <div className="mt-4 text-sm text-slate-400">
              Accuracy: {percentage}% ({score} / {maxPossibleScore} possible points)
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {scenarios.map((scenario, idx) => (
              <div key={idx} className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl mb-1">{scenario.emoji}</div>
                <div className="text-xs text-slate-400">Level {idx + 1}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-6 text-lg font-bold"
            >
              Play Again 🔄
            </Button>
            <Link href="/games" className="block">
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 w-full py-6"
              >
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
