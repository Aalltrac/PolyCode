import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, MessageSquare, Map, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_ac818131-9ea0-41f3-a2cd-265fcebd45c9/artifacts/6xm6vup0_14a490fc-0287-4667-b70e-0647d66f8b47-removebg-preview.png";

export function Layout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLink = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-xs uppercase tracking-[0.18em] font-bold transition-all duration-200 ${
      isActive
        ? "text-white bg-[#6A66EB]/15 border border-[#6A66EB]/40"
        : "text-[#A8A8B8] hover:text-white hover:bg-[#6A66EB]/10 border border-transparent"
    }`;

  return (
    <div className="min-h-screen bg-[#050508] text-[#EDEDED] flex flex-col">
      <header
        className="sticky top-0 z-50 bg-[#050508]/70 backdrop-blur-xl border-b border-[#6A66EB]/20"
        data-testid="app-header"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-3" data-testid="header-logo-link">
            <img src={LOGO_URL} alt="PolyCode School" className="h-10 w-10 object-contain" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                PolyCode <span className="text-[#6A66EB]">School</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#6A66EB]/70">
                70 langages · 1 plateforme
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLink} data-testid="nav-roadmap">
              <Map className="h-3.5 w-3.5" /> Roadmap
            </NavLink>
            <NavLink to="/messages" className={navLink} data-testid="nav-messages">
              <MessageSquare className="h-3.5 w-3.5" /> Messages
            </NavLink>
            <NavLink to="/donations" className={navLink} data-testid="nav-donations">
              <Heart className="h-3.5 w-3.5" /> Soutenir
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLink} data-testid="nav-admin">
                <Shield className="h-3.5 w-3.5" /> Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline-block font-mono text-xs text-[#A8A8B8] truncate max-w-[180px]"
              data-testid="header-user-email"
            >
              {user?.email || user?.displayName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[#A8A8B8] hover:text-white hover:bg-[#6A66EB]/10 border border-[#6A66EB]/20"
              data-testid="header-logout-btn"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs uppercase tracking-wider">Quitter</span>
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-[#6A66EB]/10 px-4 py-2 flex gap-1 overflow-x-auto">
          <NavLink to="/" end className={navLink} data-testid="mobile-nav-roadmap">
            <Map className="h-3.5 w-3.5" /> Roadmap
          </NavLink>
          <NavLink to="/messages" className={navLink} data-testid="mobile-nav-messages">
            <MessageSquare className="h-3.5 w-3.5" /> Messages
          </NavLink>
          <NavLink to="/donations" className={navLink} data-testid="mobile-nav-donations">
            <Heart className="h-3.5 w-3.5" /> Soutenir
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLink} data-testid="mobile-nav-admin">
              <Shield className="h-3.5 w-3.5" /> Admin
            </NavLink>
          )}
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-[#6A66EB]/15 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6A66EB]/60">
            © {new Date().getFullYear()} PolyCode School · Tous droits réservés
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6A66EB]/60">
            Apprendre · Coder · Maîtriser
          </p>
        </div>
      </footer>
    </div>
  );
}
