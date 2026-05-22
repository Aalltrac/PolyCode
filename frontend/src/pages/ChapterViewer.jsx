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
import { ArrowLeft, Lock, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

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
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8] hover:text-[#6A66EB] transition-colors mb-6 group"
          data-testid="back-to-course"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> {course.title}
        </Link>

        {!loaded ? (
          <p className="font-mono text-xs text-[#A8A8B8]">Chargement…</p>
        ) : !chapter ? (
          <div className="rounded-lg border border-white/10 bg-[#0A0A0F] p-12 text-center">
            <p className="font-mono text-sm text-[#A8A8B8]">Chapitre introuvable.</p>
          </div>
        ) : !accessGranted ? (
          <div
            className="rounded-lg border border-white/10 bg-[#0A0A0F] p-12 text-center"
            data-testid="chapter-locked-state"
          >
            <div className="w-14 h-14 rounded-full border border-[#6A66EB]/30 bg-[#6A66EB]/10 flex items-center justify-center mx-auto mb-5">
              <Lock className="h-5 w-5 text-[#6A66EB]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Accès verrouillé</h2>
            <p className="mt-3 font-mono text-sm text-[#A8A8B8]">
              Ce cours n'est pas encore publié.
            </p>
          </div>
        ) : (
          <>
            {/* Chapter header */}
            <header className="mb-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] mb-3">
                <span className="text-[#6A66EB]">{course.title}</span>
                <span className="text-[#A8A8B8]/50">/</span>
                <span className="text-[#A8A8B8]">Chapitre {chapter.id}</span>
              </div>
              <h1
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white"
                data-testid="chapter-title"
              >
                {chapter.name}
              </h1>
            </header>

            {/* Security notice */}
            <div className="rounded-md border border-[#6A66EB]/20 bg-[#6A66EB]/5 p-3.5 mb-5 flex items-start gap-3">
              <ShieldAlert className="h-4 w-4 text-[#6A66EB] mt-0.5 flex-shrink-0" />
              <p className="font-mono text-[11px] text-[#EDEDED]/80 leading-relaxed">
                Contenu protégé — capture, téléchargement et impression désactivés.
                Identifié sous{" "}
                <span className="text-[#6A66EB]">{user?.email || user?.uid}</span>.
              </p>
            </div>

            <Tabs defaultValue="cours" className="w-full">
              <TabsList className="bg-[#0A0A0F] border border-white/8 p-1 grid grid-cols-2 w-full sm:w-auto sm:inline-grid h-auto">
                <TabsTrigger
                  value="cours"
                  className="gap-2 data-[state=active]:bg-[#6A66EB] data-[state=active]:text-white font-mono text-[11px] uppercase tracking-[0.2em] px-6 py-2.5"
                  data-testid="tab-cours"
                >
                  <FileText className="h-3.5 w-3.5" /> Cours + Exercice
                </TabsTrigger>
                <TabsTrigger
                  value="correction"
                  className="gap-2 data-[state=active]:bg-[#6A66EB] data-[state=active]:text-white font-mono text-[11px] uppercase tracking-[0.2em] px-6 py-2.5"
                  data-testid="tab-correction"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Correction
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
      <div className="rounded-lg border border-white/10 bg-[#0A0A0F] p-12 text-center">
        <p className="font-mono text-sm text-[#A8A8B8]">
          Document non disponible — lien Google Drive manquant.
        </p>
      </div>
    );
  }
  return (
    <div
      className="relative w-full rounded-lg border border-white/10 bg-[#0A0A0F] overflow-hidden"
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
    </div>
  );
}
