"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EarthquakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const livesRef = useRef(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 600;

    // Game state
    let animationFrameId: number;
    let gameOver = false;
    let victory = false;
    let currentLives = 3;
    let currentLevel = 1;
    const maxLevel = 3;

    // Player
    const player = {
      x: 100,
      y: 500,
      width: 35,
      height: 50,
      speed: 2.5, // Reduced from 5 to 2.5 for slower movement
      color: "#3b82f6",
      direction: 1, // 1 for right, -1 for left
    };

    // Keys pressed
    const keys: { [key: string]: boolean } = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    // Level configurations
    const levels = [
      {
        // Level 1 - Classroom
        safeZones: [
          { x: 320, y: 450, width: 160, height: 90, color: "#86a361", label: "Under Desk" },
        ],
        obstacles: [
          { x: 200, y: 480, width: 100, height: 120, color: "#8b6f47", label: "Bookshelf" },
          { x: 500, y: 450, width: 120, height: 150, color: "#6b5642", label: "Teacher's Desk" },
          { x: 700, y: 480, width: 90, height: 120, color: "#8b6f47", label: "Cabinet" },
          { x: 900, y: 400, width: 100, height: 200, color: "#7a5c42", label: "Lockers" },
        ],
        debrisCount: 4,
        debrisSpeed: { min: 0.8, max: 1.5 },
      },
      {
        // Level 2 - Hallway
        safeZones: [
          { x: 550, y: 380, width: 140, height: 180, color: "#4c5f99", label: "Door Frame" },
        ],
        obstacles: [
          { x: 150, y: 400, width: 80, height: 200, color: "#8b6f47", label: "Wall" },
          { x: 300, y: 450, width: 150, height: 150, color: "#6b5642", label: "Water Fountain" },
          { x: 750, y: 400, width: 100, height: 200, color: "#7a5c42", label: "Fire Extinguisher" },
          { x: 950, y: 480, width: 120, height: 120, color: "#8b6f47", label: "Bench" },
        ],
        debrisCount: 5,
        debrisSpeed: { min: 1.0, max: 1.8 },
      },
      {
        // Level 3 - Cafeteria
        safeZones: [
          { x: 880, y: 400, width: 200, height: 150, color: "#5c8fb0", label: "Safe Corner" },
        ],
        obstacles: [
          { x: 180, y: 480, width: 140, height: 120, color: "#8b6f47", label: "Serving Counter" },
          { x: 380, y: 450, width: 120, height: 150, color: "#6b5642", label: "Table" },
          { x: 550, y: 480, width: 100, height: 120, color: "#7a5c42", label: "Vending Machine" },
          { x: 700, y: 420, width: 130, height: 180, color: "#8b6f47", label: "Table" },
        ],
        debrisCount: 6,
        debrisSpeed: { min: 1.2, max: 2.0 },
      },
    ];

    let safeZones = [...levels[0].safeZones];
    let obstacles = [...levels[0].obstacles];

    // Dangerous objects (red bordered - falling debris)
    const debris: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      color: string;
    }> = [];

    // Initialize debris based on level
    const initDebris = (levelIndex: number) => {
      debris.length = 0;
      const levelConfig = levels[levelIndex];
      for (let i = 0; i < levelConfig.debrisCount; i++) {
        debris.push({
          x: Math.random() * (canvas.width - 50) + 50,
          y: -Math.random() * 400 - 50,
          width: 25 + Math.random() * 25,
          height: 25 + Math.random() * 25,
          speed: levelConfig.debrisSpeed.min + Math.random() * (levelConfig.debrisSpeed.max - levelConfig.debrisSpeed.min),
          color: "#b45a5a",
        });
      }
    };

    initDebris(0);

    // Warning signs (orange triangles) - positioned above obstacles
    let warnings = [
      { x: 250, y: 50 },
      { x: 550, y: 80 },
      { x: 750, y: 60 },
      { x: 950, y: 70 },
    ];

    // Particles for earthquake effect
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];

    let earthQuakeIntensity = 0;
    let earthquakeTimer = 0;

    // Event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys) {
        keys[key] = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys) {
        keys[key] = false;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Check collision
    const checkCollision = (rect1: any, rect2: any) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    // Create particles
    const createParticles = (x: number, y: number) => {
      for (let i = 0; i < 10; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
        });
      }
    };

    // Game loop
    const gameLoop = () => {
      if (gameOver || victory) {
        return;
      }

      // Clear canvas
      ctx.fillStyle = "#f5e6d3";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient sky
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
      gradient.addColorStop(0, "#f5d7b8");
      gradient.addColorStop(1, "#f5e6d3");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

      // Earthquake effect
      earthquakeTimer++;
      if (earthquakeTimer % 60 < 30) {
        earthQuakeIntensity = Math.sin(earthquakeTimer * 0.2) * 3;
      } else {
        earthQuakeIntensity = 0;
      }

      ctx.save();
      ctx.translate(earthQuakeIntensity, earthQuakeIntensity * 0.5);

      // Draw particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "#d4a574";
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) {
          particles.splice(index, 1);
        }
      });
      ctx.globalAlpha = 1;

      // Add falling particles from top (reduced frequency)
      if (Math.random() < 0.15) {
        particles.push({
          x: Math.random() * canvas.width,
          y: 0,
          vx: (Math.random() - 0.5) * 2,
          vy: 2 + Math.random() * 2,
          life: 1,
        });
      }

      // Draw ground obstacles (buildings/furniture)
      obstacles.forEach((obs: any) => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = "#5a4a32";
        ctx.lineWidth = 3;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        
        // Add some detail to obstacles
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, obs.height * 0.3);
        
        // Label
        if (obs.label) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(obs.label, obs.x + obs.width / 2, obs.y - 8);
        }
      });

      // Draw safe zones
      safeZones.forEach((zone) => {
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        // Green dashed border
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(zone.label, zone.x + zone.width / 2, zone.y + zone.height / 2);
      });

      // Draw and update debris
      debris.forEach((d) => {
        d.y += d.speed;

        // Reset debris when it falls off screen
        if (d.y > canvas.height) {
          d.y = -50;
          d.x = Math.random() * (canvas.width - 50) + 50;
          d.speed = 2 + Math.random() * 3;
        }

        ctx.fillStyle = d.color;
        ctx.fillRect(d.x, d.y, d.width, d.height);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.strokeRect(d.x, d.y, d.width, d.height);

        // Check collision with player
        if (checkCollision(player, d)) {
          createParticles(player.x + player.width / 2, player.y + player.height / 2);
          d.y = -50;
          d.x = Math.random() * (canvas.width - 50) + 50;
          currentLives -= 1;
          setLives(currentLives);
          livesRef.current = currentLives;
          if (currentLives <= 0) {
            gameOver = true;
            setGameState("lost");
          }
        }
      });

      // Draw warning signs
      warnings.forEach((w) => {
        // Draw triangle
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.moveTo(w.x, w.y);
        ctx.lineTo(w.x - 15, w.y + 25);
        ctx.lineTo(w.x + 15, w.y + 25);
        ctx.closePath();
        ctx.fill();

        // Exclamation mark
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("!", w.x, w.y + 20);
      });

      // Player movement
      if (keys.w && player.y > 0) player.y -= player.speed;
      if (keys.s && player.y < canvas.height - player.height) player.y += player.speed;
      if (keys.a && player.x > 0) {
        player.x -= player.speed;
        player.direction = -1;
      }
      if (keys.d && player.x < canvas.width - player.width) {
        player.x += player.speed;
        player.direction = 1;
      }

      // Check collision with obstacles
      obstacles.forEach((obs) => {
        if (checkCollision(player, obs)) {
          // Push player back
          if (keys.w) player.y += player.speed;
          if (keys.s) player.y -= player.speed;
          if (keys.a) player.x += player.speed;
          if (keys.d) player.x -= player.speed;
        }
      });

      // Draw player with better model
      const drawPlayer = () => {
        const centerX = player.x + player.width / 2;
        const headRadius = 12;
        const bodyHeight = 22;
        const legLength = 12;
        
        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.ellipse(centerX, player.y + player.height + 2, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = "#ffd1a3";
        ctx.beginPath();
        ctx.arc(centerX, player.y + headRadius, headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#cc9966";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Face
        // Eyes
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(centerX - 4 * player.direction, player.y + headRadius - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 4 * player.direction, player.y + headRadius - 2, 2, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.beginPath();
        ctx.arc(centerX, player.y + headRadius + 3, 4, 0, Math.PI);
        ctx.stroke();

        // Body
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(
          player.x + (player.width - 20) / 2,
          player.y + headRadius * 2 - 2,
          20,
          bodyHeight
        );
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          player.x + (player.width - 20) / 2,
          player.y + headRadius * 2 - 2,
          20,
          bodyHeight
        );

        // Arms
        ctx.fillStyle = "#3b82f6";
        // Left arm
        ctx.fillRect(
          player.x + (player.width - 20) / 2 - 6,
          player.y + headRadius * 2 + 2,
          6,
          16
        );
        // Right arm
        ctx.fillRect(
          player.x + (player.width + 20) / 2,
          player.y + headRadius * 2 + 2,
          6,
          16
        );

        // Legs
        ctx.fillStyle = "#1e3a5f";
        const legY = player.y + headRadius * 2 + bodyHeight - 2;
        // Left leg
        ctx.fillRect(
          player.x + (player.width - 16) / 2,
          legY,
          7,
          legLength
        );
        // Right leg
        ctx.fillRect(
          player.x + (player.width + 2) / 2,
          legY,
          7,
          legLength
        );

        // Shoes
        ctx.fillStyle = "#333";
        ctx.fillRect(
          player.x + (player.width - 16) / 2 - 2,
          legY + legLength - 2,
          9,
          4
        );
        ctx.fillRect(
          player.x + (player.width + 2) / 2 - 2,
          legY + legLength - 2,
          9,
          4
        );
      };

      drawPlayer();

      // Check if player reached safe zone
      let reachedSafeZone = false;
      safeZones.forEach((zone) => {
        if (checkCollision(player, zone)) {
          reachedSafeZone = true;
        }
      });

      if (reachedSafeZone) {
        if (currentLevel < maxLevel) {
          // Advance to next level
          currentLevel++;
          setScore((prev) => prev + 100);
          
          // Load next level
          const levelConfig = levels[currentLevel - 1];
          safeZones = [...levelConfig.safeZones];
          obstacles = [...levelConfig.obstacles];
          
          // Update warnings positions
          warnings = obstacles.map(obs => ({
            x: obs.x + obs.width / 2,
            y: Math.max(50, obs.y - 350),
          }));
          
          // Reset debris for new level
          initDebris(currentLevel - 1);
          
          // Reset player position
          player.x = 100;
          player.y = 500;
        } else {
          // Game complete - all levels finished
          victory = true;
          setGameState("won");
          setScore((prev) => prev + 100);
        }
      }

      ctx.restore();

      // Draw UI with health bar
      // Health bar background
      ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
      ctx.fillRect(10, 10, 280, 90);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 280, 90);

      // Level indicator
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Level ${currentLevel} / ${maxLevel}`, 20, 30);

      // Lives/Health
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px Arial";
      ctx.fillText("Health:", 20, 55);

      // Draw hearts
      for (let i = 0; i < 3; i++) {
        if (i < currentLives) {
          // Full heart
          ctx.fillStyle = "#ef4444";
          ctx.font = "24px Arial";
          ctx.fillText("❤️", 90 + i * 35, 55);
        } else {
          // Empty heart
          ctx.fillStyle = "#64748b";
          ctx.font = "24px Arial";
          ctx.fillText("🖤", 90 + i * 35, 55);
        }
      }

      // Score
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 18px Arial";
      ctx.fillText(`Score: ${score}`, 20, 85);

      // Draw level name at top center
      const levelNames = ["Classroom", "Hallway", "Cafeteria"];
      ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
      ctx.fillRect(canvas.width / 2 - 150, 10, 300, 45);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width / 2 - 150, 10, 300, 45);
      
      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`📍 ${levelNames[currentLevel - 1]}`, canvas.width / 2, 38);

      // Draw instructions at bottom
      ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
      ctx.fillRect(canvas.width / 2 - 250, canvas.height - 35, 500, 30);
      ctx.fillStyle = "#fff";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Use WASD to move • Reach green safe zones • Avoid falling debris!", canvas.width / 2, canvas.height - 15);

      // Draw minimap
      const mapSize = 150;
      const mapX = canvas.width - mapSize - 20;
      const mapY = canvas.height - mapSize - 20;
      const scale = mapSize / canvas.width;

      ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
      ctx.fillRect(mapX, mapY, mapSize, mapSize);
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.strokeRect(mapX, mapY, mapSize, mapSize);

      // Map title
      ctx.fillStyle = "#fff";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Map", mapX + mapSize / 2, mapY - 10);

      // Draw safe zones on map
      safeZones.forEach((zone) => {
        ctx.fillStyle = "#4ade80";
        ctx.fillRect(
          mapX + zone.x * scale,
          mapY + zone.y * scale,
          zone.width * scale,
          zone.height * scale
        );
      });

      // Draw player on map
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(mapX + player.x * scale, mapY + player.y * scale, 5, 5);

      // Draw debris on map
      debris.forEach((d) => {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(mapX + d.x * scale, mapY + d.y * scale, 3, 3);
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const restartGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    livesRef.current = 3;
    // Reload the component to restart the game loop
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🏃 Earthquake Escape</h1>
            <p className="text-slate-300">
              Learn earthquake safety by reaching safe zones!
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
              ← Back to Home
            </Button>
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🎯 How to Play</h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-500/20 p-4 rounded-lg">
              <p className="font-semibold mb-2">🎮 Controls</p>
              <p className="text-slate-300">Use W, A, S, D keys to move your character carefully through each area</p>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-lg">
              <p className="font-semibold mb-2">🎚️ 3 Levels</p>
              <p className="text-slate-300">Complete Classroom, Hallway, and Cafeteria to win the game</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg">
              <p className="font-semibold mb-2">✅ Safe Zones</p>
              <p className="text-slate-300">Reach green-bordered safe spots in each level to advance</p>
            </div>
            <div className="bg-red-500/20 p-4 rounded-lg">
              <p className="font-semibold mb-2">⚠️ Avoid Debris</p>
              <p className="text-slate-300">Dodge falling objects during the earthquake to survive!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-4 border-slate-700 rounded-lg shadow-2xl"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            
            {gameState === "won" && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                <div className="bg-green-600 p-8 rounded-xl text-center max-w-md">
                  <h2 className="text-4xl font-bold mb-4">🎉 All Levels Complete!</h2>
                  <p className="text-xl mb-2">You successfully survived the earthquake!</p>
                  <p className="text-lg mb-1">Final Score: {score}</p>
                  <p className="text-sm mb-6 opacity-90">You know how to find safety in 3 different locations!</p>
                  <Button onClick={restartGame} className="bg-white text-green-600 hover:bg-slate-100">
                    Play Again
                  </Button>
                </div>
              </div>
            )}

            {gameState === "lost" && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                <div className="bg-red-600 p-8 rounded-xl text-center">
                  <h2 className="text-4xl font-bold mb-4">💔 Game Over</h2>
                  <p className="text-xl mb-2">You were hit by falling debris!</p>
                  <p className="text-lg mb-6">Score: {score}</p>
                  <Button onClick={restartGame} className="bg-white text-red-600 hover:bg-slate-100">
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-amber-500/20 border border-amber-500/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span>💡</span> Real Earthquake Safety Tips
          </h3>
          <ul className="space-y-2 text-slate-200">
            <li>• <strong>Drop, Cover, and Hold On:</strong> Get under sturdy furniture and protect your head</li>
            <li>• <strong>Stay Away from Windows:</strong> Glass can shatter and cause injuries</li>
            <li>• <strong>Find Safe Spots:</strong> Door frames, under tables, or interior corners are safest</li>
            <li>• <strong>Don't Run Outside:</strong> Falling debris outside is more dangerous during the quake</li>
            <li>• <strong>Stay Put:</strong> Wait until the shaking stops before moving to a safer location</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
