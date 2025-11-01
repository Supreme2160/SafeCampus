import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/custom/navbar/navbar";

export default function GamesPage() {
  const games = [
    {
      title: "Earthquake Escape",
      description: "Learn earthquake safety by navigating to safe zones while avoiding falling debris during an earthquake.",
      icon: "🏃",
      href: "/games/earthquake",
      difficulty: "Medium",
      skills: ["Quick Thinking", "Spatial Awareness", "Safety Protocols"],
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Backpack Hero",
      description: "Test your disaster preparedness! Drag and drop the right emergency items into your backpack based on different disaster scenarios.",
      icon: "🎒",
      href: "/games/backpack-hero",
      difficulty: "Easy",
      skills: ["Emergency Prep", "Critical Thinking", "Resource Management"],
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "CPR Rhythm Master",
      description: "Master life-saving CPR technique through rhythm! Match the beat markers to learn proper compression timing at 110 BPM.",
      icon: "❤️",
      href: "/games/cpr-rhythm",
      difficulty: "Medium",
      skills: ["Rhythm & Timing", "CPR Training", "Hand-Eye Coordination"],
      color: "from-red-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-6">
        <Navbar />
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">🎮 Safety Training Games</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Interactive games designed to teach emergency preparedness and safety skills through engaging gameplay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.href}
              className="bg-slate-800/50 backdrop-blur rounded-xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-all hover:transform hover:scale-105"
            >
              <div className={`bg-linear-to-br ${game.color} p-8 text-center`}>
                <div className="text-6xl mb-2">{game.icon}</div>
                <h2 className="text-2xl font-bold">{game.title}</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-slate-300">{game.description}</p>
                
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-2">Skills Learned:</p>
                  <div className="flex flex-wrap gap-2">
                    {game.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-semibold text-slate-400">
                    Difficulty: <span className="text-amber-400">{game.difficulty}</span>
                  </span>
                  <Link href={game.href}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Play Now →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">🎯 Learning Through Play</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Interactive Learning</h4>
              <p className="text-slate-300 text-sm">
                Engage with realistic scenarios that teach real-world safety skills
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Instant Feedback</h4>
              <p className="text-slate-300 text-sm">
                Learn from mistakes in a safe environment with immediate guidance
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Skill Building</h4>
              <p className="text-slate-300 text-sm">
                Develop critical thinking and emergency response capabilities
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
