import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Spinner, useToast } from "../../components/ui";
import { AdminNotificationsProvider, NotificationBell, useAdminNotifications } from "./AdminNotifications";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "ti-layout-dashboard", end: true },
  { to: "/admin/courses", label: "Courses", icon: "ti-book-2" },
  { to: "/admin/categories", label: "Categories", icon: "ti-category" },
  { to: "/admin/enquiries", label: "Enquiries", icon: "ti-inbox" },
  { to: "/admin/testimonials", label: "Testimonials", icon: "ti-message-star" },
  { to: "/admin/blog", label: "Blog", icon: "ti-news" },
  { to: "/admin/gallery", label: "Gallery", icon: "ti-photo" },
  { to: "/admin/awards", label: "Awards", icon: "ti-award" },
  { to: "/admin/staff", label: "Staff", icon: "ti-users" },
  { to: "/admin/security", label: "IP Security", icon: "ti-shield-lock" },
  { to: "/admin/activity", label: "Activity log", icon: "ti-history" },
  { to: "/admin/settings", label: "Settings", icon: "ti-settings" },
];

export default function AdminLayout() {
  const { admin, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-950"><div className="text-center"><Spinner className="mx-auto text-3xl text-amber-300" /><p className="mt-4 text-xs font-bold uppercase tracking-[.24em] text-slate-500">Loading workspace</p></div></div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <AdminNotificationsProvider><AdminShell admin={admin} /></AdminNotificationsProvider>;
}

function AdminShell({ admin }) {
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const page = LINKS.find((item) => item.end ? pathname === item.to : pathname.startsWith(item.to)) || LINKS[0];

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  const doLogout = () => { logout(); toast.info("You have been signed out."); navigate("/admin/login"); };

  return <div className="flex h-screen overflow-hidden bg-[#f5f7fb] text-slate-900">
    {mobileOpen && <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" />}

    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-brand-950 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl" /><div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" /></div>
      <div className="relative flex h-20 items-center gap-3 border-b border-white/10 px-5">
        <Link to="/admin" className="flex min-w-0 flex-1 items-center gap-3"><span className="grid h-11 w-12 shrink-0 place-items-center rounded-xl bg-white p-1.5"><img src="/simatrix_logo_only.svg" alt="" className="h-full w-full object-contain" /></span><div className="min-w-0"><p className="truncate font-display text-lg font-bold">Simatrix Academy</p><p className="text-[10px] font-bold uppercase tracking-[.2em] text-accent-300">Admin workspace</p></div></Link>
        <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"><i className="ti ti-x text-lg" /></button>
      </div>

      <div className="relative px-4 pb-2 pt-5"><p className="px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Management</p></div>
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {LINKS.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `group flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${isActive ? "bg-white text-brand-950 shadow-lg shadow-black/20" : "text-slate-400 hover:bg-white/[.07] hover:text-white"}`}>
          {({ isActive }) => <><span className={`grid h-8 w-8 place-items-center rounded-lg text-lg transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-500 group-hover:text-accent-300"}`}><i className={`ti ${item.icon}`} /></span><span className="flex-1">{item.label}</span>{item.to === "/admin/enquiries" && <EnquiryNavBadge />}</>}
        </NavLink>)}
      </nav>

      <div className="relative border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[.06] p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent-300 to-accent-500 text-sm font-extrabold text-brand-950">{admin.name?.charAt(0)?.toUpperCase() || "A"}</span><div className="min-w-0"><p className="truncate text-sm font-bold text-white">{admin.name || "Administrator"}</p><p className="truncate text-[11px] text-slate-400">{admin.email || "Admin account"}</p></div></div>
        <button type="button" onClick={doLogout} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-400/20 text-sm font-bold text-rose-300 transition hover:bg-rose-400/10"><i className="ti ti-logout" /> Sign out</button>
      </div>
    </aside>

    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      <header className="z-30 flex h-20 shrink-0 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 shadow-sm lg:hidden"><i className="ti ti-menu-2" /></button>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400"><span>Admin</span><i className="ti ti-chevron-right text-[9px]" /><span className="truncate text-slate-500">{page.label}</span></div><h1 className="mt-1 truncate font-display text-2xl font-bold text-slate-950">{page.label}</h1></div>
        <a href="/" target="_blank" rel="noreferrer" className="hidden min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700 sm:inline-flex"><i className="ti ti-external-link" /> View website</a>
        <NotificationBell />
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 md:flex"><span className="grid h-10 w-10 place-items-center rounded-full bg-brand-800 text-sm font-bold text-white">{admin.name?.charAt(0)?.toUpperCase() || "A"}</span><div className="max-w-32"><p className="truncate text-sm font-bold text-slate-800">{admin.name || "Admin"}</p><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</p></div></div>
      </header>

      <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
        <div className={pathname === "/admin" ? "" : "admin-content mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8"}><Outlet /></div>
      </main>
    </div>
  </div>;
}

function EnquiryNavBadge() {
  const { newCount } = useAdminNotifications();
  if (!newCount) return null;
  return <span className="grid min-w-6 place-items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">{newCount > 99 ? "99+" : newCount}</span>;
}
