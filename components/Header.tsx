"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#meetings", label: "Meetings" },
  { href: "/calendar", label: "Calendar" },
  { href: "/education", label: "Education" },
  { href: "#officers", label: "Officers" },
  { href: "#petition", label: "Petition" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-navy-800 border-b border-navy-700">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-gold-400 font-serif text-lg">
          Harmon Lodge No. 420
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-cream-200 hover:text-gold-300 text-sm transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-cream-200 p-2"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-navy-700 px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-cream-200 hover:text-gold-300 text-sm"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
