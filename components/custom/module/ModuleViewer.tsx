"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar/navbar";
import Link from "next/link";

interface Lesson {
    id: string;
    title: string;
    content: string;
    videoUrl: string | null;
    createdAt: Date;
}

export interface ModuleData {
    id: string;
    title: string;
    description: string;
    coverImage: string | null;
    duration: number;
    level: string;
    lessons: Lesson[];
}

export default function ModulePage({ moduleX }: { moduleX: ModuleData }) {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

    const currentLesson = moduleX.lessons[currentLessonIndex];
    const progress = (completedLessons.size / moduleX.lessons.length) * 100;

    const handleNextLesson = () => {
        setCompletedLessons((prev) => new Set(prev).add(currentLessonIndex));
        if (currentLessonIndex < moduleX.lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        }
    };

    const handlePreviousLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        }
    };

    const getYouTubeEmbedUrl = (url: string) => {
        // Extract video ID from various YouTube URL formats
        let videoId = "";
        
        if (url.includes("watch?v=")) {
            // Format: https://www.youtube.com/watch?v=VIDEO_ID
            videoId = url.split("watch?v=")[1].split("&")[0];
        } else if (url.includes("youtu.be/")) {
            // Format: https://youtu.be/VIDEO_ID
            videoId = url.split("youtu.be/")[1].split("?")[0];
        } else if (url.includes("embed/")) {
            // Format: https://www.youtube.com/embed/VIDEO_ID
            videoId = url.split("embed/")[1].split("?")[0];
        }
        
        return `https://www.youtube.com/embed/${videoId}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900">
            <Navbar />

            {/* Header */}
            <section className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/modules"
                        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Modules
                    </Link>

                    <div className="rounded-2xl p-px bg-linear-to-br from-blue-500/40 via-indigo-500/30 to-purple-500/40">
                        <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-[15px] p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                        {moduleX.title}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {moduleX.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {moduleX.duration} min
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            moduleX.level === "Beginner"
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        }`}
                                    >
                                        {moduleX.level}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        Progress: {completedLessons.size} of {moduleX.lessons.length} lessons
                                    </span>
                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lessons Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl p-px bg-linear-to-br from-blue-400/20 via-indigo-400/15 to-purple-400/20">
                                <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-[15px] p-6">
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                                        Lessons
                                    </h2>
                                    <div className="space-y-2">
                                        {moduleX.lessons.map((lesson, index) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setCurrentLessonIndex(index)}
                                                className={`w-full text-left p-3 rounded-lg transition-all ${
                                                    currentLessonIndex === index
                                                        ? "bg-indigo-500/10 border-2 border-indigo-500/50 text-indigo-600 dark:text-indigo-400"
                                                        : "bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                                            completedLessons.has(index)
                                                                ? "bg-emerald-500 text-white"
                                                                : currentLessonIndex === index
                                                                ? "bg-indigo-500 text-white"
                                                                : "bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                                                        }`}
                                                    >
                                                        {completedLessons.has(index) ? (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {lesson.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lesson Content */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl p-px bg-linear-to-br from-blue-400/20 via-indigo-400/15 to-purple-400/20">
                                <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-[15px] p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                        {currentLesson.title}
                                    </h2>

                                    {/* Video */}
                                    {currentLesson.videoUrl && (
                                        <div className="mb-6 rounded-xl overflow-hidden aspect-video bg-slate-900">
                                            <iframe
                                                src={getYouTubeEmbedUrl(currentLesson.videoUrl)}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {currentLesson.content}
                                        </p>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={handlePreviousLesson}
                                            disabled={currentLessonIndex === 0}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                                currentLessonIndex === 0
                                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                                            }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Previous
                                        </button>

                                        {currentLessonIndex < moduleX.lessons.length - 1 ? (
                                            <button
                                                onClick={handleNextLesson}
                                                className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-linear-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25"
                                            >
                                                Complete & Continue
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleNextLesson}
                                                className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-linear-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg shadow-emerald-500/25"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Complete Module
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
