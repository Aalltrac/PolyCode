import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_ac818131-9ea0-41f3-a2cd-265fcebd45c9/artifacts/6xm6vup0_14a490fc-0287-4667-b70e-0647d66f8b47-removebg-preview.png";
const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/ac818131-9ea0-41f3-a2cd-265fcebd45c9/images/d3775e7854456267c2921c22ee6bcac9a88166d9a28aab47e736c530d9d7d61e.png";

export default function Login() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const dest = location.state?.from?.pathname || "/";
      navigate(dest, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const mapError = (code) => {
    const map = {
      "auth/invalid-email": "Adresse e-mail invalide.",
      "auth/user-not-found": "Aucun compte trouvé pour cet e-mail.",
      "auth/wrong-password": "Mot de passe incorrect.",
      "auth/invalid-credential": "Identifiants invalides.",
      "auth/email-already-in-use": "Cet e-mail est déjà utilisé.",
      "auth/weak-password": "Mot de passe trop faible (6 caractères minimum).",
      "auth/popup-closed-by-user": "Connexion Google annulée.",
      "auth/network-request-failed": "Erreur réseau. Réessayez.",
    };
    return map[code] || "Une erreur est survenue.";
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Connecté");
    } catch (err) {
      toast.error(mapError(err.code));
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Compte créé");
    } catch (err) {
      toast.error(mapError(err.code));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Connecté avec Google");
    } catch (err) {
      toast.error(mapError(err.code));
    } finally {
      setBusy(false);
    }
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-[#050508] px-4 py-10"
      data-testid="login-page"
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508]/85 via-[#050508]/70 to-[#050508]/95" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO_URL} alt="PolyCode School" className="h-20 w-20 object-contain" />
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-black tracking-tighter text-white">
            PolyCode <span className="text-[#6A66EB]">School</span>
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#6A66EB]/80">
            70 langages · 1 plateforme
          </p>
        </div>

        <div className="rounded-xl border border-[#6A66EB]/30 bg-[#0A0A0F]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(106,102,235,0.15)]">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#0A0A0F] border border-[#6A66EB]/20">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-[#6A66EB] data-[state=active]:text-white font-mono text-xs uppercase tracking-wider"
                data-testid="tab-signin"
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-[#6A66EB] data-[state=active]:text-white font-mono text-xs uppercase tracking-wider"
                data-testid="tab-signup"
              >
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4" data-testid="signin-form">
                <div>
                  <Label
                    htmlFor="signin-email"
                    className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]"
                  >
                    E-mail
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 bg-[#050508] border-[#6A66EB]/30 text-white font-mono focus-visible:ring-[#6A66EB]"
                    placeholder="vous@exemple.com"
                    data-testid="signin-email-input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="signin-pw"
                    className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]"
                  >
                    Mot de passe
                  </Label>
                  <Input
                    id="signin-pw"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 bg-[#050508] border-[#6A66EB]/30 text-white font-mono focus-visible:ring-[#6A66EB]"
                    placeholder="••••••••"
                    data-testid="signin-password-input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-[#6A66EB] hover:bg-[#5853D6] text-white font-mono uppercase tracking-wider text-xs font-bold py-5"
                  data-testid="signin-submit-btn"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4" data-testid="signup-form">
                <div>
                  <Label
                    htmlFor="signup-email"
                    className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]"
                  >
                    E-mail
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 bg-[#050508] border-[#6A66EB]/30 text-white font-mono focus-visible:ring-[#6A66EB]"
                    placeholder="vous@exemple.com"
                    data-testid="signup-email-input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="signup-pw"
                    className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]"
                  >
                    Mot de passe
                  </Label>
                  <Input
                    id="signup-pw"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    className="mt-1 bg-[#050508] border-[#6A66EB]/30 text-white font-mono focus-visible:ring-[#6A66EB]"
                    placeholder="6 caractères minimum"
                    data-testid="signup-password-input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-[#6A66EB] hover:bg-[#5853D6] text-white font-mono uppercase tracking-wider text-xs font-bold py-5"
                  data-testid="signup-submit-btn"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer mon compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#6A66EB]/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB]/60">
              Ou
            </span>
            <div className="flex-1 h-px bg-[#6A66EB]/20" />
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            variant="outline"
            className="w-full bg-transparent border-[#6A66EB]/40 text-white hover:bg-[#6A66EB]/10 font-mono uppercase tracking-wider text-xs font-bold py-5"
            data-testid="google-signin-btn"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M21.35 11.1H12v3.83h5.34c-.23 1.49-1.7 4.36-5.34 4.36-3.21 0-5.83-2.66-5.83-5.94s2.62-5.94 5.83-5.94c1.83 0 3.06.78 3.76 1.45l2.57-2.48C16.7 4.86 14.55 4 12 4 6.99 4 3 7.99 3 13s3.99 9 9 9c5.2 0 8.65-3.66 8.65-8.81 0-.59-.07-1.04-.3-2.09z"
              />
            </svg>
            Continuer avec Google
          </Button>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#6A66EB]/50">
          Authentification protégée par Firebase
        </p>
      </div>
    </div>
  );
}
