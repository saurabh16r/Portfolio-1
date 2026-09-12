import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";
import { api } from "../../services/api.js";
import { KeyRound, Mail, AlertTriangle } from "lucide-react";

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already authenticated, redirect immediately
  React.useEffect(() => {
    if (user) {
      navigate("/studio", { replace: true });
    }
  }, [user, navigate]);

  const from = (location.state as any)?.from?.pathname || "/studio";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        rememberMe
      });

      if (response && response.token && response.user) {
        login(response.token, response.user);
        navigate(from, { replace: true });
      } else {
        setError("Invalid response payload from server.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white px-6">
      <div className="w-full max-w-md space-y-8 rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-10 md:p-12 relative overflow-hidden">
        {/* Decorative thin blur spot */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="text-center relative z-10">
          <h2 className="font-['Bebas_Neue'] text-4xl uppercase tracking-wider text-white">
            Portfolio Studio
          </h2>
          <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">
            Secure CMS Administrator Sign In
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-[4px] border border-red-500/20 bg-red-500/5 px-4.5 py-3 text-xs text-red-400 relative z-10 animate-shake">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <label className="block">
            <span className="mb-2.5 block text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">
              Email Address
            </span>
            <div className="relative">
              <Mail size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.studio"
                className="w-full rounded-[6px] border border-white/[0.08] bg-[#050505] pl-11 pr-5 py-3.5 text-xs text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-white/20"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2.5 block text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">
              Secret Password
            </span>
            <div className="relative">
              <KeyRound size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[6px] border border-white/[0.08] bg-[#050505] pl-11 pr-5 py-3.5 text-xs text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-white/20"
              />
            </div>
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-[4px] border border-white/[0.08] bg-[#050505] checked:bg-white text-black focus:ring-0 cursor-pointer accent-white"
              />
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-bold">
                Remember Me
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative flex items-center justify-center rounded-[4px] bg-white px-5 py-4 text-xs font-bold uppercase tracking-[0.25em] text-black hover:bg-white/90 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border border-black/20 border-t-black" />
            ) : (
              "Sign In to Studio"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
