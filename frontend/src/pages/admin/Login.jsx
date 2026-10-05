import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) return toast.error("Enter your email and password.");
    setLoading(true);
    try { await login(email.trim().toLowerCase(), password); toast.success("Welcome back!"); navigate("/admin"); }
    catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  return (
    <main className="grid min-h-screen bg-[#f5f7fb] lg:grid-cols-[minmax(0,1fr)_minmax(480px,.72fr)]">
      <section className="relative hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-dotgrid absolute inset-0 opacity-25" />
        <div className="absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full bg-accent-500/15 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-3">
          <span className="grid h-12 w-14 place-items-center rounded-xl bg-white p-1.5">
            <img src="/simatrix_logo_only.svg" alt="" className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="font-display text-xl font-bold">Simatrix Academy</p>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-accent-300">Administration</p>
          </div>
        </Link>
        <div className="relative max-w-2xl">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/10 text-2xl text-accent-300">
            <i className="ti ti-shield-lock" />
          </span>
          <h1 className="mt-7 font-display text-5xl font-semibold leading-tight">
            Manage your academy from one focused workspace.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-brand-100">
            Maintain courses, review student enquiries, edit live student reviews, and keep the public website current.
          </p>
          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["ti-inbox", "Enquiries"],
              ["ti-message-star", "Live Reviews"],
              ["ti-book-2", "Courses"],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[.06] p-4">
                <i className={`ti ${icon} text-xl text-accent-300`} />
                <p className="mt-3 text-xs font-bold text-brand-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-slate-500">Secure access for authorised Simatrix Academy staff.</p>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-12 place-items-center rounded-xl bg-white p-1 shadow-sm">
              <img src="/simatrix_logo_only.svg" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="font-display text-lg font-bold text-brand-950">Simatrix Academy</span>
          </Link>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-accent-700">Admin portal</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-slate-950">Welcome back</h2>
          <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-500">
            Sign in with your administrator account to manage courses and reviews.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Email address</span>
              <div className="relative">
                <i className="ti ti-mail absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  required
                  placeholder="admin@simatrixacademy.com"
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Password</span>
              <div className="relative">
                <i className="ti ti-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-xs sm:text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} />
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-5 text-sm font-bold text-white shadow-lg shadow-brand-950/20 transition hover:-translate-y-0.5 hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in securely <i className="ti ti-arrow-right" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-xs text-slate-500">
            <span>
              <i className="ti ti-lock-check mr-1" />
              Protected admin access
            </span>
            <Link to="/" className="font-bold text-brand-700 hover:text-accent-700">
              Back to website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
