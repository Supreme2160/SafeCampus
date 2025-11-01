"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Laptop } from "lucide-react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!ref.current) return
            if (!ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("click", onClick)
        return () => document.removeEventListener("click", onClick)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="outline"
                size="icon"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Menu */}
            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 min-w-36 rounded-md border bg-white text-slate-900 shadow-md ring-1 ring-black/5 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                >
                    <button
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                            theme === "light" ? "text-blue-600 dark:text-blue-400" : ""
                        }`}
                        onClick={() => { setTheme("light"); setOpen(false); }}
                        role="menuitem"
                    >
                        <Sun className="size-4" /> Light
                    </button>
                    <button
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                            theme === "dark" ? "text-blue-600 dark:text-blue-400" : ""
                        }`}
                        onClick={() => { setTheme("dark"); setOpen(false); }}
                        role="menuitem"
                    >
                        <Moon className="size-4" /> Dark
                    </button>
                    <button
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                            theme === "system" ? "text-blue-600 dark:text-blue-400" : ""
                        }`}
                        onClick={() => { setTheme("system"); setOpen(false); }}
                        role="menuitem"
                    >
                        <Laptop className="size-4" /> System
                    </button>
                </div>
            )}
        </div>
    )
}
