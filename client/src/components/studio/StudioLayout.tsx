import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  FileText,
  Search,
  Image,
  Settings,
  LogOut,
  User,
  ExternalLink,
  BookOpen
} from "lucide-react";

export function StudioLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out of Portfolio Studio?")) {
      await logout();
      navigate("/studio/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/studio", icon: LayoutDashboard },
    { label: "Case Studies", href: "/studio/projects", icon: Briefcase },
    { label: "Writing", href: "/studio/writing", icon: BookOpen },
    { label: "Leads", href: "/studio/leads", icon: Inbox },
    { label: "Content Manager", href: "/studio/content", icon: FileText },
    { label: "SEO Manager", href: "/studio/seo", icon: Search },
    { label: "Media Library", href: "/studio/media", icon: Image },
    { label: "Settings", href: "/studio/settings", icon: Settings },
  ];

  // Get dynamic page title based on route
  const getPageTitle = () => {
    const current = navItems.find((item) => item.href === location.pathname);
    if (current) return current.label;
    if (location.pathname.startsWith("/studio/projects/")) return "Edit Case Study";
    if (location.pathname.startsWith("/studio/writing/")) return "Edit Article";
    return "Portfolio Studio";
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050505] text-white font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/[0.06] bg-[#0B0B0B]">
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/[0.06] px-6">
          <Link to="/studio" className="flex items-center gap-2">
            <span className="font-['Bebas_Neue'] text-2xl uppercase tracking-wider text-white">
              Studio<span className="text-white/40">.</span>
            </span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            title="View Live Website"
          >
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/studio"}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-[4px] px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-white/5 text-white shadow-[inset_3px_0_0_#FFF]"
                    : "text-white/40 hover:bg-white/[0.02] hover:text-white/80"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-center justify-between rounded-[6px] bg-white/[0.02] border border-white/[0.04] p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/60 text-xs font-bold border border-white/10">
                {user?.name ? user.name.split(" ").map((n) => n[0]).join("") : "AD"}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-[10px] font-bold text-white tracking-wider uppercase">{user?.name || "Admin"}</p>
                <p className="truncate text-[8px] text-white/30 tracking-wide mt-0.5">{user?.email || "admin@portfolio.studio"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-20 items-center justify-between border-b border-white/[0.06] px-6 md:px-10 bg-[#050505]">
          <h1 className="font-['Bebas_Neue'] text-2xl uppercase tracking-wider text-white">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-4">
            {/* View website link on mobile */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden flex h-8 px-3 items-center gap-1.5 rounded-[4px] border border-white/10 text-[10px] uppercase font-bold tracking-wider text-white/60 hover:text-white"
            >
              Live <ExternalLink size={10} />
            </a>

            {/* User Profile display */}
            <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
              </span>
              <p className="text-[8px] uppercase tracking-[0.25em] text-white/60 font-bold">
                CMS Connected
              </p>
            </div>
          </div>
        </header>

        {/* Page Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#050505] scrollbar-none">
          {children}
        </main>
      </div>
    </div>
  );
}
