"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Item {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

interface DisasterScenario {
  name: string;
  description: string;
  emoji: string;
  correctItems: string[];
  timeLimit: number;
}

export default function BackpackHeroGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "finished">("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [backpackItems, setBackpackItems] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ item: string; correct: boolean } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Available items
  const allItems: Item[] = [
    { id: "water", name: "Water Bottles", emoji: "💧", category: "essential" },
    { id: "flashlight", name: "Flashlight", emoji: "🔦", category: "essential" },
    { id: "firstaid", name: "First Aid Kit", emoji: "🩹", category: "essential" },
    { id: "food", name: "Non-perishable Food", emoji: "🥫", category: "essential" },
    { id: "radio", name: "Radio", emoji: "📻", category: "essential" },
    { id: "blanket", name: "Blanket", emoji: "🛏️", category: "warmth" },
    { id: "whistle", name: "Whistle", emoji: "🎵", category: "safety" },
    { id: "mask", name: "Face Mask", emoji: "😷", category: "safety" },
    { id: "batteries", name: "Batteries", emoji: "🔋", category: "essential" },
    { id: "phone", name: "Phone Charger", emoji: "🔌", category: "communication" },
    { id: "cash", name: "Cash", emoji: "💵", category: "essential" },
    { id: "medicine", name: "Medicine", emoji: "💊", category: "medical" },
    { id: "documents", name: "Important Documents", emoji: "📄", category: "essential" },
    { id: "rope", name: "Rope", emoji: "🪢", category: "safety" },
    { id: "knife", name: "Multi-tool", emoji: "🔪", category: "safety" },
    { id: "matches", name: "Matches/Lighter", emoji: "🔥", category: "survival" },
    { id: "clothes", name: "Extra Clothes", emoji: "👕", category: "warmth" },
    { id: "toiletries", name: "Toiletries", emoji: "🧴", category: "hygiene" },
    { id: "map", name: "Map", emoji: "🗺️", category: "navigation" },
    { id: "gloves", name: "Gloves", emoji: "🧤", category: "safety" },
  ];

  // Disaster scenarios
  const scenarios: DisasterScenario[] = [
    {
      name: "Earthquake Emergency",
      description: "A major earthquake has struck! Pack essentials for shelter and safety.",
      emoji: "🏚️",
      correctItems: ["water", "flashlight", "firstaid", "whistle", "radio", "food", "blanket", "batteries"],
      timeLimit: 60,
    },
    {
      name: "Flood Evacuation",
      description: "Floods are rising! Pack items to stay safe and dry during evacuation.",
      emoji: "🌊",
      correctItems: ["water", "food", "documents", "phone", "cash", "medicine", "flashlight", "clothes"],
      timeLimit: 60,
    },
    {
      name: "Wildfire Alert",
      description: "Wildfires approaching! Pack essentials for quick evacuation and breathing safety.",
      emoji: "🔥",
      correctItems: ["water", "mask", "documents", "cash", "phone", "medicine", "flashlight", "food"],
      timeLimit: 60,
    },
    {
      name: "Hurricane Preparation",
      description: "Hurricane incoming! Prepare for extended shelter-in-place or evacuation.",
      emoji: "🌪️",
      correctItems: ["water", "food", "flashlight", "radio", "batteries", "firstaid", "blanket", "documents"],
      timeLimit: 60,
    },
    {
      name: "Winter Storm",
      description: "Severe winter storm expected! Pack for warmth and extended power outage.",
      emoji: "❄️",
      correctItems: ["water", "food", "blanket", "clothes", "flashlight", "batteries", "matches", "gloves"],
      timeLimit: 60,
    },
  ];

  // Start game
  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(0);
    setScore(0);
    setBackpackItems([]);
    setTimeLeft(scenarios[0].timeLimit);
    startTimer();
  };

  // Start timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endLevel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End level
  const endLevel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calculate final score for this level
    const currentScenario = scenarios[currentLevel];
    const correctInBackpack = backpackItems.filter(item => 
      currentScenario.correctItems.includes(item)
    ).length;
    const incorrectInBackpack = backpackItems.filter(item => 
      !currentScenario.correctItems.includes(item)
    ).length;

    const levelScore = (correctInBackpack * 10) - (incorrectInBackpack * 10);
    setScore(prev => prev + levelScore);

    // Move to next level or finish game
    setTimeout(() => {
      if (currentLevel < scenarios.length - 1) {
        setCurrentLevel(prev => prev + 1);
        setBackpackItems([]);
        setTimeLeft(scenarios[currentLevel + 1].timeLimit);
        startTimer();
      } else {
        setGameState("finished");
      }
    }, 2000);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const currentScenario = scenarios[currentLevel];
    const isCorrect = currentScenario.correctItems.includes(draggedItem);

    if (!backpackItems.includes(draggedItem)) {
      setBackpackItems(prev => [...prev, draggedItem]);
      
      // Update score immediately
      if (isCorrect) {
        setScore(prev => prev + 10);
      } else {
        setScore(prev => prev - 10);
      }

      // Show feedback
      setFeedback({ item: draggedItem, correct: isCorrect });
      setTimeout(() => setFeedback(null), 1500);
    }

    setDraggedItem(null);
  };

  // Remove item from backpack
  const removeFromBackpack = (itemId: string) => {
    const currentScenario = scenarios[currentLevel];
    const isCorrect = currentScenario.correctItems.includes(itemId);
    
    setBackpackItems(prev => prev.filter(id => id !== itemId));
    
    // Reverse the score change
    if (isCorrect) {
      setScore(prev => prev - 10);
    } else {
      setScore(prev => prev + 10);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Get item by id
  const getItemById = (id: string) => allItems.find(item => item.id === id);

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-4xl font-bold">🎒 Backpack Hero</h1>
            <Link href="/games">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                ← Back to Games
              </Button>
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎒</div>
              <h2 className="text-3xl font-bold mb-4">Emergency Backpack Challenge</h2>
              <p className="text-xl text-slate-300">
                Test your disaster preparedness knowledge!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-500/20 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> How to Play
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Drag items from the shelf into your backpack</li>
                  <li>• Choose items based on the disaster scenario</li>
                  <li>• You have 60 seconds per level</li>
                  <li>• Pack wisely - wrong items lose points!</li>
                </ul>
              </div>

              <div className="bg-green-500/20 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Scoring
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Correct item: <span className="text-green-400 font-bold">+10 points</span></li>
                  <li>• Wrong item: <span className="text-red-400 font-bold">-10 points</span></li>
                  <li>• Complete all 5 disaster scenarios</li>
                  <li>• Aim for the highest score possible!</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">🚨 Disaster Scenarios</h3>
              <div className="grid grid-cols-5 gap-3 text-center">
                {scenarios.map((scenario, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-3 rounded-lg">
                    <div className="text-3xl mb-1">{scenario.emoji}</div>
                    <div className="text-xs font-semibold">{scenario.name.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-bold"
              >
                Start Challenge 🎒
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
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
            <p className="text-xl text-slate-300 mb-6">You've completed all disaster scenarios!</p>
            
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
                onClick={startGame}
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

  const currentScenario = scenarios[currentLevel];
  const progress = ((currentLevel + 1) / scenarios.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🎒 Backpack Hero</h1>
            <p className="text-slate-400">Level {currentLevel + 1} of {scenarios.length}</p>
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
            <div className="text-5xl">{currentScenario.emoji}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{currentScenario.name}</h2>
              <p className="text-slate-300">{currentScenario.description}</p>
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
              {allItems.map(item => {
                const inBackpack = backpackItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    draggable={!inBackpack}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className={`
                      bg-slate-700/50 p-4 rounded-lg text-center cursor-move
                      transition-all hover:scale-105 hover:bg-slate-700
                      ${inBackpack ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-lg'}
                    `}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="text-xs font-semibold leading-tight">{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backpack drop zone */}
          <div 
            className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border-4 border-dashed border-blue-500/50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🎒</span> Your Backpack ({backpackItems.length} items)
            </h3>
            
            {backpackItems.length === 0 ? (
              <div className="h-[450px] flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg">
                <div className="text-center text-slate-400">
                  <div className="text-6xl mb-4">🎒</div>
                  <p className="text-lg">Drag items here</p>
                  <p className="text-sm">Choose wisely based on the scenario!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
                {backpackItems.map(itemId => {
                  const item = getItemById(itemId);
                  if (!item) return null;
                  const isCorrect = currentScenario.correctItems.includes(itemId);
                  
                  return (
                    <div
                      key={itemId}
                      className={`
                        relative p-4 rounded-lg text-center
                        ${isCorrect ? 'bg-green-600/30 border-2 border-green-500' : 'bg-red-600/30 border-2 border-red-500'}
                        transition-all
                      `}
                    >
                      <button
                        onClick={() => removeFromBackpack(itemId)}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      >
                        ✕
                      </button>
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <div className="text-xs font-semibold leading-tight">{item.name}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 text-center">
              <Button
                onClick={endLevel}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3"
              >
                Submit & Next Level →
              </Button>
            </div>
          </div>
        </div>

        {/* Hints */}
        <div className="mt-6 bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
          <p className="text-sm text-center">
            💡 <strong>Tip:</strong> Think about what you'd need for survival, communication, and safety in this specific disaster!
          </p>
        </div>
      </div>
    </div>
  );
}
