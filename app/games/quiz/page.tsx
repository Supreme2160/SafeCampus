"use client";

import { useEffect, useState, useRef } from "react";
import { Quiz, QuizQuestion, QuizResult } from "./types";
import { QuizMenuScreen } from "./components/QuizMenuScreen";
import { QuizGameScreen } from "./components/QuizGameScreen";
import { QuizResultsScreen } from "./components/QuizResultsScreen";
import Navbar from "@/components/custom/navbar/navbar";

export default function QuizGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "finished">("menu");
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
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
          gameName: "EARTHQUAKE", // You can make this dynamic based on quiz theme
          gameType: "QUIZ",
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

  // Quiz data - can be fetched from API later
  const quizzes: Quiz[] = [
    {
      id: "earthquake-safety",
      title: "Earthquake Safety Quiz",
      description: "Test your knowledge of earthquake preparedness and response protocols.",
      questions: [
        {
          id: "eq1",
          questionText: "What is the safest immediate action during an earthquake?",
          options: [
            "Run outside immediately",
            "Drop, Cover, and Hold On",
            "Stand in a doorway",
            "Use the elevator to evacuate",
          ],
          correctAnswer: "Drop, Cover, and Hold On",
          theme: "EARTHQUAKE",
          explanation: "Drop, Cover, and Hold On is the internationally recommended response to protect yourself from falling debris and injuries during an earthquake.",
        },
        {
          id: "eq2",
          questionText: "Which place is typically safest indoors during an earthquake?",
          options: [
            "Near windows",
            "Under sturdy furniture",
            "Next to tall shelves",
            "In the elevator",
          ],
          correctAnswer: "Under sturdy furniture",
          theme: "EARTHQUAKE",
          explanation: "Getting under sturdy furniture like a desk or table protects you from falling objects and debris.",
        },
        {
          id: "eq3",
          questionText: "After an earthquake stops, what should you do first?",
          options: [
            "Call everyone you know",
            "Check for injuries and hazards",
            "Take photos for insurance",
            "Go back to sleep",
          ],
          correctAnswer: "Check for injuries and hazards",
          theme: "EARTHQUAKE",
          explanation: "Immediately check yourself and others for injuries, and look for hazards like gas leaks, damaged structures, or fire.",
        },
        {
          id: "eq4",
          questionText: "What should be in an earthquake emergency kit?",
          options: [
            "Video games and snacks",
            "Water, food, flashlight, and first aid",
            "Party decorations",
            "Expensive jewelry",
          ],
          correctAnswer: "Water, food, flashlight, and first aid",
          theme: "EARTHQUAKE",
          explanation: "Essential supplies like water, non-perishable food, a flashlight, and first aid kit are critical for survival after an earthquake.",
        },
        {
          id: "eq5",
          questionText: "How many days of supplies should you have in your emergency kit?",
          options: ["1 day", "2 days", "3 days", "1 week"],
          correctAnswer: "3 days",
          theme: "EARTHQUAKE",
          explanation: "Experts recommend having at least 3 days of supplies as emergency services may be delayed after a major earthquake.",
        },
      ],
    },
    {
      id: "flood-safety",
      title: "Flood Safety Basics",
      description: "Learn essential flood preparedness and evacuation procedures.",
      questions: [
        {
          id: "fl1",
          questionText: "What is the most important item in a flood evacuation kit?",
          options: ["Candles", "Bottled water", "Heavy textbooks", "Paint supplies"],
          correctAnswer: "Bottled water",
          theme: "FLOOD",
          explanation: "Clean drinking water is essential as flood water is contaminated and tap water may not be safe.",
        },
        {
          id: "fl2",
          questionText: "What should you do when driving and encountering flood water?",
          options: [
            "Drive through slowly",
            "Turn around, don't drown",
            "Speed through quickly",
            "Wait in the water",
          ],
          correctAnswer: "Turn around, don't drown",
          theme: "FLOOD",
          explanation: "Just 6 inches of moving water can knock you down, and 12 inches can carry away a car. Never drive through flooded areas.",
        },
        {
          id: "fl3",
          questionText: "How many inches of fast-moving water can sweep away a vehicle?",
          options: ["2 inches", "6 inches", "12 inches", "24 inches"],
          correctAnswer: "12 inches",
          theme: "FLOOD",
          explanation: "As little as 12 inches of rushing water can carry away most cars, and 24 inches can sweep away large vehicles.",
        },
        {
          id: "fl4",
          questionText: "Where should you move during a flood warning?",
          options: [
            "Basement",
            "Higher ground",
            "Near the river",
            "Underground parking",
          ],
          correctAnswer: "Higher ground",
          theme: "FLOOD",
          explanation: "Always move to higher ground during floods. Avoid basements, low-lying areas, and areas near water.",
        },
        {
          id: "fl5",
          questionText: "What should you avoid touching during a flood?",
          options: [
            "Dry clothing",
            "Electrical equipment",
            "Bottled water",
            "Your emergency supplies",
          ],
          correctAnswer: "Electrical equipment",
          theme: "FLOOD",
          explanation: "Water conducts electricity. Never touch electrical equipment if you're wet or standing in water to avoid electrocution.",
        },
      ],
    },
    {
      id: "fire-safety",
      title: "Fire Safety Knowledge",
      description: "Master fire prevention, detection, and evacuation strategies.",
      questions: [
        {
          id: "fi1",
          questionText: "What should you do if your clothes catch fire?",
          options: [
            "Run to find water",
            "Stop, Drop, and Roll",
            "Wave your arms",
            "Keep walking normally",
          ],
          correctAnswer: "Stop, Drop, and Roll",
          theme: "FOREST_FIRE",
          explanation: "Stop, Drop, and Roll smothers the flames by cutting off oxygen. Running makes the fire worse.",
        },
        {
          id: "fi2",
          questionText: "How often should you test your smoke detectors?",
          options: ["Once a year", "Every 6 months", "Once a month", "Never"],
          correctAnswer: "Once a month",
          theme: "FOREST_FIRE",
          explanation: "Smoke detectors should be tested monthly and batteries replaced at least once a year to ensure they work properly.",
        },
        {
          id: "fi3",
          questionText: "What is the best way to escape a room filled with smoke?",
          options: [
            "Walk upright quickly",
            "Crawl low under the smoke",
            "Jump out the window",
            "Wait for help",
          ],
          correctAnswer: "Crawl low under the smoke",
          theme: "FOREST_FIRE",
          explanation: "Smoke rises, so cleaner, cooler air is near the floor. Crawling low helps you breathe and see better.",
        },
        {
          id: "fi4",
          questionText: "Where should you meet after evacuating during a fire?",
          options: [
            "Back inside to check",
            "At a designated meeting point outside",
            "In your neighbor's house",
            "In your car",
          ],
          correctAnswer: "At a designated meeting point outside",
          theme: "FOREST_FIRE",
          explanation: "Having a predetermined meeting point ensures everyone is accounted for and prevents people from going back inside.",
        },
        {
          id: "fi5",
          questionText: "What is the universal emergency number in most countries?",
          options: ["911", "112", "Both 911 and 112", "999"],
          correctAnswer: "Both 911 and 112",
          theme: "FOREST_FIRE",
          explanation: "911 is used in North America, while 112 is the emergency number for most of the world. Many countries accept both.",
        },
      ],
    },
  ];

  // Start quiz
  const startQuiz = (quizIndex: number) => {
    setSelectedQuizIndex(quizIndex);
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
    startTimer();
  };

  // Start timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle timeout
  const handleTimeout = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!isAnswered) {
      setAnswers((prev) => [...prev, false]);
      setTimeout(() => nextQuestion(), 2000);
    }
  };

  // Select answer
  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const currentQuiz = quizzes[selectedQuizIndex];
    const question = currentQuiz.questions[currentQuestion];
    const correct = answer === question.correctAnswer;

    if (correct) {
      setScore((prev) => prev + 10);
    }

    setAnswers((prev) => [...prev, correct]);
  };

  // Next question
  const nextQuestion = () => {
    const currentQuiz = quizzes[selectedQuizIndex];

    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
      startTimer();
    } else {
      // Quiz finished
      setGameState("finished");

      // Save score to database
      saveGameScore(score);
    }
  };

  // Get results
  const getResults = (): QuizResult => {
    const correct = answers.filter((a) => a).length;
    const total = answers.length;
    const percentage = total > 0 ? (correct / total) * 100 : 0;

    return { correct, total, percentage };
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Render appropriate screen
  if (gameState === "menu") {
    return <QuizMenuScreen quizzes={quizzes} onSelectQuiz={startQuiz} />;
  }

  if (gameState === "finished") {
    const currentQuiz = quizzes[selectedQuizIndex];
    return (
      <QuizResultsScreen
        result={getResults()}
        quizTitle={currentQuiz.title}
        onRestart={() => startQuiz(selectedQuizIndex)}
        onBackToMenu={() => setGameState("menu")}
      />
    );
  }

  const currentQuiz = quizzes[selectedQuizIndex];
  const question = currentQuiz.questions[currentQuestion];

  return (
    <>
      <QuizGameScreen
        currentQuestion={currentQuestion}
        totalQuestions={currentQuiz.questions.length}
        question={question}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        score={score}
        timeLeft={timeLeft}
        onSelectAnswer={handleSelectAnswer}
        onNextQuestion={nextQuestion}
      /></>
  );
}
