import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useToast, Button, Modal, Field, inputClass, Spinner } from "../../components/ui";

const DURATION_OPTIONS = [
  { label: "24 Hours (Temporary)", value: 24 },
  { label: "7 Days", value: 168 },
  { label: "30 Days", value: 720 },
  { label: "Permanent Ban", value: 0 },
];

const PRESET_REASONS = [
  "Repeated failed login attempts (Brute force)",
  "Automated bot scanning / honeypot triggered",
  "Spam submission on enquiry forms",
  "Unauthorized API crawling",
  "Custom reason",
];

export default function ManageBannedIps() {
  const toast = useToast();
  const { admin } = useAuth();

  const [data, setData] = useState(null);
  const [currentIp, setCurrentIp] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'banned' | 'monitored'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [ipInput, setIpInput] = useState("");
  const [reasonPreset, setReasonPreset] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [durationHours, setDurationHours] = useState(24);
  const [submitting, setSubmitting] = useState(false);

  // Unban confirmation modal
  const [unbanTarget, setUnbanTarget] = useState(null);
  const [unbanning, setUnbanning] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.adminList("banned_ips");
      setData(res.data || []);
      if (res.current_ip) setCurrentIp(res.current_ip);
    } catch (err) {
      toast.error(err.message || "Failed to load banned IP records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openBanModal = () => {
    setIpInput("");
    setReasonPreset(PRESET_REASONS[0]);
    setCustomReason("");
    setDurationHours(24);
    setModalOpen(true);
  };

  const handleCreateBan = async (e) => {
    e.preventDefault();
    const cleanIp = ipInput.trim();
    if (!cleanIp) return toast.error("Please enter a valid IP address.");

    // Simple IPv4 / IPv6 validation
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^localhost$/i;
    if (!ipv4Regex.test(cleanIp) && !ipv6Regex.test(cleanIp)) {
      return toast.error("Please enter a valid IPv4 or IPv6 address (e.g. 192.168.1.10).");
    }

    if (cleanIp === currentIp) {
      return toast.error("Safety guard: You cannot ban your current IP address.");
    }

    const finalReason = reasonPreset === "Custom reason" ? customReason.trim() : reasonPreset;
    if (!finalReason) return toast.error("Please specify a reason for the ban.");

    setSubmitting(true);
    try {
      await api.adminCreate("banned_ips", {
        ip: cleanIp,
        reason: finalReason,
        hours: durationHours,
      });
      toast.success(`IP [${cleanIp}] has been successfully banned.`);
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to ban IP address.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmUnban = async () => {
    if (!unbanTarget) return;
    setUnbanning(true);
    try {
      await api.adminDelete("banned_ips", unbanTarget.id);
      toast.success(`IP [${unbanTarget.ip}] has been unbanned.`);
      setUnbanTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to unban IP address.");
    } finally {
      setUnbanning(false);
    }
  };

  const quickBanMonitored = async (row) => {
    try {
      await api.adminUpdate("banned_ips", row.id, {
        is_banned: 1,
        hours: 24,
        reason: "Manually promoted from monitored attempts to full ban by admin",
      });
      toast.success(`IP [${row.ip}] is now banned.`);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to ban IP.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  // Metrics computation
  const records = data || [];
  const activeBans = records.filter((r) => r.is_banned);
  const monitoredRows = records.filter((r) => !r.is_banned);
  const systemBans = activeBans.filter((r) => r.banned_by === "system");
  const manualBans = activeBans.filter((r) => r.banned_by !== "system");

  // Filtering
  const term = search.trim().toLowerCase();
  const filtered = records.filter((r) => {
    if (filterTab === "banned" && !r.is_banned) return false;
    if (filterTab === "monitored" && r.is_banned) return false;
    if (!term) return true;
    return (
      (r.ip || "").toLowerCase().includes(term) ||
      (r.reason || "").toLowerCase().includes(term) ||
      (r.banned_by || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-700">
              <i className="ti ti-shield-lock text-lg" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Security & IP Ban Controls
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time IP defense system against brute-force logins and abusive requests. Admins can view, ban, and unban IPs at any time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            title="Refresh List"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <i className={`ti ti-refresh ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Button onClick={openBanModal} className="bg-rose-600 hover:bg-rose-700 text-white">
            <i className="ti ti-ban" /> Ban New IP
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Your IP Card */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Your Current IP</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Whitelisted
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 font-mono text-lg font-bold text-slate-900">
            <span>{currentIp || "Detecting..."}</span>
            {currentIp && (
              <button
                type="button"
                onClick={() => copyToClipboard(currentIp)}
                className="text-slate-400 hover:text-slate-700"
                title="Copy current IP"
              >
                <i className="ti ti-copy text-sm" />
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-emerald-700">Protected against accidental self-ban</p>
        </div>

        {/* Active Bans Card */}
        <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Bans</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50 text-rose-600">
              <i className="ti ti-shield-x text-sm" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600">{activeBans.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            {systemBans.length} automatic + {manualBans.length} manual
          </p>
        </div>

        {/* System Auto-Bans Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Auto-Defended Attacks</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <i className="ti ti-flame text-sm" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">{systemBans.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">Banned after 5 consecutive failed logins</p>
        </div>

        {/* Monitored IP Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Monitored At-Risk IPs</span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <i className="ti ti-radar text-sm" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-slate-900">{monitoredRows.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">IPs with 1–4 failed login attempts</p>
        </div>
      </div>

      {/* Control Bar: Tabs + Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: "all", label: `All (${records.length})` },
            { id: "banned", label: `Active Bans (${activeBans.length})` },
            { id: "monitored", label: `Monitored (${monitoredRows.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                filterTab === tab.id
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by IP, reason, or admin..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading && !data ? (
          <div className="grid place-items-center py-20">
            <Spinner className="text-3xl text-brand-600" />
            <p className="mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Loading security logs...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
              <i className="ti ti-shield-check" />
            </span>
            <h3 className="mt-3 font-display text-base font-bold text-slate-900">
              {search ? "No matching IP records found" : "No banned IP addresses"}
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? "Try clearing your search query to see all records."
                : "Your system has no active IP bans. Failed login attacks will be isolated and banned here automatically."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-3 text-xs font-semibold text-brand-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">IP Address</th>
                  <th className="px-5 py-3.5">Status & Attempts</th>
                  <th className="px-5 py-3.5">Reason / Trigger</th>
                  <th className="px-5 py-3.5">Enforced By</th>
                  <th className="px-5 py-3.5">Duration / Expiry</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => {
                  const isCurrent = row.ip === currentIp;
                  const isBanned = Boolean(row.is_banned);
                  return (
                    <tr
                      key={row.id}
                      className={`transition hover:bg-slate-50/60 ${
                        isCurrent ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      {/* IP Address */}
                      <td className="px-5 py-4 font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{row.ip}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(row.ip)}
                            title="Copy IP"
                            className="text-slate-400 hover:text-slate-700"
                          >
                            <i className="ti ti-copy text-xs" />
                          </button>
                          {isCurrent && (
                            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status & Attempts */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {isBanned ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-600" /> Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Monitored
                            </span>
                          )}
                          <p className="text-[11px] text-slate-500">
                            {row.failed_attempts || 0} failed attempt{(row.failed_attempts || 0) === 1 ? "" : "s"}
                          </p>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-5 py-4 text-xs text-slate-700 max-w-xs truncate" title={row.reason}>
                        <p className="font-semibold text-slate-800 truncate">{row.reason || "No reason specified"}</p>
                        <p className="text-[10px] text-slate-400">
                          {row.created_at ? new Date(row.created_at).toLocaleString() : ""}
                        </p>
                      </td>

                      {/* Enforced By */}
                      <td className="px-5 py-4 text-xs">
                        {row.banned_by === "system" ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                            <i className="ti ti-cpu text-slate-500" /> Auto System
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                            <i className="ti ti-user-shield text-indigo-500" /> {row.banned_by || "Admin"}
                          </span>
                        )}
                      </td>

                      {/* Duration / Expiry */}
                      <td className="px-5 py-4 text-xs text-slate-600">
                        {row.banned_until ? (
                          <div>
                            <p className="font-semibold text-slate-800">
                              Until {new Date(row.banned_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(row.banned_until).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                            Permanent
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isBanned ? (
                            <button
                              type="button"
                              onClick={() => setUnbanTarget(row)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                            >
                              <i className="ti ti-lock-open" /> Unban IP
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => quickBanMonitored(row)}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white"
                                title="Ban this IP immediately"
                              >
                                <i className="ti ti-ban" /> Ban Now
                              </button>
                              <button
                                type="button"
                                onClick={() => setUnbanTarget(row)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                                title="Clear attempt log"
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Emergency CLI Recovery Instructions */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-800 text-amber-400">
              <i className="ti ti-terminal text-lg" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Emergency Terminal Recovery (Artisan CLI)</h4>
              <p className="mt-0.5 text-xs text-slate-400">
                In case of emergency or locked access, you can manage bans directly from your server console without needing the UI.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {[
            { label: "Unban specific IP", cmd: "php artisan ip:unban <ip_address>" },
            { label: "Emergency unban ALL IPs", cmd: "php artisan ip:unban all" },
            { label: "View all bans in console", cmd: "php artisan ip:list" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs text-slate-200"
            >
              <div className="min-w-0 pr-2">
                <p className="text-[10px] font-sans font-semibold text-slate-400">{item.label}</p>
                <code className="truncate text-amber-300 block">{item.cmd}</code>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(item.cmd)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                title="Copy command"
              >
                <i className="ti ti-copy text-xs" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testing Instructions Card */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-blue-50/40 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <i className="ti ti-test-pipe text-lg" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-slate-900">How to Test the IP Ban System</h4>
            <p className="mt-0.5 text-xs text-slate-500">
              Follow these simple steps in your terminal or browser to verify the ban screen:
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-white/80 bg-white/80 p-3.5 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-[10px] text-white">1</span>
              <span>Fast Terminal Test (Recommended)</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              1. Open PowerShell and run: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-rose-600">php artisan ip:ban 127.0.0.1</code>
            </p>
            <p className="text-slate-600 text-[11px]">
              2. Refresh your browser at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">http://localhost:5173</code> — the entire screen will immediately show <strong className="text-rose-600">&ldquo;You are banned&rdquo;</strong>!
            </p>
            <p className="text-slate-600 text-[11px]">
              3. Unban yourself in terminal: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-600">php artisan ip:unban 127.0.0.1</code> and refresh the page to restore access.
            </p>
          </div>

          <div className="rounded-xl border border-white/80 bg-white/80 p-3.5 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-[10px] text-white">2</span>
              <span>Brute Force Attack Auto-Defense Test</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              1. Open <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/admin/login</code> in an incognito window.
            </p>
            <p className="text-slate-600 text-[11px]">
              2. Enter any username with a wrong password <strong>5 times</strong>.
            </p>
            <p className="text-slate-600 text-[11px]">
              3. On the 5th attempt, the system automatically bans your IP address for 24 hours, locking access with the <strong className="text-rose-600">&ldquo;You are banned&rdquo;</strong> screen.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Ban Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ban IP Address">
        <form onSubmit={handleCreateBan} className="space-y-4">
          <Field label="IP Address to Block">
            <input
              type="text"
              required
              placeholder="e.g. 192.168.1.100 or 2001:db8::1"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              className={inputClass}
            />
          </Field>

          {ipInput.trim() === currentIp && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
              <i className="ti ti-alert-triangle text-base text-rose-600" />
              <span>Warning: This is your current IP address. Banning it will lock you out of this session.</span>
            </div>
          )}

          <Field label="Ban Duration">
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className={inputClass}
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Reason for Ban">
            <select
              value={reasonPreset}
              onChange={(e) => setReasonPreset(e.target.value)}
              className={inputClass}
            >
              {PRESET_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>

          {reasonPreset === "Custom reason" && (
            <Field label="Custom Reason Description">
              <textarea
                required
                rows={2}
                placeholder="Explain the specific reason for this IP ban..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className={inputClass}
              />
            </Field>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || ipInput.trim() === currentIp}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {submitting ? "Enforcing ban..." : "Enforce Ban"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Unban Confirmation Modal */}
      <Modal open={Boolean(unbanTarget)} onClose={() => setUnbanTarget(null)} title="Confirm Unban">
        {unbanTarget && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to remove the ban for IP{" "}
              <strong className="font-mono text-slate-900">{unbanTarget.ip}</strong>?
            </p>
            <p className="text-xs text-slate-500">
              This will immediately lift all access restrictions for this IP address and clear their failed login attempt counter.
            </p>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="secondary" type="button" onClick={() => setUnbanTarget(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmUnban}
                disabled={unbanning}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {unbanning ? "Unbanning..." : "Confirm & Unban"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
