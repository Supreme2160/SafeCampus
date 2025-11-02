import { QuizQuestion } from "../types";
import { Button } from "@/components/ui/button";

interface QuizGameScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  question: QuizQuestion;
  selectedAnswer: string | null;
  isAnswered: boolean;
  score: number;
  timeLeft: number;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
}

export function QuizGameScreen({
  currentQuestion,
  totalQuestions,
  question,
  selectedAnswer,
  isAnswered,
  score,
  timeLeft,
  onSelectAnswer,
  onNextQuestion,
}: QuizGameScreenProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧠 Safety Quiz</h1>
            <p className="text-slate-400">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">⭐ {score} pts</div>
            <div
              className={`text-xl font-bold ${
                timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-blue-400"
              }`}
            >
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-slate-800/50 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">❓</div>
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-2">{question.theme}</p>
              <h2 className="text-2xl font-bold">{question.questionText}</h2>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let optionClass = "bg-slate-700/50 hover:bg-slate-700 border-slate-600";
              
              if (isAnswered) {
                if (option === question.correctAnswer) {
                  optionClass = "bg-green-600/30 border-green-500 ring-2 ring-green-500";
                } else if (option === selectedAnswer) {
                  optionClass = "bg-red-600/30 border-red-500 ring-2 ring-red-500";
                } else {
                  optionClass = "bg-slate-700/30 border-slate-700";
                }
              } else if (option === selectedAnswer) {
                optionClass = "bg-blue-600/50 border-blue-500 ring-2 ring-blue-500";
              }

              return (
                <button
                  key={index}
                  onClick={() => !isAnswered && onSelectAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all
                    ${optionClass} ${!isAnswered ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-slate-400">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg">{option}</span>
                    {isAnswered && option === question.correctAnswer && (
                      <span className="ml-auto text-2xl">✅</span>
                    )}
                    {isAnswered && option === selectedAnswer && option !== question.correctAnswer && (
                      <span className="ml-auto text-2xl">❌</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-500/20 border border-green-500/50"
                  : "bg-red-500/20 border border-red-500/50"
              }`}
            >
              <p className="font-bold mb-2">
                {isCorrect ? "🎉 Correct! +10 points" : "❌ Incorrect"}
              </p>
              {question.explanation && (
                <p className="text-sm text-slate-300">{question.explanation}</p>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-center">
            <Button
              onClick={onNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              {currentQuestion < totalQuestions - 1 ? "Next Question →" : "See Results →"}
            </Button>
          </div>
        )}

        {/* Hint */}
        {!isAnswered && (
          <div className="mt-6 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
            <p className="text-sm text-center">
              💡 <strong>Tip:</strong> Think carefully about safety protocols and best
              practices before selecting your answer!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
