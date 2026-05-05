import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { CATEGORIES, ROADMAP } from "@/lib/roadmap";
import { Lock, Unlock, ArrowUpRight } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/ac818131-9ea0-41f3-a2cd-265fcebd45c9/images/d3775e7854456267c2921c22ee6bcac9a88166d9a28aab47e736c530d9d7d61e.png";

// Asymmetric col-span pattern (md+ in 12-col grid). Cycles to give a "Tetris" feel.
const SPAN_PATTERN = [4, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4];

export default function Roadmap() {
  const [publishedMap, setPublishedMap] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snap) => {
      const m = {};
      snap.forEach((doc) => {
        const d = doc.data();
        m[doc.id] = !!d?.published;
      });
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

  return (
    <div data-testid="roadmap-page">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#6A66EB]/20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-[#050508]/85 to-[#050508]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6A66EB] mb-5"
            data-testid="hero-eyebrow"
          >
            // PolyCode_School / roadmap.json
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-white max-w-4xl leading-[0.95]">
            Apprends <span className="text-[#6A66EB]">70 langages</span>
            <br />
            de programmation.
          </h1>
          <p className="mt-6 max-w-2xl font-mono text-sm sm:text-base text-[#A8A8B8] leading-relaxed">
            Une roadmap structurée des fondamentaux au plus ésotérique. Chapitres en PDF
            sécurisé, exercices et corrections inclus. Progresse à ton rythme.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="px-3 py-1.5 rounded-full border border-[#6A66EB]/30 text-[#A8A8B8]">
              {ROADMAP.length} langages
            </span>
            <span className="px-3 py-1.5 rounded-full border border-green-500/30 text-green-400">
              {totalPublished} publiés
            </span>
            <span className="px-3 py-1.5 rounded-full border border-[#6A66EB]/30 text-[#A8A8B8]">
              6 catégories
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        {CATEGORIES.map((cat, ci) => (
          <section key={cat.id} data-testid={`category-${cat.id}`}>
            <header className="flex items-end justify-between flex-wrap gap-4 mb-6 pb-3 border-b border-[#6A66EB]/15">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6A66EB]/70">
                  Catégorie {String(ci + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mt-1">
                  {cat.label}
                </h2>
              </div>
              <span className="font-mono text-xs text-[#6A66EB]">
                {grouped[cat.id].length} langages
              </span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
              {grouped[cat.id].map((course, idx) => {
                const span = SPAN_PATTERN[idx % SPAN_PATTERN.length];
                const isPublished = !!publishedMap[course.id];
                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className={`group relative md:col-span-${span} rounded-lg border border-[#6A66EB]/25 bg-[#0A0A0F] p-5 sm:p-6 transition-all duration-200 hover:border-[#6A66EB] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(106,102,235,0.25)] overflow-hidden`}
                    style={{ gridColumn: `span ${span} / span ${span}` }}
                    data-testid={`course-card-${course.id}`}
                  >
                    {/* Glow corner */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#6A66EB]/10 blur-3xl group-hover:bg-[#6A66EB]/30 transition-all" />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB]">
                            #{String(course.rank).padStart(2, "0")}
                          </span>
                          {isPublished ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-mono text-[9px] uppercase tracking-wider"
                              data-testid={`badge-published-${course.id}`}
                            >
                              <Unlock className="h-2.5 w-2.5" /> Publié
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-[9px] uppercase tracking-wider"
                              data-testid={`badge-locked-${course.id}`}
                            >
                              <Lock className="h-2.5 w-2.5" /> Verrouillé
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {course.title}
                        </h3>
                        <p className="mt-2 font-mono text-xs sm:text-sm text-[#A8A8B8] leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-[#6A66EB] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
