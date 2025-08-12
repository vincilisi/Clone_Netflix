import Image from 'next/image';
import Link from "next/link";

export default function Navbar() {
    const film = 'film';
    const serietv = 'serie-tv'
    return (
        <nav className="flex items-center justify-start px-6 bg-color mt-3">
            <div className="logo ">
                <Link href="/" className="cursor-pointer">
                    <Image
                        src="/images/logo.png"
                        alt='netflix-logo'
                        width={50}
                        height={50}
                    />
                </Link>
            </div>
            <ul className="flex list-none gap-8 ml-6 text-mywhite">
                <li>
                    <Link href="/" className="font-semibold custom-link cursor-pointer">
                        Home
                    </Link>
                </li>
                <li className="relative group">
                    <a href="#" className="font-semibold cursor-pointer hover:text-myred">
                        La mia lista
                    </a>
                    <ul className="absolute hidden group-hover:block top-full left-0 bg-color rounded shadow-md min-w-[140px] p-2 z-50">
                        <li>
                            <Link href={`/movie/${film}`} className="font-semibold custom-link cursor-pointer">
                                Film
                            </Link>
                        </li>
                        <li>
                            <Link href={`/movie/${serietv}`} className="font-semibold custom-link cursor-pointer">
                                Serie TV
                            </Link>
                        </li>

                    </ul>
                </li>
                <li className="relative group">
                    <a href="#" className="font-semibold cursor-pointer hover:text-myred">
                        Account
                    </a>
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
        </nav>
    );
}
