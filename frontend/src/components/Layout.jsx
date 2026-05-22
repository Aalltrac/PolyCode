import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, MessageSquare, Map, Shield, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_ac818131-9ea0-41f3-a2cd-265fcebd45c9/artifacts/6xm6vup0_14a490fc-0287-4667-b70e-0647d66f8b47-removebg-preview.png";

export function Layout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initial =
    (user?.displayName || user?.email || "?").charAt(0).toUpperCase() || "?";

  const navLink = ({ isActive }) =>
    `relative flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${
      isActive
        ? "text-white"
        : "text-[#A8A8B8] hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#050508] text-[#EDEDED] flex flex-col">
      <header
        className="sticky top-0 z-50 bg-[#050508]/85 backdrop-blur-xl border-b border-white/5"
        data-testid="app-header"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-[61px] md:h-[69px]">
          <Link to="/" className="flex items-center gap-3 group" data-testid="header-logo-link">
            <img
              src={LOGO_URL}
              alt="PolyCode School"
              className="h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-[5deg]"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-tight text-white">
                PolyCode<span className="text-[#6A66EB]">.</span>School
              </span>
              <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[#6A66EB]/70">
                70 langages · 1 plateforme
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center">
            <NavLink to="/" end className={navLink} data-testid="nav-roadmap">
              {({ isActive }) => (
                <>
                  <Map className="h-3.5 w-3.5" /> Roadmap
                  {isActive && (
                    <span className="absolute -bottom-[23px] left-3 right-3 h-px bg-[#6A66EB]" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/messages" className={navLink} data-testid="nav-messages">
              {({ isActive }) => (
                <>
                  <MessageSquare className="h-3.5 w-3.5" /> Messages
                  {isActive && (
                    <span className="absolute -bottom-[23px] left-3 right-3 h-px bg-[#6A66EB]" />
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/donations" className={navLink} data-testid="nav-donations">
              {({ isActive }) => (
                <>
                  <Heart className="h-3.5 w-3.5" /> Soutenir
                  {isActive && (
                    <span className="absolute -bottom-[23px] left-3 right-3 h-px bg-[#6A66EB]" />
                  )}
                </>
              )}
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLink} data-testid="nav-admin">
                {({ isActive }) => (
                  <>
                    <Shield className="h-3.5 w-3.5" /> Admin
                    {isActive && (
                      <span className="absolute -bottom-[23px] left-3 right-3 h-px bg-[#6A66EB]" />
                    )}
                  </>
                )}
              </NavLink>
            )}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2.5 group outline-none"
              data-testid="user-menu-trigger"
            >
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="font-mono text-[11px] text-white truncate max-w-[180px]">
                  {user?.displayName || user?.email?.split("@")[0]}
                </span>
                {isAdmin && (
                  <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-[#6A66EB]">
                    Admin
                  </span>
                )}
              </div>
              <div className="w-9 h-9 rounded-full border border-[#6A66EB]/40 bg-[#6A66EB]/10 flex items-center justify-center font-display font-bold text-sm text-white group-hover:border-[#6A66EB] transition-colors">
                {initial}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#0A0A0F] border-white/10 text-white min-w-[220px]"
            >
              <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A8A8B8] truncate">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="md:hidden font-mono text-xs cursor-pointer focus:bg-[#6A66EB]/10"
              >
                <Map className="h-3.5 w-3.5 mr-2" /> Roadmap
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/messages")}
                className="md:hidden font-mono text-xs cursor-pointer focus:bg-[#6A66EB]/10"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-2" /> Messages
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/donations")}
                className="md:hidden font-mono text-xs cursor-pointer focus:bg-[#6A66EB]/10"
              >
                <Heart className="h-3.5 w-3.5 mr-2" /> Soutenir
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => navigate("/admin")}
                  className="md:hidden font-mono text-xs cursor-pointer focus:bg-[#6A66EB]/10"
                >
                  <Shield className="h-3.5 w-3.5 mr-2" /> Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-white/5 md:hidden" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-mono text-xs cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
                data-testid="header-logout-btn"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" /> Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-white/5 py-8 mt-16 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="" className="h-6 w-6 opacity-60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB]/60">
              © {new Date().getFullYear()} PolyCode School
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6A66EB]/60">
            Apprendre · Coder · Maîtriser
          </span>
        </div>
      </footer>
    </div>
  );
}
