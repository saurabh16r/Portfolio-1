import React, { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { Inbox, Search, Download, Trash2, Eye, ShieldAlert, Plus } from "lucide-react";

interface LeadType {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  budget: string;
  timeline: string;
  message: string;
  sourcePage: string;
  status: "new" | "contacted" | "follow-up" | "proposal-sent" | "won" | "lost" | "archived";
  notes: string[];
  createdAt: string;
}

export function LeadTracker() {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Detail Modal State
  const [selectedLead, setSelectedLead] = useState<LeadType | null>(null);
  const [newNote, setNewNote] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leads");
      setLeads(res || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setError("");
      const updated = await api.put(`/leads/${id}`, { status: newStatus });
      setLeads(leads.map((l) => (l._id === id ? { ...l, status: updated.status } : l)));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead({ ...selectedLead, status: updated.status });
      }
    } catch (err: any) {
      setError(err.message || "Failed to update lead status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;
    try {
      setError("");
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter((l) => l._id !== id));
      if (selectedLead?._id === id) setSelectedLead(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete lead.");
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    try {
      setError("");
      const updatedNotes = [...selectedLead.notes, newNote.trim()];
      const updated = await api.put(`/leads/${selectedLead._id}`, { notes: updatedNotes });
      
      setLeads(leads.map((l) => (l._id === selectedLead._id ? { ...l, notes: updated.notes } : l)));
      setSelectedLead({ ...selectedLead, notes: updated.notes });
      setNewNote("");
    } catch (err: any) {
      setError(err.message || "Failed to add internal note.");
    }
  };

  // CSV Exporter using high-performance Blobs
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Company", "Phone", "Budget", "Timeline", "Status", "Message", "Submitted Date"];
    
    const rows = leads.map(l => [
      l.name,
      l.email,
      l.company || "",
      l.phone || "",
      l.budget,
      l.timeline,
      l.status,
      l.message.replace(/"/g, '""'),
      new Date(l.createdAt).toISOString()
    ]);

    const csvString = [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `portfolio_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters locally based on search term & status filter
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-white text-black font-extrabold";
      case "won":
        return "bg-emerald-500/25 text-emerald-400 border border-emerald-500/20";
      case "lost":
        return "bg-red-500/15 text-red-400 border border-red-500/10";
      case "archived":
        return "bg-white/10 text-white/50 border border-white/10";
      default:
        return "bg-white/5 text-white/80 border border-white/[0.06]";
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Scanning Leads...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-[4px] border border-red-500/20 bg-red-500/5 px-4.5 py-3 text-xs text-red-400">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Title toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">Leads Tracker</h2>
          <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">Manage inbound project inquiries</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={leads.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-white/10 bg-white/[0.02] px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white/60 hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <Download size={12} /> Export CSV
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[4px] border border-white/[0.08] bg-[#0B0B0B] pl-11 pr-5 py-2.5 text-xs text-white outline-none focus:border-white/20"
          />
        </div>

        {/* Status drop filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-[4px] border border-white/[0.08] bg-[#0B0B0B] px-3.5 py-2 text-xs text-white outline-none focus:border-white/20 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New / Unread</option>
            <option value="contacted">Contacted</option>
            <option value="follow-up">Follow Up</option>
            <option value="proposal-sent">Proposal Sent</option>
            <option value="won">Won (Active)</option>
            <option value="lost">Lost</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      {filteredLeads.length > 0 ? (
        <div className="overflow-hidden rounded-[6px] border border-white/[0.06] bg-[#0B0B0B]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-[9px] uppercase font-bold tracking-widest text-white/40">
                  <th className="px-6 py-4.5">Client</th>
                  <th className="px-6 py-4.5">Budget / Timeline</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5">Submitted Date</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeads.map((l) => (
                  <tr key={l._id} className="hover:bg-white/[0.01] transition-colors text-xs">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white tracking-wider">{l.name}</span>
                        <span className="text-[10px] text-white/40 mt-0.5">{l.email} {l.company ? `· ${l.company}` : ""}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-white/60">
                        <span>{l.budget}</span>
                        <span className="text-[10px] text-white/30 mt-0.5">{l.timeline}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={l.status}
                        onChange={(e) => handleStatusChange(l._id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-[8px] uppercase tracking-wider font-extrabold cursor-pointer outline-none ${getStatusColor(l.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="follow-up">Follow Up</option>
                        <option value="proposal-sent">Proposal Sent</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-white/40">
                      {new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        <button
                          onClick={() => setSelectedLead(l)}
                          className="text-white/40 hover:text-white transition-colors"
                          title="View Message details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(l._id)}
                          className="text-white/40 hover:text-red-400 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-white/[0.06] bg-[#0B0B0B] rounded-[6px] py-16 text-center">
          <p className="text-xs text-white/30 max-w-xs leading-relaxed">No project inquiries match the filters.</p>
        </div>
      )}

      {/* Details Slide-Over / Dialog Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl flex flex-col rounded-[6px] border border-white/[0.08] bg-[#0B0B0B] overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01] px-6 py-4.5">
              <div>
                <h3 className="font-['Bebas_Neue'] text-lg uppercase tracking-wider">Lead Inquiry Details</h3>
                <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold mt-0.5">Submitted via {selectedLead.sourcePage}</p>
              </div>
              <button
                onClick={() => { setSelectedLead(null); setNewNote(""); }}
                className="text-white/40 hover:text-white font-bold text-xs"
              >
                Close
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-none">
              {/* Client metrics */}
              <div className="grid gap-6 grid-cols-2 md:grid-cols-4 border-b border-white/[0.04] pb-6">
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30 font-bold mb-1">Name</span>
                  <p className="text-xs font-bold text-white">{selectedLead.name}</p>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30 font-bold mb-1">Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-xs text-white hover:underline">{selectedLead.email}</a>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30 font-bold mb-1">Company</span>
                  <p className="text-xs text-white">{selectedLead.company || "N/A"}</p>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30 font-bold mb-1">Budget</span>
                  <p className="text-xs text-white font-semibold">{selectedLead.budget}</p>
                </div>
              </div>

              {/* Inquiry Message */}
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-white/30 font-bold mb-2">Message Body</span>
                <p className="rounded-[4px] border border-white/[0.06] bg-[#050505] p-4 text-xs text-white/80 leading-relaxed white-space-pre-line">
                  {selectedLead.message}
                </p>
              </div>

              {/* Internal Comments / Notes Tracker */}
              <div className="pt-6 border-t border-white/[0.04] space-y-4">
                <span className="block text-[8px] uppercase tracking-widest text-white/30 font-bold">Internal Admin Notes</span>
                
                <div className="space-y-2">
                  {selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note, nIdx) => (
                      <div key={nIdx} className="rounded-[4px] bg-white/[0.02] border border-white/[0.04] px-4 py-2.5 text-xs text-white/60">
                        {note}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-white/30 italic">No internal comments added to this lead yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal follow-up comment..."
                    className="w-full rounded-[4px] border border-white/[0.08] bg-[#050505] px-4 py-2.5 text-xs text-white outline-none focus:border-white/20"
                  />
                  <button
                    onClick={handleAddNote}
                    className="rounded-[4px] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-white/90"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
