import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.js";
import { api } from "../../services/api.js";
import { Save, User, ShieldAlert } from "lucide-react";

export function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Saurabh Rathore");
  const [email, setEmail] = useState(user?.email || "admin@portfolio.studio");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/auth/profile", { name });
      setSuccess("Profile settings updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/update-password", { currentPassword, newPassword });
      setSuccess("Administrator password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update security credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {error && (
        <div className="col-span-full flex items-center gap-3 rounded-[4px] border border-red-500/20 bg-red-500/5 px-4.5 py-3 text-xs text-red-400">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="col-span-full rounded-[4px] border border-emerald-500/20 bg-emerald-500/5 px-4.5 py-3 text-xs text-emerald-400">
          {success}
        </div>
      )}

      {/* Profile Form */}
      <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8 space-y-6">
        <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3 flex items-center gap-2">
          <User size={13} className="text-white/40" /> Admin Credentials
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Administrator Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Email Address</span>
            <input
              type="email"
              disabled
              value={email}
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505]/40 px-4 py-2.5 text-xs text-white/50 outline-none cursor-not-allowed"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 transition-all duration-300"
          >
            <Save size={12} /> Save Credentials
          </button>
        </form>
      </div>

      {/* Security Form */}
      <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8 space-y-6">
        <h3 className="text-xs uppercase tracking-widest font-bold text-white/50 border-b border-white/[0.04] pb-3">
          Security & Access Settings
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Current Password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-wider text-white/40 font-bold">Confirm New Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 transition-all duration-300"
          >
            Update Security Access
          </button>
        </form>
      </div>
    </div>
  );
}
