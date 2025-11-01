import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-linear-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold shadow-md shadow-blue-500/20">SC</div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">SafeCampus</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Stay ready. Learn safely.</p>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/faq" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">FAQ</Link>
          <Link href="/modules" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Modules</Link>
          <Link href="/how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">How-it-works</Link>
          <Link href="/games" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Games</Link>
        </nav>
        <p className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} SafeCampus. All rights reserved.</p>
      </div>
    </footer>
  );
}

