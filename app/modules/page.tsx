import fetchModules from "@/actions/fetchmodules";
import Navbar from "@/components/custom/navbar/navbar";
import Image from "next/image";
import Link from "next/link";

export default async function Modules() {
    const modules = await fetchModules();
    return (
        <div className="flex flex-col min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900">
            <Navbar />

            {/* Hero Section */}
            <section className="py-16 text-center px-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                    Interactive Learning Modules
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                    Master disaster preparedness with region-specific modules designed for Indian educational institutions.
                </p>
                <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center">📘</span>
                        6 Comprehensive Modules
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center">⏱️</span>
                        4+ Hours of Content
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center">🎓</span>
                        Certification Available
                    </span>
                </div>
            </section>

            {/* Progress Section */}
            <section className="w-full px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl p-px bg-linear-to-br from-blue-500/40 via-indigo-500/30 to-purple-500/40 dark:from-blue-400/40 dark:via-indigo-400/30 dark:to-purple-400/40">
                    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-[15px] p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Your Progress</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                    Complete all modules to earn your{" "}
                                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                        Disaster Preparedness Certificate
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white">33%</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">1 of 3 completed</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: '33%' }}
                            ></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">In Progress</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">45</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">XP Earned</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modules Grid */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module: any) => (
                        <div
                            key={module.id}
                            className="group rounded-2xl p-px bg-linear-to-br from-blue-400/20 via-indigo-400/15 to-purple-400/20 dark:from-blue-400/25 dark:via-indigo-400/20 dark:to-purple-400/25 hover:from-blue-500/35 hover:via-indigo-500/30 hover:to-purple-500/35 dark:hover:from-blue-500/35 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/35 transition-all duration-300 cursor-pointer shadow-sm shadow-blue-500/10"
                        >
                            <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-[15px] p-6 h-full flex flex-col ring-1 ring-white/10 dark:ring-white/10 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-400/10 dark:to-indigo-400/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        {module.coverImage ? (
                                            <Image src={module.coverImage} alt={module.title} className="w-10 h-10 object-cover rounded-xl" />
                                        ) : (
                                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                                    {module.description}
                                </p>

                                <Link
                                    href={`/modules/${module.id}`}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-linear-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25 mb-4"
                                >
                                    Start Module
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {module.duration} min
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${module.level === 'Beginner'
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            }`}
                                    >
                                        {module.level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
