import Navbar from "@/components/custom/navbar/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Navbar */}
      <div className="container mx-auto px-6 py-6">
        <Navbar />
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Learn • Play • Prepare
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Train young adults
                <br />
                with gamified
                <br />
                modules.
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="text-blue-400">For government,</span>
                <br />
                <span className="text-blue-400">schools, and</span>
                <br />
                <span className="text-blue-400">colleges.</span>
              </h2>
            </div>

            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
              SafeCampus helps agencies and institutions replace monotonous
              drills with interactive virtual drills. Students complete short missions,
              earn XP and badges, and build real-world readiness.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/modules">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-6 text-base rounded-xl shadow-lg">
                  Browse modules
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-2 border-blue-400/50 font-semibold px-8 py-6 text-base rounded-xl backdrop-blur-sm">
                  Try quick mission
                </Button>
              </Link>
              <p className="text-sm text-slate-400 font-medium">
                Short sessions • Big skills
              </p>
            </div>
          </div>

          {/* Right Content - Mission Card */}
          <div className="relative lg:ml-8">
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 space-y-6 shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  Mission: Earthquake Drill
                </div>
              </div>

              {/* Tip Card */}
              <div className="bg-slate-900/60 border border-blue-500/30 rounded-xl p-5 space-y-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-2">Tip</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Drop, Cover, and Hold On. Stay away from windows.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                    +15 XP
                  </span>
                  <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500/30">
                    Badge
                  </span>
                </div>
              </div>

              {/* Action Choice */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">Choose an action</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50 text-white font-medium py-5 rounded-lg backdrop-blur-sm">
                    Hide under desk
                  </Button>
                  <Button className="bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50 text-white font-medium py-5 rounded-lg backdrop-blur-sm">
                    Run outside
                  </Button>
                  <Button className="bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50 text-white font-medium py-5 rounded-lg col-span-2 backdrop-blur-sm">
                    Use elevator
                  </Button>
                </div>
                <p className="text-xs text-slate-400 text-center font-medium">
                  Correct choice earns a combo streak!
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-medium">Squad: River High</span>
                  <span className="text-orange-400 flex items-center gap-1.5 font-semibold">
                    Streak: 7 🔥
                  </span>
                </div>
                <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-purple-600 rounded-full shadow-lg" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
