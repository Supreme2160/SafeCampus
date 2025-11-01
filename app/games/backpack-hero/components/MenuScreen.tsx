import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DisasterScenario {
  name: string;
  emoji: string;
  id?: string;
  description?: string;
}

interface MenuScreenProps {
  scenarios: DisasterScenario[];
  onStart: () => void;
}

export function MenuScreen({ scenarios, onStart }: MenuScreenProps) {
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
              onClick={onStart}
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
