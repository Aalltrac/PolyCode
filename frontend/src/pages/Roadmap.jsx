import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { CATEGORIES, ROADMAP } from "@/lib/roadmap";
import { Lock, ArrowUpRight, Sparkles } from "lucide-react";

export default function Roadmap() {
  const [publishedMap, setPublishedMap] = useState({});
  const [activeCat, setActiveCat] = useState("fondamentaux");
  const sectionRefs = useRef({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snap) => {
      const m = {};
      snap.forEach((d) => (m[d.id] = !!d.data()?.published));
      setPublishedMap(m);
    });
    return unsub;
  }, []);

  const grouped = useMemo(() => {
    const g = {};
    CATEGORIES.forEach((c) => (g[c.id] = []));
    ROADMAP.forEach((c) => g[c.category]?.push(c));
    return g;
  }, []);

  const totalPublished = useMemo(
    () => ROADMAP.filter((c) => publishedMap[c.id]).length,
    [publishedMap]
  );

  // Observe category sections to highlight the active pill
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveCat(e.target.dataset.catId);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    CATEGORIES.forEach((c) => {
      const el = sectionRefs.current[c.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToCat = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div data-testid="roadmap-page">
      {/* Hero */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#6A66EB]/10 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(106,102,235,0.08),_transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6A66EB]/30 bg-[#6A66EB]/5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6A66EB] mb-8">
            <Sparkles className="h-3 w-3" />
            Plateforme d'apprentissage
          </div>
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.95]"
            data-testid="hero-title"
          >
            Maîtrise <span className="text-[#6A66EB]">70 langages</span>
            <br />
            de programmation.
          </h1>
          <p className="mt-7 max-w-xl mx-auto font-mono text-sm sm:text-base text-[#A8A8B8] leading-relaxed">
            Une roadmap structurée des fondamentaux à l'ésotérique. Chapitres PDF
            sécurisés, exercices et corrections. Progresse à ton rythme.
          </p>

          <div className="mt-10 flex flex-wrap gap-6 justify-center font-mono text-[11px] uppercase tracking-[0.25em] text-[#A8A8B8]">
            <Metric value={ROADMAP.length} label="Langages" />
            <div className="w-px h-8 bg-white/10" />
            <Metric value={totalPublished} label="Publiés" accent />
            <div className="w-px h-8 bg-white/10" />
            <Metric value={CATEGORIES.length} label="Catégories" />
          </div>
        </div>
      </section>

      {/* Sticky Category Nav */}
      <nav
        className="sticky top-[61px] md:top-[69px] z-40 bg-[#050508]/85 backdrop-blur-xl border-b border-white/5"
        data-testid="category-nav"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = grouped[cat.id]?.length || 0;
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => scrollToCat(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  isActive
                    ? "border-[#6A66EB] bg-[#6A66EB]/15 text-white"
                    : "border-white/10 bg-transparent text-[#A8A8B8] hover:border-[#6A66EB]/40 hover:text-white"
                }`}
                data-testid={`cat-pill-${cat.id}`}
              >
                {cat.label}
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? "text-[#6A66EB]" : "text-[#6A66EB]/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Categories + cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        {CATEGORIES.map((cat, ci) => (
          <section
            key={cat.id}
            ref={(el) => (sectionRefs.current[cat.id] = el)}
            data-cat-id={cat.id}
            data-testid={`category-${cat.id}`}
            className="scroll-mt-32"
          >
            <header className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6A66EB]">
                {String(ci + 1).padStart(2, "0")} · Catégorie
              </p>
              <div className="mt-2 flex items-end justify-between flex-wrap gap-3">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  {cat.label}
                </h2>
                <span className="font-mono text-xs text-[#A8A8B8]">
                  {grouped[cat.id].length} langages
                </span>
              </div>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-[#6A66EB]/40 via-[#6A66EB]/10 to-transparent" />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[cat.id].map((course) => {
                const isPublished = !!publishedMap[course.id];
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isPublished={isPublished}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Metric({ value, label, accent }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`font-display text-2xl font-black tracking-tight ${
          accent ? "text-[#6A66EB]" : "text-white"
        }`}
      >
        {value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A8A8B8]">
        {label}
      </span>
    </div>
  );
}

function CourseCard({ course, isPublished }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group relative rounded-lg border border-white/8 bg-[#0A0A0F] p-6 transition-all duration-300 hover:border-[#6A66EB]/60 hover:bg-[#0E0E18] hover:-translate-y-0.5 overflow-hidden"
      data-testid={`course-card-${course.id}`}
    >
      {/* corner accent */}
      <div
        className={`absolute top-0 left-0 h-[2px] transition-all duration-500 ${
          isPublished ? "bg-[#6A66EB] w-full" : "bg-[#6A66EB]/20 w-8 group-hover:w-full"
        }`}
      />

      <div className="flex items-start justify-between gap-3 mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB]">
          #{String(course.rank).padStart(2, "0")}
        </span>
        {isPublished ? (
          <span
            className="font-mono text-[9px] uppercase tracking-wider text-green-400"
            data-testid={`badge-published-${course.id}`}
          >
            ● Publié
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#6A66EB]/50"
            data-testid={`badge-locked-${course.id}`}
          >
            <Lock className="h-2.5 w-2.5" /> Verrouillé
          </span>
        )}
      </div>

      <h3 className="font-display text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-[#6A66EB] transition-colors duration-300">
        {course.title}
      </h3>
      <p className="font-mono text-xs text-[#A8A8B8] leading-relaxed line-clamp-3 min-h-[48px]">
        {course.description}
      </p>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A8A8B8]">
          Accéder au cours
        </span>
        <ArrowUpRight className="h-4 w-4 text-[#6A66EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
      </div>
    </Link>
  );
}
