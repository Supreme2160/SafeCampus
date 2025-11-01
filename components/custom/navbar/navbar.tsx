import Link from "next/link";

// navbar component
export default function Navbar() {
    return (
        <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
                    SC
                </div>
                <h1 className="text-xl font-bold">SafeCampus</h1>
            </Link>
            <ul className="flex items-center space-x-8 text-sm">
                <li><Link href="/modules" className="hover:text-blue-400 transition-colors">Modules</Link></li>
                <li><Link href="/highlights" className="hover:text-blue-400 transition-colors">Highlights</Link></li>
                <li><Link href="/government" className="hover:text-blue-400 transition-colors">Government</Link></li>
                <li><Link href="/schools" className="hover:text-blue-400 transition-colors">Schools</Link></li>
                <li><Link href="/how-it-works" className="hover:text-blue-400 transition-colors">How it works</Link></li>
                <li><Link href="/demo" className="hover:text-blue-400 transition-colors">Play demo</Link></li>
                <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
            </ul>
        </nav>
    )
}