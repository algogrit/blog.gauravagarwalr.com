import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Gaurav<span className="text-brand">.dev</span>
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="text-slate-500 hover:text-brand">Home</Link>
          <Link href="/posts" className="font-semibold text-brand">All Posts</Link>
          <Link href="https://algogrit.com" className="text-brand">About</Link>
          <Link href="https://codermana.com" className="text-slate-500 hover:text-brand">CoderMana</Link>
        </nav>
      </div>
    </header>
  );
}
