import Image from 'next/image';
import Link from "next/link";
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const film = 'film';
    const serietv = 'serie-tv';

    return (
        <nav className="relative flex items-center justify-between px-6 bg-color mt-3">
            {/* Logo + Links */}
            <div className="flex items-center gap-6">
                <Link href="/" className="cursor-pointer">
                    <Image
                        src="/images/logo.png"
                        alt='netflix-logo'
                        width={50}
                        height={50}
                    />
                </Link>
                <ul className="flex list-none gap-8 text-color">
                    <li>
                        <Link href="/" className="font-semibold hover-color cursor-pointer">
                            Home
                        </Link>
                    </li>
                    <li className="relative group">
                        <button
                            aria-haspopup="true"
                            aria-expanded="false"
                            className="font-semibold hover-color cursor-pointer bg-transparent border-none"
                        >
                            La mia lista
                        </button>
                        <ul className="absolute hidden group-hover:block top-full left-0 bg-color rounded shadow-md min-w-[140px] p-2 z-50">
                            <li>
                                <Link href={`/movie/${film}`} className="font-semibold hover-color cursor-pointer block px-2 py-1 rounded">
                                    Film
                                </Link>
                            </li>
                            <li>
                                <Link href={`/movie/${serietv}`} className="font-semibold hover-color cursor-pointer block px-2 py-1 rounded">
                                    Serie TV
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="relative group">
                        <button
                            aria-haspopup="true"
                            aria-expanded="false"
                            className="font-semibold hover-color cursor-pointer bg-transparent border-none"
                        >
                            Account
                        </button>
                        <ul className="absolute hidden group-hover:block top-full left-0 bg-color rounded shadow-md min-w-[140px] p-2 z-50">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-[#330000] rounded">
                                    Login
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-[#330000] rounded">
                                    Register
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            {/* Bottone luna/sole */}
            <ThemeToggle />
        </nav>
    );
}
