interface SectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ id, title, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`py-16 px-4 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl text-gold-400 mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}
