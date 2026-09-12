import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { Plus, Edit, Trash2, Copy, ExternalLink, ShieldAlert, Star } from "lucide-react";

interface PostType {
  _id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  status: "draft" | "published";
  updatedAt: string;
}

export function WritingManager() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts/all");
      setPosts(res || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      setError("");
      const duplicated = await api.post(`/posts/${id}/duplicate`);
      if (duplicated) {
        // Go directly to edit the duplicated draft
        navigate(`/studio/writing/${duplicated._id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to duplicate article.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article forever? This action cannot be undone.")) return;
    try {
      setError("");
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete article.");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-white text-black font-extrabold";
      default:
        return "bg-white/5 text-white/80 border border-white/[0.06]";
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border border-white/20 border-t-white" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Retrieving Articles...</span>
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

      {/* Header and Add button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="font-['Bebas_Neue'] text-xl uppercase tracking-wider">Writing Archive</h2>
          <p className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">Manage your blog articles & journal entries</p>
        </div>
        <Link
          to="/studio/writing/new"
          className="inline-flex items-center gap-2 rounded-[4px] bg-white px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300"
        >
          <Plus size={12} /> Add Article
        </Link>
      </div>

      {/* Grid Display for Posts */}
      {posts.length > 0 ? (
        <div className="overflow-hidden rounded-[6px] border border-white/[0.06] bg-[#0B0B0B]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-[9px] uppercase font-bold tracking-widest text-white/40">
                  <th className="px-6 py-4.5">Title</th>
                  <th className="px-6 py-4.5">Category</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5">Featured</th>
                  <th className="px-6 py-4.5">Modified</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {posts.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.01] transition-colors text-xs">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white tracking-wider">{p.title}</span>
                        <span className="text-[9px] text-white/30 font-mono mt-0.5">/writing/{p.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60 font-medium">{p.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider text-accent font-bold">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/40">
                      {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      <div className="flex items-center justify-end gap-3.5">
                        {p.status === "published" && (
                          <a
                            href={`/writing/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white transition-colors"
                            title="View Public Post"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDuplicate(p._id)}
                          className="text-white/40 hover:text-white transition-colors"
                          title="Duplicate Draft"
                        >
                          <Copy size={14} />
                        </button>
                        <Link
                          to={`/studio/writing/${p._id}`}
                          className="text-white/40 hover:text-white transition-colors"
                          title="Edit Article"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-white/40 hover:text-red-400 transition-colors"
                          title="Delete Article"
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
          <p className="text-xs text-white/30 max-w-xs leading-relaxed">No blog articles exist yet. Write your first technical or journey article to share your design and engineering knowledge.</p>
        </div>
      )}
    </div>
  );
}
