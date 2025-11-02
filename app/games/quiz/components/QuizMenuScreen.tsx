import { Quiz } from "../types";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/custom/navbar/navbar";
interface QuizMenuScreenProps {
  quizzes: Quiz[];
  onSelectQuiz: (quizIndex: number) => void;
}

export function QuizMenuScreen({ quizzes, onSelectQuiz }: QuizMenuScreenProps) {

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">

        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4">🧠 Safety Quiz Challenge</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Test your knowledge of emergency preparedness and disaster safety!
              Choose a quiz below to get started.
            </p>
          </div>

          {/* Quiz Selection Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {quizzes.map((quiz, index) => (
              <div
                key={quiz.id}
                className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all hover:transform hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">📋</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
                    <p className="text-slate-300 mb-4">{quiz.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {quiz.questions.length} questions
                      </span>
                      <Button
                        onClick={() => onSelectQuiz(index)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Start Quiz →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-bold text-blue-400 mb-2">Multiple Choice</h3>
              <p className="text-sm text-slate-300">
                Choose the best answer for each question
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">⏱️</div>
              <h3 className="font-bold text-green-400 mb-2">Timed Challenge</h3>
              <p className="text-sm text-slate-300">
                Answer questions before time runs out
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="font-bold text-purple-400 mb-2">Instant Feedback</h3>
              <p className="text-sm text-slate-300">
                Learn from correct and incorrect answers
              </p>
            </div>
          </div>
        </div>
      </div></>
  );
}
