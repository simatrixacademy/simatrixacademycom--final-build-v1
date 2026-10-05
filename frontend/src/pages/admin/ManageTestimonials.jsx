import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { useToast, Button, Modal, Field, inputClass, Spinner } from "../../components/ui";
import {
  getAdminReviews,
  saveAdminReview,
  deleteAdminReview,
  toggleAdminReviewVisibility,
  initials,
} from "../../lib/reviewsData";

const EMPTY = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  is_active: true,
  campus: "Virudhunagar Center",
  headline: "",
};

export default function ManageTestimonials() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all"); // 'all' | 'live' | 'curated'

  const load = () => {
    // 1. Load local admin reviews immediately
    const local = getAdminReviews();
    setRows(local);
    setLoading(false);

    // 2. Also check backend asynchronously if available
    api
      .adminList("testimonials")
      .then((res) => {
        if (res?.data?.length) {
          const combined = getAdminReviews(res.data);
          setRows(combined);
        }
      })
      .catch(() => {
        // Backend offline or unreachable - local fallback continues seamlessly
      });
  };

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener("simatrix_reviews_updated", handleUpdate);
    return () => window.removeEventListener("simatrix_reviews_updated", handleUpdate);
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      id: row.id,
      name: row.name || "",
      role: row.role || row.course || "",
      content: row.quote || row.content || "",
      rating: row.rating || 5,
      is_active: row.is_active !== false,
      campus: row.campus || "Virudhunagar Center",
      headline: row.headline || "",
    });
    setOpen(true);
  };

  const setField = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const save = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      return toast.error("Please enter both the student name and the review message.");
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        role: form.role.trim() || "Simatrix Student",
        quote: form.content.trim(),
        content: form.content.trim(),
        rating: Number(form.rating) || 5,
      };

      // Save to local storage & dispatch public update
      saveAdminReview(payload);

      // Also sync to backend if online
      if (editing && typeof editing.id === "number") {
        api.adminUpdate("testimonials", editing.id, payload).catch(() => {});
      } else if (!editing) {
        api.adminCreate("testimonials", payload).catch(() => {});
      }

      toast.success(editing ? "Review updated! Public site updated live." : "New review published live on site!");
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const remove = (row) => {
    if (!confirm(`Are you sure you want to remove the review from "${row.name}"?`)) return;
    try {
      deleteAdminReview(row.id);
      if (typeof row.id === "number") {
        api.adminDelete("testimonials", row.id).catch(() => {});
      }
      toast.success("Review deleted from live site.");
      load();
    } catch (e) {
      toast.error(e.message || "Failed to delete review");
    }
  };

  const toggleVisibility = (row) => {
    try {
      toggleAdminReviewVisibility(row.id);
      toast.info(`Review is now ${row.is_active ? "hidden" : "visible"} on the public website.`);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Filtered rows
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((r) => {
      // Tab filter
      if (tab === "live" && !r.isLive) return false;
      if (tab === "curated" && r.isLive) return false;

      // Search filter
      if (!term) return true;
      return (
        r.name?.toLowerCase().includes(term) ||
        r.role?.toLowerCase().includes(term) ||
        (r.quote || r.content)?.toLowerCase().includes(term) ||
        String(r.rating).includes(term)
      );
    });
  }, [rows, tab, search]);

  const liveCount = rows.filter((r) => r.isLive).length;
  const curatedCount = rows.filter((r) => !r.isLive).length;
  const activeCount = rows.filter((r) => r.is_active !== false).length;
  const avgRating = rows.length
    ? (rows.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) / rows.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950 sm:text-3xl">
            Reviews &amp; Testimonials
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage live community reviews submitted on the site, edit student quotes, or adjust ratings.
          </p>
        </div>
        <Button onClick={openNew} variant="primary" className="inline-flex items-center gap-2 self-start sm:self-auto">
          <i className="ti ti-plus" />
          <span>Add New Review</span>
        </Button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reviews</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Live Community</p>
          <p className="mt-1 text-2xl font-bold text-emerald-950 flex items-center gap-2">
            <span>{liveCount}</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Active</p>
          <p className="mt-1 text-2xl font-bold text-brand-900">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Average Rating</p>
          <p className="mt-1 text-2xl font-bold text-amber-950 flex items-center gap-1.5">
            <span>{avgRating}</span>
            <i className="ti ti-star-filled text-amber-400 text-lg" />
          </p>
        </div>
      </div>

      {/* Tab Filter & Search Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Reviews", count: rows.length },
            { id: "live", label: "🟢 Live Community", count: liveCount },
            { id: "curated", label: "🎓 Curated Stories", count: curatedCount },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                tab === t.id
                  ? "bg-[#0b1528] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{t.label}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === t.id ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, role, quote..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Table of Reviews */}
      {loading ? (
        <div className="grid place-items-center py-20">
          <Spinner className="text-3xl text-brand-700" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Student / Author</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Review Message</th>
                <th className="px-5 py-3.5">Origin</th>
                <th className="px-5 py-3.5">Public Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Student */}
                  <td className="px-5 py-3.5 align-top">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-indigo-800 text-xs font-bold text-white shadow-2xs">
                        {initials(r.name)}
                      </span>
                      <div className="min-w-0">
                        <strong className="block truncate font-bold text-slate-900 text-sm">{r.name}</strong>
                        <span className="block truncate text-slate-500">{r.role || r.course || "Simatrix Graduate"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-3.5 align-top whitespace-nowrap">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`ti ti-star-filled ${i < (r.rating || 5) ? "text-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                      <span className="ml-1 font-bold text-slate-700 text-xs">{r.rating ? Number(r.rating).toFixed(1) : "5.0"}</span>
                    </div>
                  </td>

                  {/* Quote */}
                  <td className="px-5 py-3.5 align-top max-w-xs">
                    <p className="line-clamp-2 text-slate-600 leading-relaxed font-normal">
                      “{r.quote || r.content}”
                    </p>
                  </td>

                  {/* Origin */}
                  <td className="px-5 py-3.5 align-top whitespace-nowrap">
                    {r.isLive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Live Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                        <i className="ti ti-certificate text-brand-600" />
                        Curated Story
                      </span>
                    )}
                  </td>

                  {/* Public Status */}
                  <td className="px-5 py-3.5 align-top whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(r)}
                      title="Click to toggle visibility on public site"
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                        r.is_active !== false
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      <i className={`ti ${r.is_active !== false ? "ti-eye" : "ti-eye-off"}`} />
                      <span>{r.is_active !== false ? "Visible" : "Hidden"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-brand-700"
                        title="Edit this review"
                      >
                        <i className="ti ti-edit text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        title="Delete from public site"
                      >
                        <i className="ti ti-trash text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-400">
                    <i className="ti ti-message-2-off text-3xl text-slate-300 block mb-2" />
                    No reviews match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Create Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? `Edit Review: ${editing.name}` : "Create & Publish Review"}
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <i className="ti ti-shield-check text-emerald-600" />
              <span>Updates apply immediately on the website.</span>
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving} variant="primary">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student / Graduate Name" required>
              <input
                className={inputClass}
                value={form.name}
                onChange={setField("name")}
                placeholder="e.g. Anandha Krishnan"
                required
              />
            </Field>
            <Field label="Role / Course Track">
              <input
                className={inputClass}
                value={form.role}
                onChange={setField("role")}
                placeholder="e.g. MERN Full Stack Developer"
              />
            </Field>
          </div>

          <Field label="Star Rating (1 to 5)" required>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className="p-1 text-2xl transition hover:scale-125 focus:outline-none"
                  >
                    <i
                      className={`ti ti-star-filled ${
                        n <= form.rating ? "text-amber-400" : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{form.rating} out of 5 stars</span>
            </div>
          </Field>

          <Field label="Review Content / Feedback Message" required>
            <textarea
              className={inputClass}
              rows={4}
              value={form.content}
              onChange={setField("content")}
              placeholder="What the student said about computer labs, mentors, placement preparation..."
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Headline / Highlight (optional)">
              <input
                className={inputClass}
                value={form.headline}
                onChange={setField("headline")}
                placeholder="e.g. Clear Doubt Clearance & Friendly Mentors"
              />
            </Field>
            <Field label="Campus / Location">
              <input
                className={inputClass}
                value={form.campus}
                onChange={setField("campus")}
                placeholder="Virudhunagar Center"
              />
            </Field>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={setField("is_active")}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <div>
                <strong className="block text-xs font-bold text-slate-900">
                  Visible on public website
                </strong>
                <span className="text-[11px] text-slate-500">
                  Uncheck this to temporarily hide the review from the live site without deleting it.
                </span>
              </div>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
