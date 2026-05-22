import { Heart } from "lucide-react";

export default function Donations() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12" data-testid="donations-page">
      <div className="mb-8 text-center">
        <Heart className="h-10 w-10 text-[#6A66EB] mx-auto mb-3" />
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6A66EB]">
          // soutenir
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
          Soutiens PolyCode
        </h1>
        <p className="mt-3 font-mono text-sm text-[#A8A8B8] max-w-xl mx-auto">
          Le projet est gratuit et indépendant. Si nos cours t'aident, un café Ko-fi nous
          aide à publier plus vite.
        </p>
      </div>

      <div className="rounded-xl border border-[#6A66EB]/30 bg-[#0A0A0F] overflow-hidden shadow-[0_0_60px_rgba(106,102,235,0.15)]">
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

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#6A66EB]/60">
        Paiement sécurisé via Ko-fi
      </p>
    </div>
  );
}
