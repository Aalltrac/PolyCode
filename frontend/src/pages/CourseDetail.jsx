import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { getCourseById, CATEGORIES } from "@/lib/roadmap";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, ChevronRight, ArrowLeft, Shield, BookOpen } from "lucide-react";

export default function CourseDetail() {
  const { languageId } = useParams();
  const { isAdmin } = useAuth();
  const course = getCourseById(languageId);
  const [published, setPublished] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!course) return;
    const unsubCourse = onSnapshot(doc(db, "courses", course.id), (snap) => {
      setPublished(!!snap.data()?.published);
      setLoaded(true);
    });
    const q = query(collection(db, "courses", course.id, "chapters"), orderBy("id", "asc"));
    const unsubChapters = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ ...d.data(), _docId: d.id }));
      setChapters(arr);
    });
    return () => {
      unsubCourse();
      unsubChapters();
    };
  }, [course]);

  if (!course) return <Navigate to="/" replace />;

  const accessGranted = published || isAdmin;
  const catLabel = CATEGORIES.find((c) => c.id === course.category)?.label;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10" data-testid="course-detail-page">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8] hover:text-[#6A66EB] transition-colors mb-8 group"
        data-testid="back-to-roadmap"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Roadmap
      </Link>

      {/* Course header */}
      <header className="mb-14">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
          <span className="text-[#6A66EB]">#{String(course.rank).padStart(2, "0")}</span>
          <span className="text-[#A8A8B8]/50">/</span>
          <span className="text-[#A8A8B8]">{catLabel}</span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9]">
          {course.title}
        </h1>
        <p className="mt-5 max-w-2xl font-mono text-sm sm:text-base text-[#A8A8B8] leading-relaxed">
          {course.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6 pb-6 border-b border-white/5">
          <Stat label="Statut">
            {published ? (
              <span className="text-green-400">● Publié</span>
            ) : (
              <span className="text-[#A8A8B8]">○ Non publié</span>
            )}
          </Stat>
          <div className="w-px h-8 bg-white/10" />
          <Stat label="Chapitres">
            <span className="text-white">{chapters.length}</span>
          </Stat>
          {isAdmin && (
            <>
              <div className="w-px h-8 bg-white/10" />
              <Stat label="Vue">
                <span className="text-[#6A66EB] inline-flex items-center gap-1.5">
                  <Shield className="h-3 w-3" /> Admin
                </span>
              </Stat>
            </>
          )}
        </div>
      </header>

      {/* Body */}
      {!loaded ? (
        <p className="font-mono text-xs text-[#A8A8B8]">Chargement…</p>
      ) : !accessGranted ? (
        <div
          className="rounded-lg border border-white/10 bg-[#0A0A0F] p-12 text-center"
          data-testid="course-locked-state"
        >
          <div className="w-14 h-14 rounded-full border border-[#6A66EB]/30 bg-[#6A66EB]/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="h-5 w-5 text-[#6A66EB]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Cours verrouillé</h2>
          <p className="mt-3 max-w-md mx-auto font-mono text-sm text-[#A8A8B8]">
            Ce cours n'est pas encore publié. Reviens bientôt — le contenu arrive.
          </p>
        </div>
      ) : (
        <div data-testid="chapters-list">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-5 w-5 text-[#6A66EB]" />
            <h2 className="font-display text-2xl font-bold text-white">Programme</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {chapters.length === 0 ? (
            <div className="rounded-lg border border-white/5 bg-[#0A0A0F] p-10 text-center">
              <p className="font-mono text-sm text-[#A8A8B8]">
                Aucun chapitre disponible pour le moment.
              </p>
            </div>
          ) : (
            <ol className="space-y-2">
              {chapters.map((ch) => (
                <li key={ch._docId}>
                  <Link
                    to={`/courses/${course.id}/chapters/${ch._docId}`}
                    className="group flex items-center gap-5 rounded-lg border border-white/8 bg-[#0A0A0F] p-5 transition-all duration-300 hover:border-[#6A66EB]/60 hover:bg-[#0E0E18]"
                    data-testid={`chapter-link-${ch._docId}`}
                  >
                    <div className="w-11 h-11 rounded-md bg-[#6A66EB]/5 border border-[#6A66EB]/20 flex items-center justify-center font-mono text-sm font-bold text-[#6A66EB] flex-shrink-0 group-hover:bg-[#6A66EB]/15 group-hover:border-[#6A66EB]/50 transition-colors">
                      {String(ch.id).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#6A66EB]/70 mb-0.5">
                        Chapitre {ch.id}
                      </p>
                      <h3 className="font-display text-lg font-semibold text-white truncate">
                        {ch.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#A8A8B8] group-hover:text-[#6A66EB] transition-colors">
                      <span className="hidden sm:inline">Lire</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, children }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A8A8B8]/70 mb-1">
        {label}
      </p>
      <p className="font-mono text-xs">{children}</p>
    </div>
  );
}
