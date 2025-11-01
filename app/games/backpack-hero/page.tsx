"use client";

import { useEffect, useState, useRef } from "react";
import { Item, DisasterScenario } from "./types";
import { MenuScreen } from "./components/MenuScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultsScreen } from "./components/ResultsScreen";

export default function BackpackHeroGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "finished">("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [backpackItems, setBackpackItems] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ item: string; correct: boolean } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save game score to database
  const saveGameScore = async (finalScore: number) => {
    try {
      const response = await fetch("/api/games/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameName: "BACKPACK_HERO",
          gameType: "ADVENTURE",
          score: finalScore,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Failed to save game score:", data.error);
      } else {
        console.log("Game score saved successfully:", data);
      }
    } catch (error) {
      console.error("Error saving game score:", error);
    }
  };

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
        // Calculate final score before finishing
        const finalScore = score + levelScore;
        setGameState("finished");
        
        // Save score to database
        saveGameScore(finalScore);
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

  if (gameState === "menu") {
    return <MenuScreen scenarios={scenarios} onStart={startGame} />;
  }

  if (gameState === "finished") {
    return <ResultsScreen score={score} scenarios={scenarios} onRestart={startGame} />;
  }

  const currentScenario = scenarios[currentLevel];

  return (
    <GameScreen
      currentLevel={currentLevel}
      totalLevels={scenarios.length}
      score={score}
      timeLeft={timeLeft}
      scenario={currentScenario}
      allItems={allItems}
      backpackItems={backpackItems}
      feedback={feedback}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onRemove={removeFromBackpack}
      onSubmit={endLevel}
    />
  );
}
