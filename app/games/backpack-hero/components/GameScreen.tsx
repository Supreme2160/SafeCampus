import { Item, DisasterScenario } from "../types";
import { ItemCard } from "./ItemCard";
import { BackpackZone } from "./BackpackZone";

interface GameScreenProps {
  currentLevel: number;
  totalLevels: number;
  score: number;
  timeLeft: number;
  scenario: DisasterScenario;
  allItems: Item[];
  backpackItems: string[];
  feedback: { item: string; correct: boolean } | null;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemove: (itemId: string) => void;
  onSubmit: () => void;
}

export function GameScreen({
  currentLevel,
  totalLevels,
  score,
  timeLeft,
  scenario,
  allItems,
  backpackItems,
  feedback,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  onSubmit,
}: GameScreenProps) {
  const progress = ((currentLevel + 1) / totalLevels) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🎒 Backpack Hero</h1>
            <p className="text-slate-400">Level {currentLevel + 1} of {totalLevels}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">⭐ {score} pts</div>
            <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 bg-slate-800/50 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Scenario card */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{scenario.emoji}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{scenario.name}</h2>
              <p className="text-slate-300">{scenario.description}</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
            ${feedback.correct ? 'bg-green-600' : 'bg-red-600'} px-8 py-4 rounded-xl shadow-2xl
            animate-bounce text-xl font-bold`}>
            {feedback.correct ? '✅ Correct! +10' : '❌ Wrong! -10'}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Items shelf */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📦</span> Available Items
            </h3>
            <div className="grid grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
              {allItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  disabled={backpackItems.includes(item.id)}
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          </div>

          {/* Backpack drop zone */}
          <BackpackZone
            backpackItems={backpackItems}
            correctItems={scenario.correctItems}
            allItems={allItems}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onRemove={onRemove}
            onSubmit={onSubmit}
          />
        </div>

        {/* Hints */}
        <div className="mt-6 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
          <p className="text-sm text-center">
            💡 <strong>Tip:</strong> Think about what you&apos;d need for survival, communication, and safety in this specific disaster!
          </p>
        </div>
      </div>
    </div>
  );
}
