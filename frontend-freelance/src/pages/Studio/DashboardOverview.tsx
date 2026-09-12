import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import { Briefcase, Inbox, Eye, ShieldAlert, ArrowUpRight, Clock } from "lucide-react";

interface CaseStudyType {
  _id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
}

interface LeadType {
  _id: string;
  name: string;
  email: string;
  budget: string;
  status: string;
  createdAt: string;
}

export function DashboardOverview() {
  const [projects, setProjects] = useState<CaseStudyType[]>([]);
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, leadsRes] = await Promise.all([
        api.get("/case-studies/all"),
        api.get("/leads")
      ]);
      setProjects(projectsRes || []);
      setLeads(leadsRes || []);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Assembling Metrics...</span>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === "published").length;
  const draftProjects = projects.filter((p) => p.status === "draft").length;
  
  const totalLeads = leads.length;
  const unreadLeads = leads.filter((l) => l.status === "new").length;

  const recentLeads = leads.slice(0, 4);
  const recentProjects = projects.slice(0, 4);

  // Format date relative helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-10">
      {error && (
        <div className="flex items-center gap-3 rounded-[4px] border border-red-500/20 bg-red-500/5 px-4.5 py-3 text-xs text-red-400">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-[6px] border border-white/[0.06] bg-[#111111] p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest">Case Studies</span>
            <Briefcase size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Bebas_Neue'] text-4xl tracking-wide">{totalProjects}</span>
            <span className="text-[10px] text-white/30 tracking-wider">Total</span>
          </div>
          <div className="mt-4 flex gap-4 text-[9px] uppercase font-bold tracking-widest text-white/40 border-t border-white/[0.04] pt-3">
            <span>{publishedProjects} Published</span>
            <span>·</span>
            <span>{draftProjects} Drafts</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-[6px] border border-white/[0.06] bg-[#111111] p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest">Leads Status</span>
            <Inbox size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Bebas_Neue'] text-4xl tracking-wide">{totalLeads}</span>
            <span className="text-[10px] text-white/30 tracking-wider">Received</span>
          </div>
          <div className="mt-4 flex gap-4 text-[9px] uppercase font-bold tracking-widest text-white/40 border-t border-white/[0.04] pt-3">
            <span className="text-white">{unreadLeads} Unread / New</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-[6px] border border-white/[0.06] bg-[#111111] p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest">Leads Pipeline</span>
            <Inbox size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Bebas_Neue'] text-4xl tracking-wide">
              {leads.filter((l) => ["proposal-sent", "won"].includes(l.status)).length}
            </span>
            <span className="text-[10px] text-white/30 tracking-wider">Active</span>
          </div>
          <div className="mt-4 flex gap-4 text-[9px] uppercase font-bold tracking-widest text-white/40 border-t border-white/[0.04] pt-3">
            <span className="text-emerald-500">{leads.filter(l => l.status === "won").length} Projects Won</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-[6px] border border-white/[0.06] bg-[#111111] p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest">Last Update</span>
            <Clock size={16} />
          </div>
          <div className="flex flex-col justify-end h-9">
            <span className="text-[10px] text-white font-bold tracking-wider truncate">
              {projects.length > 0 ? formatDate(projects[0].updatedAt) : "No modifications"}
            </span>
            <span className="text-[8px] text-white/30 uppercase tracking-widest mt-1">Latest change</span>
          </div>
        </div>
      </div>

      {/* Grid: Details Activity logs */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side: Recent Leads */}
        <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">Recent Leads</h3>
              <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">Incoming form submissions</p>
            </div>
            <Link to="/studio/leads" className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-0.5 hover:border-white transition-all">
              All Leads <ArrowUpRight size={10} />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04] space-y-4">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead._id} className="pt-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white tracking-wider">{lead.name}</p>
                      {lead.status === "new" && (
                        <span className="rounded-full bg-white text-black text-[7px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">{lead.email} · {lead.budget}</p>
                  </div>
                  <span className="text-[9px] text-white/30 tracking-wider">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 py-6 text-center">No leads received yet.</p>
            )}
          </div>
        </div>

        {/* Right Side: Recent Projects */}
        <div className="rounded-[6px] border border-white/[0.06] bg-[#0B0B0B] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">Recent Case Studies</h3>
              <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">Projects modified recently</p>
            </div>
            <Link to="/studio/projects" className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-0.5 hover:border-white transition-all">
              All Cases <ArrowUpRight size={10} />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04] space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((proj) => (
                <div key={proj._id} className="pt-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white tracking-wider">{proj.title}</p>
                    <span className={`inline-block rounded-full px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wider mt-1 ${
                      proj.status === "published" ? "bg-white/10 text-white" : "bg-white/5 text-white/45"
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                  <span className="text-[9px] text-white/30 tracking-wider">
                    {formatDate(proj.updatedAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 py-6 text-center">No case studies created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
