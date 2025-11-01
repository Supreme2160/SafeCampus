import Navbar from "@/components/custom/navbar/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] mask-[linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 tracking-wide">
                    Learn • Play • Prepare
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white">
                  Train young adults
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                    with gamified
                  </span>
                  <br />
                  modules.
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  SafeCampus helps agencies and institutions replace monotonous
                  drills with <span className="font-semibold text-slate-900 dark:text-white">interactive virtual drills</span>. 
                  Students complete missions, earn XP, and build real-world readiness.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/modules">
                  <Button size="lg" className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-blue-500/20">
                    Browse Modules
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold px-8 py-6 text-base rounded-xl">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">5-min setup</span>
                </div>
              </div>
            </div>

            {/* Right Content - Mission Card */}
            <div className="relative lg:ml-8">
              <div className="rounded-2xl p-px bg-linear-to-br from-blue-400/40 via-indigo-400/30 to-purple-400/40 dark:from-blue-400/40 dark:via-indigo-400/30 dark:to-purple-400/40 shadow-xl shadow-blue-500/10">
                <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-[15px] p-6 sm:p-8 space-y-6">
                  {/* Window Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Mission: Earthquake Drill
                    </div>
                  </div>

                  {/* Tip Card */}
                  <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-700/50 rounded-xl p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/15 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-2">Safety Tip</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          Drop, Cover, and Hold On. Stay away from windows and heavy objects.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="px-4 py-1.5 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold border border-emerald-600/30 dark:border-emerald-500/30">
                        +15 XP
                      </span>
                      <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-600/30 dark:border-indigo-500/30">
                        🏆 Badge
                      </span>
                    </div>
                  </div>

                  {/* Action Choice */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 dark:bg-amber-400/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Choose your action</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600/50 hover:bg-slate-200 dark:hover:bg-slate-600/50 text-slate-900 dark:text-white font-medium py-5 rounded-lg">
                        Hide under desk
                      </Button>
                      <Button className="bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600/50 hover:bg-slate-200 dark:hover:bg-slate-600/50 text-slate-900 dark:text-white font-medium py-5 rounded-lg">
                        Run outside
                      </Button>
                      <Button className="bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600/50 hover:bg-slate-200 dark:hover:bg-slate-600/50 text-slate-900 dark:text-white font-medium py-5 rounded-lg col-span-2">
                        Use elevator
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Squad: River High</span>
                      <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1.5 font-semibold">
                        🔥 Streak: 7
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full shadow-md" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-900 py-12 sm:py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                50K+
              </div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Active Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                500+
              </div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Schools
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                95%
              </div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Completion Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                4.8★
              </div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why choose <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">SafeCampus</span>?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Engaging, effective, and built for the modern student
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl p-px bg-linear-to-br from-blue-400/30 to-indigo-400/20">
              <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 sm:p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Gamified Learning
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  XP, badges, leaderboards, and team challenges keep students engaged and motivated to learn.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl p-px bg-linear-to-br from-indigo-400/30 to-purple-400/20">
              <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 sm:p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Real-World Scenarios
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Practice earthquake, fire, and flood response in safe, realistic virtual environments.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl p-px bg-linear-to-br from-purple-400/30 to-blue-400/20">
              <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 sm:p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Analytics Dashboard
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track progress, identify gaps, and measure readiness with detailed insights for teachers.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl p-px bg-linear-to-br from-emerald-400/30 to-blue-400/20">
              <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 sm:p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Region-Specific Content
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tailored modules for Indian schools covering local disaster preparedness protocols.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl p-px bg-linear-to-br from-amber-400/30 to-orange-400/20">
              <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 sm:p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Bite-Sized Sessions
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  5-15 minute missions fit perfectly into school schedules without disrupting classes.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl p-px bg-linear-to-br from-rose-400/30 to-pink-400/20">
              <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 sm:p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-rose-500/10 to-pink-500/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Certification Ready
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Earn recognized disaster preparedness certificates upon module completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white dark:bg-slate-900 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              How it <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">works</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Three simple steps to transform your disaster preparedness training
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                  1
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Sign Up & Setup
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Create your school account in minutes. Add classes and invite students with ease.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Choose Modules
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Select from our library of disaster preparedness modules tailored to your region.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Track & Improve
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Monitor student progress with analytics and identify areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to transform your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
              disaster preparedness training?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Join hundreds of schools already using SafeCampus to keep students safe and prepared.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/modules">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold px-10 py-6 text-lg rounded-xl">
                Explore Modules
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
