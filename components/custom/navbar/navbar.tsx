"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modeToggle";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

// Desktop-first navbar (mobile menu added in next step)
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { status } = useSession();

    const links = [
        { href: "/modules", label: "Modules" },
        { href: "/games", label: "Games" },
        { href: "/virtual-training", label: "Virtual Training" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/how-it-works", label: "How it works" },
        { href: "/faq", label: "FAQ" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 text-slate-900 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:supports-backdrop-filter:bg-slate-900/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="h-16 flex items-center justify-between" aria-label="Global">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-500/90 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                            SC
                        </div>
                        <span className="text-base sm:text-lg font-semibold tracking-tight">SafeCampus</span>
                    </Link>

                    {/* Desktop nav */}
                    <ul className="hidden md:flex items-center gap-8 text-sm text-slate-700 dark:text-slate-200">
                        {links.map((l) => (
                            <li key={l.href}><Link href={l.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{l.label}</Link></li>
                        ))}
                        <li className="pl-2">
                            {status === "unauthenticated" ? (
                                <Button asChild>
                                    <Link href="/signin" className="px-4 py-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                        Sign In
                                    </Link>
                                </Button>
                            ) :
                                (
                                    <Button onClick={() => signOut()} asChild variant="destructive">
                                        Signout
                                    </Button>
                                )
                            }

                        </li>
                        <li className="z-40"><ModeToggle /></li>
                    </ul>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200 dark:hover:bg-white/10"
                        aria-controls="mobile-menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </nav>

                <div id="mobile-menu" className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="py-3 border-t border-white/10">
                        <ul className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
                            {links.map((l) => (
                                <li key={l.href}>
                                    <Link onClick={() => setOpen(false)} href={l.href} className="block rounded-md px-2 py-2 hover:bg-black/5 dark:hover:bg-white/10">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link onClick={() => setOpen(false)} href="/signin" className="block rounded-md px-2 py-2 text-blue-600 dark:text-blue-400 font-semibold hover:bg-black/5 dark:hover:bg-white/10">
                                    Sign In
                                </Link>
                            </li>
                            <li className="pt-2 z-40"><ModeToggle /></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}