import { Heart, Coffee } from "lucide-react";

export default function Donations() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16" data-testid="donations-page">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#6A66EB]/30 bg-[#6A66EB]/10 mb-5">
          <Heart className="h-5 w-5 text-[#6A66EB]" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6A66EB]">
          // soutenir
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white">
          Soutiens le projet
        </h1>
        <p className="mt-4 max-w-lg mx-auto font-mono text-sm text-[#A8A8B8] leading-relaxed">
          PolyCode School est gratuit et indépendant. Un café Ko-fi nous aide à
          publier plus de cours, plus vite.
        </p>
      </header>

      <div className="rounded-xl border border-white/10 bg-[#0A0A0F] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
          <Coffee className="h-4 w-4 text-[#6A66EB]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]">
            Ko-fi · Paiement sécurisé
          </span>
        </div>
        <iframe
          id="kofiframe"
          src="https://ko-fi.com/polycodeschool/?hidefeed=true&widget=true&embed=true&preview=true"
          title="PolyCode School Ko-fi"
          style={{
            border: "none",
            width: "100%",
            background: "#6A66EB",
          }}
          height="712"
          data-testid="kofi-iframe"
        />
      </div>

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#A8A8B8]">
        Merci à celles et ceux qui font vivre PolyCode School
      </p>
    </div>
  );
}
