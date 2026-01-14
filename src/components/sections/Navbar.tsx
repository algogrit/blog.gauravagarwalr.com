export default function Navbar() {
    function toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        html.classList.toggle('dark', !isDark);
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    return (
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <a href="/" className="items-center flex">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gaurav&apos;s <span className="text-orange-400">blog</span>
                        </span>
                    </a>

                    <div className="flex items-center gap-6">
                        <a href="/posts" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
                            Articles
                        </a>
                        <a href="https://algogrit.com" target="_blank" className="md:inline hidden text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
                            About
                        </a>
                        <a href="https://codermana.com" target="_blank" className="md:inline hidden text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
                            CoderMana
                        </a>

                        <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ml-auto" aria-label="Toggle theme">
                            <svg id="sun-icon" className="w-5 h-5 text-orange-500 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <svg id="moon-icon" className="w-5 h-5 text-orange-400 dark:hidden" fill="none" viewBox="0 0 24 24" style={{stroke: "currentColor"}} >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
