"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Beat {
  id: number;
  time: number;
  hit: boolean;
  accuracy: "perfect" | "good" | "miss" | null;
}

export default function CPRRhythmGame() {
  const [gameState, setGameState] = useState<"menu" | "tutorial" | "playing" | "finished">("menu");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [targetReached, setTargetReached] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const compressionCountRef = useRef<number>(0);
  
  // CPR rhythm: 100-120 compressions per minute (ideal is 110 BPM)
  const BPM = 110;
  const BEAT_INTERVAL = 60000 / BPM; // milliseconds between beats
  const TARGET_COMPRESSIONS = 30; // Standard CPR cycle
  const GAME_DURATION = 30000; // 30 seconds
  
  // Hit zones
  const PERFECT_WINDOW = 100; // ms
  const GOOD_WINDOW = 200; // ms
  
  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error - webkitAudioContext is a legacy property
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Play beep sound
  const playBeep = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);
  
  // Generate beats
  const generateBeats = useCallback(() => {
    const newBeats: Beat[] = [];
    const numberOfBeats = Math.ceil(GAME_DURATION / BEAT_INTERVAL) + 5; // Add extra beats for visibility
    
    for (let i = 0; i < numberOfBeats; i++) {
      newBeats.push({
        id: i,
        time: i * BEAT_INTERVAL + 2000, // Start 2 seconds ahead for better visibility
        hit: false,
        accuracy: null,
      });
    }
    
    setBeats(newBeats);
  }, [BEAT_INTERVAL]);
  
  // Start game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentBeat(0);
    setTimeElapsed(0);
    setTargetReached(false);
    compressionCountRef.current = 0;
    generateBeats();
    startTimeRef.current = Date.now();
  };
  
  // Handle compression (spacebar or click)
  const handleCompression = useCallback(() => {
    if (gameState !== "playing") return;
    
    const currentTime = timeElapsed;
    let closestBeat: Beat | null = null;
    let minDiff = Infinity;
    
    // Find the closest unhit beat
    for (const beat of beats) {
      if (!beat.hit) {
        const diff = Math.abs(beat.time - currentTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestBeat = beat;
        }
      }
    }
    
    if (!closestBeat) return;
    
    // Check accuracy
    let accuracy: "perfect" | "good" | "miss" = "miss";
    let points = 0;
    let feedbackText = "";
    let feedbackColor = "";
    
    if (minDiff <= PERFECT_WINDOW) {
      accuracy = "perfect";
      points = 100;
      feedbackText = "PERFECT! 💯";
      feedbackColor = "#10b981";
      playBeep(800, 0.1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
    } else if (minDiff <= GOOD_WINDOW) {
      accuracy = "good";
      points = 50;
      feedbackText = "Good! ✓";
      feedbackColor = "#3b82f6";
      playBeep(600, 0.1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
    } else {
      accuracy = "miss";
      points = 0;
      feedbackText = "Too early/late ✗";
      feedbackColor = "#ef4444";
      playBeep(300, 0.15);
      setCombo(0);
    }
    
    // Update beat
    setBeats(prev => prev.map(b => 
      b.id === closestBeat!.id ? { ...b, hit: true, accuracy } : b
    ));
    
    setScore(prev => prev + points);
    setCurrentBeat(prev => {
      const newBeat = prev + 1;
      compressionCountRef.current = newBeat;
      
      // Check if target reached and end game
      if (newBeat >= TARGET_COMPRESSIONS) {
        setTargetReached(true);
        setTimeout(() => setGameState("finished"), 500); // Small delay to show final feedback
      }
      
      return newBeat;
    });
    
    // Show feedback
    setFeedback({ text: feedbackText, color: feedbackColor });
    setTimeout(() => setFeedback(null), 500);
    
  }, [gameState, timeElapsed, beats, playBeep]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameState === "playing") {
        e.preventDefault();
        handleCompression();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, handleCompression]);
  
  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      setTimeElapsed(elapsed);
      
      // End game after 30 compressions
      if (compressionCountRef.current >= TARGET_COMPRESSIONS) {
        return; // Let the handleCompression function trigger the end
      }
      
      // Also end if time runs out
      if (elapsed >= GAME_DURATION) {
        setGameState("finished");
        return;
      }
      
      // Clear canvas
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw CPR target zone (center)
      const targetY = canvas.height / 2;
      const targetHeight = 80;
      
      // Target zone background
      ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
      ctx.fillRect(0, targetY - targetHeight / 2, canvas.width, targetHeight);
      
      // Target zone borders
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.strokeRect(0, targetY - targetHeight / 2, canvas.width, targetHeight);
      
      // Perfect zone (inner)
      const perfectHeight = 40;
      ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
      ctx.fillRect(0, targetY - perfectHeight / 2, canvas.width, perfectHeight);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, targetY - perfectHeight / 2, canvas.width, perfectHeight);
      
      // Center line
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, targetY);
      ctx.lineTo(canvas.width, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw compression target icon at center
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.fillText("👐", canvas.width / 2, targetY + 15);
      
      // Draw guide lane (vertical track for beats)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
      ctx.lineWidth = 70;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      
      // Draw timing guides on the side
      const nextBeat = beats.find(b => !b.hit && b.time > elapsed);
      if (nextBeat) {
        const timeUntil = ((nextBeat.time - elapsed) / 1000).toFixed(1);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Next: ${timeUntil}s`, canvas.width - 30, targetY);
      }
      
      // Draw beats moving down
      beats.forEach((beat, index) => {
        // Calculate beat position based on time difference
        // Markers should appear from top and move down to center over time
        const timeUntilBeat = beat.time - elapsed;
        const scrollSpeed = 0.15; // pixels per millisecond
        const beatY = targetY - (timeUntilBeat * scrollSpeed);
        
        // Only draw if on screen
        if (beatY > -50 && beatY < canvas.height + 50) {
          if (!beat.hit) {
            // Draw approach line for next few beats
            if (index < 3 && beatY < targetY - 50) {
              ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.moveTo(canvas.width / 2, beatY);
              ctx.lineTo(canvas.width / 2, targetY - 40);
              ctx.stroke();
              ctx.setLineDash([]);
            }
            
            // Unhit beat
            ctx.fillStyle = "#ef4444";
            ctx.strokeStyle = "#dc2626";
            ctx.lineWidth = 3;
            
            // Make beat larger and more visible
            const beatSize = 25;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, beatY, beatSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Add inner circle for depth
            ctx.fillStyle = "#ff6b6b";
            ctx.beginPath();
            ctx.arc(canvas.width / 2, beatY, beatSize - 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Beat number or indicator
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.fillText((beat.id + 1).toString(), canvas.width / 2, beatY + 5);
            
            // Pulse effect when near target
            if (Math.abs(beatY - targetY) < 100) {
              const pulseSize = 40 - (Math.abs(beatY - targetY) / 100) * 15;
              ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(canvas.width / 2, beatY, pulseSize, 0, Math.PI * 2);
              ctx.stroke();
            }
          } else if (beat.accuracy) {
            // Hit beat with feedback - fade out over time
            const fadeTime = 500; // ms
            const timeSinceHit = elapsed - beat.time;
            const alpha = Math.max(0, 1 - (timeSinceHit / fadeTime));
            
            if (alpha > 0) {
              const color = beat.accuracy === "perfect" ? "#10b981" : 
                           beat.accuracy === "good" ? "#3b82f6" : "#ef4444";
              ctx.fillStyle = color;
              ctx.globalAlpha = alpha;
              ctx.font = "bold 32px Arial";
              ctx.textAlign = "center";
              ctx.fillText(
                beat.accuracy === "perfect" ? "★" : 
                beat.accuracy === "good" ? "✓" : "✗", 
                canvas.width / 2, targetY + 10
              );
              ctx.globalAlpha = 1;
            }
          }
        }
      });
      
      // Play metronome beep for upcoming beats
      beats.forEach(beat => {
        const timeDiff = beat.time - elapsed;
        if (!beat.hit && timeDiff > -50 && timeDiff < 50) {
          playBeep(400, 0.05);
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, beats, playBeep]);
  
  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-red-950 to-slate-900 text-white p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-4xl font-bold">❤️ CPR Rhythm Master</h1>
            <Link href="/games">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                ← Back to Games
              </Button>
            </Link>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🫀</div>
              <h2 className="text-3xl font-bold mb-4">Learn Life-Saving CPR Rhythm</h2>
              <p className="text-xl text-slate-300">
                Master the correct compression timing with this rhythm game!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-500/20 p-6 rounded-lg border border-red-500/50">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> How to Play
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Press <kbd className="px-2 py-1 bg-slate-700 rounded">SPACE</kbd> or click to perform compressions</li>
                  <li>• Hit the red markers when they reach the center zone</li>
                  <li>• Match the rhythm of 110 compressions per minute</li>
                  <li>• <strong>Complete 30 compressions to finish!</strong></li>
                </ul>
              </div>
              
              <div className="bg-green-500/20 p-6 rounded-lg border border-green-500/50">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Scoring
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• <span className="text-green-400 font-bold">Perfect (100pts):</span> Hit in green zone</li>
                  <li>• <span className="text-blue-400 font-bold">Good (50pts):</span> Hit in blue zone</li>
                  <li>• <span className="text-red-400 font-bold">Miss (0pts):</span> Too early/late</li>
                  <li>• Build combos for consistent rhythm!</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">📚 Real CPR Facts</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• <strong>Ideal Rate:</strong> 100-120 compressions per minute (we use 110 BPM)</li>
                <li>• <strong>Depth:</strong> Push down at least 2 inches (5cm) on adult chest</li>
                <li>• <strong>Cycle:</strong> 30 compressions, then 2 rescue breaths</li>
                <li>• <strong>Song Reference:</strong> &quot;Stayin&apos; Alive&quot; by Bee Gees matches the rhythm!</li>
                <li>• <strong>Don&apos;t Stop:</strong> Continue until help arrives or person recovers</li>
              </ul>
            </div>
            
            <div className="text-center space-y-3">
              <Button 
                onClick={() => setGameState("tutorial")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold"
              >
                Start Training ❤️
              </Button>
              <p className="text-xs text-slate-400">
                🎧 Sound indicators included - turn on your audio!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (gameState === "tutorial") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-red-950 to-slate-900 text-white p-6">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">🎓 Quick Tutorial</h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">1️⃣ Watch the Markers</h3>
                <p className="text-slate-300">Red circular markers will fall from the top of the screen toward the center target zone.</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">2️⃣ Time Your Compression</h3>
                <p className="text-slate-300">Press SPACE or click when the marker reaches the center hands icon (👐).</p>
                <div className="mt-3 flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-1">🟢</div>
                    <div className="text-xs">Perfect Zone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-1">🔵</div>
                    <div className="text-xs">Good Zone</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">3️⃣ Keep the Rhythm</h3>
                <p className="text-slate-300">Listen to the metronome beeps and maintain steady timing. The rhythm is 110 BPM - like &quot;Stayin&apos; Alive&quot;!</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">4️⃣ Complete 30 Compressions</h3>
                <p className="text-slate-300">The game ends when you successfully complete 30 compressions. Try to get as many Perfect and Good hits as possible!</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={startGame}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold"
              >
                Start CPR Training! 🫀
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (gameState === "finished") {
    const accuracy = beats.length > 0 ? 
      Math.round((beats.filter(b => b.accuracy === "perfect" || b.accuracy === "good").length / beats.length) * 100) : 0;
    const perfectCount = beats.filter(b => b.accuracy === "perfect").length;
    const goodCount = beats.filter(b => b.accuracy === "good").length;
    const missCount = beats.filter(b => b.accuracy === "miss" || !b.hit).length;
    
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-red-950 to-slate-900 text-white p-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {accuracy >= 80 ? "🏆" : accuracy >= 60 ? "🎉" : accuracy >= 40 ? "💪" : "📖"}
            </div>
            <h2 className="text-4xl font-bold mb-4">
              {accuracy >= 80 ? "CPR Expert!" : accuracy >= 60 ? "Good Rhythm!" : accuracy >= 40 ? "Keep Practicing!" : "Learning!"}
            </h2>
            <p className="text-xl text-slate-300 mb-6">
              {targetReached ? "✅ You completed 30 compressions!" : "Keep training to save lives!"}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-yellow-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-400">{score}</div>
                <div className="text-sm text-slate-300">Total Score</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-400">{accuracy}%</div>
                <div className="text-sm text-slate-300">Accuracy</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{perfectCount}</div>
                <div className="text-xs text-slate-400">Perfect ★</div>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{goodCount}</div>
                <div className="text-xs text-slate-400">Good ✓</div>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{missCount}</div>
                <div className="text-xs text-slate-400">Miss ✗</div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
              <div className="text-sm text-slate-300">
                <strong>Max Combo:</strong> {maxCombo} • <strong>Compressions:</strong> {currentBeat}
              </div>
            </div>
            
            {accuracy >= 80 && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                <p className="text-green-300 font-semibold">
                  🎓 Excellent! You&apos;ve mastered the CPR rhythm!
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={startGame}
                className="bg-red-600 hover:bg-red-700 text-white w-full py-6 text-lg font-bold"
              >
                Practice Again 🔄
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
  
  const timeLeft = Math.max(0, Math.ceil((GAME_DURATION - timeElapsed) / 1000));
  const progress = (currentBeat / TARGET_COMPRESSIONS) * 100;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-red-950 to-slate-900 text-white p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">❤️ CPR Rhythm Master</h1>
            <p className="text-slate-400">Match the rhythm to save a life!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-400">⭐ {score}</div>
            <div className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-sm text-slate-400">Compressions</div>
            <div className="text-2xl font-bold">{currentBeat} / {TARGET_COMPRESSIONS}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-sm text-slate-400">Combo</div>
            <div className="text-2xl font-bold text-purple-400">{combo}x</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-sm text-slate-400">Target BPM</div>
            <div className="text-2xl font-bold text-red-400">{BPM}</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4 bg-slate-800/50 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-red-500 h-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* Feedback */}
        {feedback && (
          <div 
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 
            px-8 py-4 rounded-xl shadow-2xl text-2xl font-bold animate-bounce"
            style={{ backgroundColor: feedback.color }}
          >
            {feedback.text}
          </div>
        )}
        
        {/* Game canvas */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-4 border-slate-700 rounded-lg shadow-2xl cursor-pointer"
              onClick={handleCompression}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
              bg-slate-900/90 px-6 py-2 rounded-full text-sm font-semibold border-2 border-blue-500">
              Press SPACE or Click to Compress
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 text-center">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Listen to the beeps and follow the rhythm! Hit the markers when they align with the center hands icon.
          </p>
        </div>
      </div>
    </div>
  );
}
