import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo";

const PREPARATION = [
  ["ti-file-cv", "Profile preparation", "Present your skills, projects and learning experience through a clear, professional resume."],
  ["ti-messages", "Mock interviews", "Practise technical and HR conversations, then use structured feedback to improve."],
  ["ti-brain", "Aptitude preparation", "Strengthen reasoning, problem-solving and assessment readiness through guided practice."],
  ["ti-presentation", "Professional communication", "Learn to introduce yourself, explain projects and communicate with confidence."],
];

const BRIDGE_STEPS = [
  ["01", "Build skills", "Complete practical learning and projects relevant to your chosen technology path."],
  ["02", "Prepare your profile", "Shape your resume, portfolio and professional introduction around demonstrable work."],
  ["03", "Practise selection rounds", "Prepare for aptitude, technical and HR conversations through realistic exercises."],
  ["04", "Access relevant opportunities", "Receive placement assistance and information about suitable hiring opportunities when available."],
];

const QUOTES = [
  "A strong career starts when knowledge becomes something you can demonstrate.",
  "Preparation does not guarantee an opportunity—but it helps you meet one with confidence.",
  "We act as a professional bridge between prepared students and IT companies.",
];

function Eyebrow({ children, dark = false }) {
  return <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] ${dark ? "text-amber-300" : "text-amber-700"}`}><span className={`h-px w-7 ${dark ? "bg-amber-300" : "bg-amber-600"}`} />{children}</p>;
}

export default function Placement() {
  useSeo({
    title: "100% Placement Training Institute in Virudhunagar | Simatrix Academy",
    description: "IT training with placement in Virudhunagar. Get resume building, mock interviews, aptitude practice and placement assistance at Simatrix Academy — the best placement training institute in Virudhunagar.",
    canonical: "/placement",
  });

  return <main id="main-content" className="overflow-hidden bg-white">
    <section className="relative isolate overflow-hidden bg-[#0d1b32] text-white"><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_25%,rgba(202,138,4,.18),transparent_28%),radial-gradient(circle_at_8%_90%,rgba(30,143,224,.15),transparent_30%),linear-gradient(135deg,#0a1020,#172642)]" /><div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr]"><div><nav className="flex items-center gap-2 text-sm text-slate-400" aria-label="Breadcrumb"><Link to="/" className="hover:text-white">Home</Link><i className="ti ti-chevron-right text-xs" /><span className="text-slate-200">Placement training</span></nav><div className="mt-10"><Eyebrow dark>Placement training & assistance</Eyebrow><h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">Prepare to meet IT opportunities <span className="text-amber-300">professionally.</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Build the profile, communication and interview confidence needed to approach relevant opportunities with clarity.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300">Ask about placement assistance<i className="ti ti-arrow-right" /></Link><Link to="/courses" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/[.05] px-6 py-3 font-bold transition hover:bg-white/10">Explore courses</Link></div></div></div><div className="relative"><div className="absolute -inset-8 rounded-full bg-amber-300/10 blur-3xl" /><figure className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.06] p-8 shadow-2xl backdrop-blur sm:p-10"><i className="ti ti-quote text-5xl text-amber-300" /><blockquote className="mt-6 font-display text-3xl font-semibold leading-snug text-white sm:text-4xl">“We are a professional bridge connecting prepared students with IT companies.”</blockquote><figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-slate-300"><span className="grid h-10 w-10 place-items-center rounded-full bg-amber-300/15 text-amber-300"><i className="ti ti-bridge" /></span>Simatrix placement-assistance approach</figcaption></figure></div></div></section>

    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28"><div className="mx-auto max-w-3xl text-center"><Eyebrow>What we help you prepare</Eyebrow><h2 className="mt-4 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">Preparation for the moments that matter</h2><p className="mt-4 leading-7 text-slate-600">Placement assistance works best when learners can clearly demonstrate their skills and communicate their value.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{PREPARATION.map(([icon,title,text], index) => <article key={title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl"><span aria-hidden="true" className="absolute right-4 top-2 font-display text-6xl font-semibold text-slate-100">0{index + 1}</span><span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700"><i className={`ti ${icon}`} /></span><h3 className="relative mt-6 font-display text-xl font-semibold text-slate-950">{title}</h3><p className="relative mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></section>

    <section className="bg-slate-50 py-20 sm:py-28"><div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.78fr_1.22fr]"><div className="lg:sticky lg:top-24 lg:self-start"><Eyebrow>The professional bridge</Eyebrow><h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">From learning to opportunity, one clear step at a time</h2><p className="mt-5 leading-7 text-slate-600">Our role is to help learners prepare well and connect with relevant opportunities when available. Selection decisions always remain with the hiring company.</p><Link to="/resume-building" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-700">Start with resume preparation<i className="ti ti-arrow-right" /></Link></div><ol className="space-y-4">{BRIDGE_STEPS.map(([number,title,text], index) => <li key={number} className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-lg"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-lg font-semibold ${index === BRIDGE_STEPS.length - 1 ? "bg-amber-400 text-slate-950" : "bg-brand-800 text-white"}`}>{number}</span><div><h3 className="text-lg font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div></li>)}</ol></div></section>

    <section className="bg-[#0d1b32] py-20 text-white sm:py-24"><div className="mx-auto max-w-7xl px-6"><div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">{QUOTES.map((quote,index) => <blockquote key={quote} className="relative bg-[#0d1b32] p-7 sm:p-9"><span className="font-display text-5xl text-amber-300/40">“</span><p className="mt-2 font-display text-2xl font-semibold leading-snug">{quote}</p><span className="mt-6 block text-xs font-bold uppercase tracking-[.18em] text-slate-500">0{index + 1} · Simatrix principle</span></blockquote>)}</div></div></section>

    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28"><div className="grid gap-8 rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><Eyebrow>Clear expectations</Eyebrow><h2 className="mt-4 font-display text-3xl font-semibold text-slate-950 sm:text-4xl">Placement assistance supports your preparation and access—not a guaranteed job outcome.</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">Hiring outcomes depend on learner skills, eligibility, interview performance, employer requirements and opportunity availability.</p></div><Link to="/appointment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 px-7 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-700">Speak with a counsellor<i className="ti ti-arrow-right" /></Link></div></section>
  </main>;
}
