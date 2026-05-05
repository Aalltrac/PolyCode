import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { getCourseById } from "@/lib/roadmap";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, BookOpen, ChevronRight, ArrowLeft, Shield } from "lucide-react";

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10" data-testid="course-detail-page">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB] hover:text-white transition mb-6"
        data-testid="back-to-roadmap"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Roadmap
      </Link>

      <div className="rounded-xl border border-[#6A66EB]/25 bg-[#0A0A0F] p-6 sm:p-10 mb-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#6A66EB]/10 blur-3xl" />
        <div className="relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6A66EB]">
            Langage #{String(course.rank).padStart(2, "0")} · {course.category}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white">
            {course.title}
          </h1>
          <p className="mt-4 font-mono text-sm sm:text-base text-[#A8A8B8] leading-relaxed max-w-2xl">
            {course.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.25em]">
            {published ? (
              <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                Cours publié
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                Non publié
              </span>
            )}
            <span className="px-3 py-1.5 rounded-full border border-[#6A66EB]/30 text-[#A8A8B8]">
              {chapters.length} chapitre{chapters.length !== 1 ? "s" : ""}
            </span>
            {isAdmin && (
              <span className="px-3 py-1.5 rounded-full bg-[#6A66EB]/15 text-[#6A66EB] border border-[#6A66EB]/40 inline-flex items-center gap-1.5">
                <Shield className="h-3 w-3" /> Vue admin
              </span>
            )}
          </div>
        </div>
      </div>

      {!loaded ? (
        <p className="font-mono text-xs text-[#A8A8B8]">Chargement…</p>
      ) : !accessGranted ? (
        <div
          className="rounded-xl border border-red-500/30 bg-red-500/5 p-10 text-center"
          data-testid="course-locked-state"
        >
          <Lock className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white">Cours verrouillé</h2>
          <p className="mt-3 font-mono text-sm text-[#A8A8B8] max-w-md mx-auto">
            Ce cours n'est pas encore publié. Reviens bientôt — le contenu arrive.
          </p>
        </div>
      ) : (
        <div data-testid="chapters-list">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-[#6A66EB]" /> Chapitres
          </h2>

          {chapters.length === 0 ? (
            <div className="rounded-lg border border-[#6A66EB]/20 bg-[#0A0A0F] p-10 text-center">
              <p className="font-mono text-sm text-[#A8A8B8]">
                Aucun chapitre disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {chapters.map((ch) => (
                <Link
                  key={ch._docId}
                  to={`/courses/${course.id}/chapters/${ch._docId}`}
                  className="group flex items-center justify-between gap-4 rounded-lg border border-[#6A66EB]/20 bg-[#0A0A0F] p-5 transition-all hover:border-[#6A66EB] hover:bg-[#6A66EB]/5"
                  data-testid={`chapter-link-${ch._docId}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-md bg-[#6A66EB]/10 border border-[#6A66EB]/30 flex items-center justify-center font-mono text-sm font-bold text-[#6A66EB] flex-shrink-0">
                      {String(ch.id).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#6A66EB]/70">
                        Chapitre {ch.id}
                      </p>
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-white truncate">
                        {ch.name}
                      </h3>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#6A66EB] group-hover:translate-x-1 transition" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
