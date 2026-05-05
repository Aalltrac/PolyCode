import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getCourseById } from "@/lib/roadmap";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProtectionShield } from "@/components/ProtectionShield";
import { Watermark } from "@/components/Watermark";
import { buildDrivePreviewUrl } from "@/lib/driveUtils";
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react";

export default function ChapterViewer() {
  const { languageId, chapterId } = useParams();
  const { user, isAdmin } = useAuth();
  const course = getCourseById(languageId);

  const [published, setPublished] = useState(false);
  const [chapter, setChapter] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!course) return;
    const unsubCourse = onSnapshot(doc(db, "courses", course.id), (snap) => {
      setPublished(!!snap.data()?.published);
    });
    const unsubChap = onSnapshot(
      doc(db, "courses", course.id, "chapters", chapterId),
      (snap) => {
        setChapter(snap.exists() ? { ...snap.data(), _docId: snap.id } : null);
        setLoaded(true);
      }
    );
    return () => {
      unsubCourse();
      unsubChap();
    };
  }, [course, chapterId]);

  if (!course) return <Navigate to="/" replace />;

  const accessGranted = published || isAdmin;
  const coursePreview = chapter ? buildDrivePreviewUrl(chapter.courseUrl) : null;
  const correctionPreview = chapter ? buildDrivePreviewUrl(chapter.correctionUrl) : null;

  return (
    <div data-testid="chapter-viewer-page">
      <ProtectionShield active={accessGranted} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB] hover:text-white transition mb-4"
          data-testid="back-to-course"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {course.title}
        </Link>

        {!loaded ? (
          <p className="font-mono text-xs text-[#A8A8B8]">Chargement…</p>
        ) : !chapter ? (
          <div className="rounded-xl border border-[#6A66EB]/30 bg-[#0A0A0F] p-10 text-center">
            <p className="font-mono text-sm text-[#A8A8B8]">Chapitre introuvable.</p>
          </div>
        ) : !accessGranted ? (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/5 p-10 text-center"
            data-testid="chapter-locked-state"
          >
            <Lock className="h-10 w-10 text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-white">Accès verrouillé</h2>
            <p className="mt-3 font-mono text-sm text-[#A8A8B8]">
              Ce cours n'est pas encore publié.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6A66EB]">
                Chapitre {chapter.id}
              </p>
              <h1
                className="mt-1 font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white"
                data-testid="chapter-title"
              >
                {chapter.name}
              </h1>
            </div>

            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 mb-5 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="font-mono text-[11px] text-amber-200/90 leading-relaxed">
                Contenu protégé — capture, téléchargement et impression désactivés. Toute
                tentative de copie est tracée et associée à votre compte (
                <span className="text-amber-300">{user?.email || user?.uid}</span>).
              </p>
            </div>

            <Tabs defaultValue="cours" className="w-full">
              <TabsList className="bg-[#0A0A0F] border border-[#6A66EB]/25 p-1 grid grid-cols-2 w-full sm:w-auto sm:inline-grid">
                <TabsTrigger
                  value="cours"
                  className="data-[state=active]:bg-[#6A66EB] data-[state=active]:text-white font-mono text-xs uppercase tracking-wider px-6"
                  data-testid="tab-cours"
                >
                  Cours + Exercice
                </TabsTrigger>
                <TabsTrigger
                  value="correction"
                  className="data-[state=active]:bg-[#6A66EB] data-[state=active]:text-white font-mono text-xs uppercase tracking-wider px-6"
                  data-testid="tab-correction"
                >
                  Correction
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cours" className="mt-4">
                <PdfFrame
                  src={coursePreview}
                  watermark={user?.email || user?.uid || "USER"}
                  testId="pdf-cours"
                />
              </TabsContent>
              <TabsContent value="correction" className="mt-4">
                <PdfFrame
                  src={correctionPreview}
                  watermark={user?.email || user?.uid || "USER"}
                  testId="pdf-correction"
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

function PdfFrame({ src, watermark, testId }) {
  if (!src) {
    return (
      <div className="rounded-xl border border-[#6A66EB]/25 bg-[#0A0A0F] p-10 text-center">
        <p className="font-mono text-sm text-[#A8A8B8]">
          Document non disponible — lien Google Drive manquant.
        </p>
      </div>
    );
  }
  return (
    <div
      className="relative w-full rounded-xl border border-[#6A66EB]/25 bg-[#0A0A0F] overflow-hidden"
      style={{ height: "min(85vh, 1000px)" }}
      data-testid={testId}
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={src}
        title="Document protégé"
        className="w-full h-full"
        allow=""
        sandbox="allow-scripts allow-same-origin"
        style={{ border: 0 }}
      />
      <Watermark text={watermark} />
      {/* transparent layer to absorb mouse copy attempts on the watermark area only — iframe still scrollable */}
    </div>
  );
}
