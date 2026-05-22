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
import { Loader2, Lock } from "lucide-react";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_ac818131-9ea0-41f3-a2cd-265fcebd45c9/artifacts/6xm6vup0_14a490fc-0287-4667-b70e-0647d66f8b47-removebg-preview.png";

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

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <div
      className="min-h-screen relative flex bg-[#050508] overflow-hidden"
      data-testid="login-page"
    >
      {/* Left: brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative border-r border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#6A66EB]/12 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#6A66EB]/6 blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src={LOGO_URL} alt="PolyCode School" className="h-11 w-11 object-contain" />
          <div className="leading-none">
            <p className="font-display text-lg font-bold text-white">
              PolyCode<span className="text-[#6A66EB]">.</span>School
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6A66EB]/70">
              Apprendre · Coder · Maîtriser
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6A66EB] mb-5">
            // 70 langages · 6 catégories · PDF protégés
          </p>
          <h2 className="font-display text-5xl xl:text-6xl font-black tracking-tighter text-white leading-[0.95]">
            La roadmap
            <br />
            <span className="text-[#6A66EB]">de tes projets.</span>
          </h2>
          <p className="mt-6 max-w-md font-mono text-sm text-[#A8A8B8] leading-relaxed">
            Des fondamentaux à l'ésotérique — une plateforme unique pour te former
            sérieusement, avec exercices et corrections.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          <StatInline value="70" label="Langages" />
          <StatInline value="6" label="Catégories" />
          <StatInline value="∞" label="Chapitres" />
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile backdrop glow */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#6A66EB]/10 blur-[140px]" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img src={LOGO_URL} alt="PolyCode School" className="h-16 w-16 object-contain" />
            <p className="mt-4 font-display text-2xl font-bold text-white">
              PolyCode<span className="text-[#6A66EB]">.</span>School
            </p>
          </div>

          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6A66EB]">
              // auth
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-tighter text-white">
              Connexion requise
            </h1>
            <p className="mt-2 font-mono text-xs text-[#A8A8B8]">
              Ton compte PolyCode School te suit partout.
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-white/10 rounded-none p-0 h-auto">
              <TabsTrigger
                value="signin"
                className="relative rounded-none border-b-2 border-transparent bg-transparent py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A8A8B8] data-[state=active]:text-white data-[state=active]:border-[#6A66EB] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
                data-testid="tab-signin"
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="relative rounded-none border-b-2 border-transparent bg-transparent py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A8A8B8] data-[state=active]:text-white data-[state=active]:border-[#6A66EB] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
                data-testid="tab-signup"
              >
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-8">
              <form onSubmit={handleSignIn} className="space-y-5" data-testid="signin-form">
                <Field
                  id="signin-email"
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  placeholder="vous@exemple.com"
                  testId="signin-email-input"
                />
                <Field
                  id="signin-pw"
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  required
                  placeholder="••••••••"
                  testId="signin-password-input"
                />
                <SubmitBtn busy={busy} testId="signin-submit-btn">
                  Se connecter
                </SubmitBtn>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-8">
              <form onSubmit={handleSignUp} className="space-y-5" data-testid="signup-form">
                <Field
                  id="signup-email"
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  placeholder="vous@exemple.com"
                  testId="signup-email-input"
                />
                <Field
                  id="signup-pw"
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  required
                  minLength={6}
                  placeholder="6 caractères minimum"
                  testId="signup-password-input"
                />
                <SubmitBtn busy={busy} testId="signup-submit-btn">
                  Créer mon compte
                </SubmitBtn>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]">
              ou
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            variant="outline"
            className="w-full bg-transparent border-white/15 text-white hover:bg-white/5 hover:border-white/30 font-mono uppercase tracking-[0.2em] text-[11px] font-bold h-11"
            data-testid="google-signin-btn"
          >
            <svg className="h-4 w-4 mr-2.5" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M21.35 11.1H12v3.83h5.34c-.23 1.49-1.7 4.36-5.34 4.36-3.21 0-5.83-2.66-5.83-5.94s2.62-5.94 5.83-5.94c1.83 0 3.06.78 3.76 1.45l2.57-2.48C16.7 4.86 14.55 4 12 4 6.99 4 3 7.99 3 13s3.99 9 9 9c5.2 0 8.65-3.66 8.65-8.81 0-.59-.07-1.04-.3-2.09z"
              />
            </svg>
            Continuer avec Google
          </Button>

          <p className="mt-8 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]">
            <Lock className="h-3 w-3 text-[#6A66EB]" />
            Authentification protégée par Firebase
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, type, value, onChange, required, placeholder, minLength, testId }) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8B8]"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="mt-1.5 bg-[#0A0A0F] border-white/10 text-white font-mono placeholder:text-[#A8A8B8]/40 focus-visible:ring-[#6A66EB] focus-visible:border-[#6A66EB] h-11"
        data-testid={testId}
      />
    </div>
  );
}

function SubmitBtn({ busy, children, testId }) {
  return (
    <Button
      type="submit"
      disabled={busy}
      className="w-full bg-[#6A66EB] hover:bg-[#5853D6] text-white font-mono uppercase tracking-[0.22em] text-[11px] font-bold h-11 shadow-[0_0_30px_rgba(106,102,235,0.3)]"
      data-testid={testId}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}

function StatInline({ value, label }) {
  return (
    <div>
      <p className="font-display text-3xl font-black text-white">{value}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#A8A8B8]">
        {label}
      </p>
    </div>
  );
}
