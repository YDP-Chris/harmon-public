import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-800 border-t border-navy-700 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-cream-100 font-serif text-sm">
              Harmon Lodge No. 420, A.F. &amp; A.M.
            </p>
            <p className="text-cream-300 text-xs mt-1">
              Yadkinville, North Carolina
            </p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-xs">
            <Link href="/calendar" className="text-cream-300 hover:text-gold-300 transition-colors">
              Calendar
            </Link>
            <Link href="/education" className="text-cream-300 hover:text-gold-300 transition-colors">
              Education
            </Link>
            <a href="/#petition" className="text-cream-300 hover:text-gold-300 transition-colors">
              Petition
            </a>
            <a href="/#contact" className="text-cream-300 hover:text-gold-300 transition-colors">
              Contact
            </a>
            <a href="mailto:lodge@harmon420.org" className="text-cream-300 hover:text-gold-300 transition-colors">
              lodge@harmon420.org
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
