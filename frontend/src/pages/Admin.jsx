import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { CATEGORIES, ROADMAP } from "@/lib/roadmap";
import { extractDriveFileId } from "@/lib/driveUtils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Search } from "lucide-react";

export default function Admin() {
  const [publishedMap, setPublishedMap] = useState({});
  const [chaptersByCourse, setChaptersByCourse] = useState({});
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Dialog state
  const [chapterDialog, setChapterDialog] = useState({
    open: false,
    courseId: null,
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courses"), (snap) => {
      const m = {};
      snap.forEach((d) => (m[d.id] = !!d.data()?.published));
      setPublishedMap(m);
    });
    return unsub;
  }, []);

  // Subscribe to chapters of every course (one listener at mount)
  useEffect(() => {
    const unsubs = ROADMAP.map((c) =>
      onSnapshot(collection(db, "courses", c.id, "chapters"), (snap) => {
        const arr = [];
        snap.forEach((d) => arr.push({ ...d.data(), _docId: d.id }));
        arr.sort((a, b) => Number(a.id) - Number(b.id));
        setChaptersByCourse((prev) => ({ ...prev, [c.id]: arr }));
      })
    );
    return () => unsubs.forEach((u) => u());
  }, []);

  const togglePublish = async (courseId, current) => {
    try {
      await setDoc(
        doc(db, "courses", courseId),
        { published: !current, updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast.success(!current ? "Cours publié" : "Cours dépublié");
    } catch (e) {
      toast.error("Erreur Firestore (vérifie les règles d'accès)");
    }
  };

  const deleteChapter = async (courseId, chapterDocId) => {
    if (!window.confirm("Supprimer ce chapitre ?")) return;
    try {
      await deleteDoc(doc(db, "courses", courseId, "chapters", chapterDocId));
      toast.success("Chapitre supprimé");
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filtered = useMemo(() => {
    return ROADMAP.filter((c) => {
      const matchText =
        c.title.toLowerCase().includes(filter.toLowerCase()) ||
        c.id.toLowerCase().includes(filter.toLowerCase());
      const matchCat = categoryFilter === "all" || c.category === categoryFilter;
      return matchText && matchCat;
    });
  }, [filter, categoryFilter]);

  const totals = useMemo(() => {
    const published = Object.values(publishedMap).filter(Boolean).length;
    const chapters = Object.values(chaptersByCourse).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    );
    return { published, chapters };
  }, [publishedMap, chaptersByCourse]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" data-testid="admin-page">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6A66EB]">
          // admin / control_room
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black tracking-tighter text-white">
          Tableau de bord
        </h1>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Langages" value={ROADMAP.length} />
        <Stat label="Publiés" value={totals.published} accent />
        <Stat label="Chapitres" value={totals.chapters} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6A66EB]" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Rechercher un langage…"
            className="pl-10 bg-[#0A0A0F] border-[#6A66EB]/25 text-white font-mono focus-visible:ring-[#6A66EB]"
            data-testid="admin-search-input"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger
            className="sm:w-64 bg-[#0A0A0F] border-[#6A66EB]/25 text-white font-mono"
            data-testid="admin-category-filter"
          >
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0F] border-[#6A66EB]/25 text-white">
            <SelectItem value="all">Toutes catégories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#6A66EB]/25 bg-[#0A0A0F] overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_140px_110px_110px_120px] sm:grid-cols-[60px_1fr_180px_120px_120px_140px] gap-3 px-4 py-3 border-b border-[#6A66EB]/15 font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB]/80">
          <span>#</span>
          <span>Langage</span>
          <span className="hidden sm:block">Catégorie</span>
          <span>Chapitres</span>
          <span>Publié</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-[#6A66EB]/10 max-h-[60vh] overflow-y-auto">
          {filtered.map((c) => {
            const ch = chaptersByCourse[c.id] || [];
            const isPub = !!publishedMap[c.id];
            const cat = CATEGORIES.find((cc) => cc.id === c.category)?.label;
            return (
              <div
                key={c.id}
                className="grid grid-cols-[60px_1fr_140px_110px_110px_120px] sm:grid-cols-[60px_1fr_180px_120px_120px_140px] gap-3 items-center px-4 py-3 hover:bg-[#6A66EB]/5"
                data-testid={`admin-row-${c.id}`}
              >
                <span className="font-mono text-xs text-[#6A66EB]">
                  #{String(c.rank).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-semibold text-white truncate">
                  {c.title}
                </span>
                <span className="hidden sm:block font-mono text-xs text-[#A8A8B8] truncate">
                  {cat}
                </span>
                <span className="font-mono text-xs text-[#EDEDED]">
                  {ch.length}{" "}
                  <span className="text-[#A8A8B8] hidden sm:inline">chapitre{ch.length !== 1 ? "s" : ""}</span>
                </span>
                <Switch
                  checked={isPub}
                  onCheckedChange={() => togglePublish(c.id, isPub)}
                  data-testid={`switch-publish-${c.id}`}
                />
                <Button
                  size="sm"
                  onClick={() => setChapterDialog({ open: true, courseId: c.id })}
                  className="bg-[#6A66EB] hover:bg-[#5853D6] text-white font-mono text-[10px] uppercase tracking-wider"
                  data-testid={`btn-add-chapter-${c.id}`}
                >
                  <Plus className="h-3 w-3 mr-1" /> Chapitre
                </Button>

                {/* Existing chapters list */}
                {ch.length > 0 && (
                  <div className="col-span-full pl-16 pr-2 -mt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {ch.map((chap) => (
                        <span
                          key={chap._docId}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-[#6A66EB]/20 bg-[#050508] font-mono text-[10px] text-[#EDEDED]"
                        >
                          <span className="text-[#6A66EB]">#{chap.id}</span> {chap.name}
                          <button
                            onClick={() => deleteChapter(c.id, chap._docId)}
                            className="text-red-400 hover:text-red-300"
                            data-testid={`btn-delete-chapter-${c.id}-${chap._docId}`}
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ChapterDialog
        state={chapterDialog}
        existingChapters={chaptersByCourse[chapterDialog.courseId] || []}
        onClose={() => setChapterDialog({ open: false, courseId: null })}
      />
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent ? "border-[#6A66EB]/50 bg-[#6A66EB]/5" : "border-[#6A66EB]/20 bg-[#0A0A0F]"
      }`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A8A8B8]">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function ChapterDialog({ state, existingChapters, onClose }) {
  const [name, setName] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [correctionUrl, setCorrectionUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (state.open) {
      setName("");
      setCourseUrl("");
      setCorrectionUrl("");
    }
  }, [state.open]);

  const nextId = useMemo(() => {
    if (!existingChapters.length) return 1;
    const max = existingChapters.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
    return max + 1;
  }, [existingChapters]);

  const submit = async (e) => {
    e.preventDefault();
    if (!state.courseId) return;
    if (!name.trim()) {
      toast.error("Le nom du chapitre est requis.");
      return;
    }
    const cId = extractDriveFileId(courseUrl);
    const corrId = extractDriveFileId(correctionUrl);
    if (!cId) {
      toast.error("Lien Drive du cours invalide.");
      return;
    }
    if (!corrId) {
      toast.error("Lien Drive de correction invalide.");
      return;
    }

    setBusy(true);
    try {
      // Use document ID = chapter id (numeric) for stable, predictable references.
      await addDoc(collection(db, "courses", state.courseId, "chapters"), {
        id: nextId,
        name: name.trim(),
        courseUrl: courseUrl.trim(),
        correctionUrl: correctionUrl.trim(),
        courseFileId: cId,
        correctionFileId: corrId,
        createdAt: serverTimestamp(),
      });
      toast.success(`Chapitre ${nextId} ajouté`);
      onClose();
    } catch (err) {
      toast.error("Erreur Firestore lors de la création.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={state.open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-[#0A0A0F] border-[#6A66EB]/30 text-white sm:max-w-lg"
        data-testid="chapter-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold">
            Nouveau chapitre — #{nextId}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-[#A8A8B8]">
            Lie deux PDF Google Drive (cours + correction). L'ID du chapitre est attribué
            automatiquement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]">
              Nom du chapitre
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Les variables et types"
              className="mt-1 bg-[#050508] border-[#6A66EB]/30 text-white font-mono"
              required
              data-testid="chapter-name-input"
            />
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]">
              Lien Drive — Cours + Exercice
            </Label>
            <Input
              value={courseUrl}
              onChange={(e) => setCourseUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/…/view"
              className="mt-1 bg-[#050508] border-[#6A66EB]/30 text-white font-mono"
              required
              data-testid="chapter-course-url-input"
            />
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]">
              Lien Drive — Correction
            </Label>
            <Input
              value={correctionUrl}
              onChange={(e) => setCorrectionUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/…/view"
              className="mt-1 bg-[#050508] border-[#6A66EB]/30 text-white font-mono"
              required
              data-testid="chapter-correction-url-input"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-[#6A66EB]/40 text-white hover:bg-[#6A66EB]/10 font-mono uppercase tracking-wider text-xs"
              data-testid="chapter-dialog-cancel"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="bg-[#6A66EB] hover:bg-[#5853D6] text-white font-mono uppercase tracking-wider text-xs"
              data-testid="chapter-dialog-submit"
            >
              {busy ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
