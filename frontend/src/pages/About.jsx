import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { Spinner } from "../components/ui";
import { useSeo } from "../lib/useSeo";
import academyMark from "../assets/simatrix_logo.svg";

const PRINCIPLES = [
  ["ti-tools", "Practice before polish", "Learners build and apply concepts instead of stopping at passive instruction."],
  ["ti-users-group", "Guidance that stays human", "Mentors help learners understand mistakes, improve their work and keep moving."],
  ["ti-route", "A visible next step", "Every stage connects to a practical milestoneâ€”from foundations to interviews."],
  ["ti-shield-check", "Honest career support", "We explain the preparation process clearly and avoid replacing proof with promises."],
];

const JOURNEY = [
  ["01", "Understand your goal", "Start with your interests, current skills and the role you want to work toward."],
  ["02", "Choose the right level", "Select a learning path that matches your background rather than following trends blindly."],
  ["03", "Learn through application", "Use exercises, labs and projects to transform concepts into demonstrable skills."],
  ["04", "Prepare your profile", "Connect your projects to your resume, technical conversations and interview preparation."],
];

const PROOF_LINKS = [
  ["ti-star", "Student reviews", "Read learner experiences", "/reviews"],
  ["ti-trophy", "Awards", "Explore recognition", "/awards"],
  ["ti-compass", "Career guidance", "Explore guidance support", "/career-guidance"],
  ["ti-photo", "Academy gallery", "See learning spaces", "/gallery"],
];

function Heading({ eyebrow, title, text, dark = false, left = false }) {
  return <div className={`${left ? "" : "mx-auto text-center"} max-w-2xl`}><p className={`text-[11px] font-bold uppercase tracking-[.2em] ${dark ? "text-amber-300" : "text-amber-700"}`}>{eyebrow}</p><h2 className={`mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>{text && <p className={`mt-3 text-sm leading-6 ${dark ? "text-slate-300" : "text-slate-600"}`}>{text}</p>}</div>;
}

export default function About() {
  const [site, setSite] = useState(null);

  useSeo({
    title: "About Simatrix Academy — IT Training Institute in Virudhunagar",
    description: "Simatrix Academy is a leading IT training institute in Virudhunagar helping students and freshers build practical technology skills through hands-on projects, expert mentors and placement assistance.",
    canonical: "/about",
  });

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.getSite()]).then(([siteResult]) => {
      if (!active) return;
      setSite(siteResult.status === "fulfilled" ? siteResult.value.data : {});
    });
    return () => { active = false; };
  }, []);

  const courses = useMemo(() => site?.categories?.flatMap((category) => category.courses || []) || [], [site]);
  const metrics = [
    [courses.length || "â€”", "Courses available", "Across foundational and advanced tracks"],
    [site?.categories?.length || "â€”", "Technology domains", "Paths for different career interests"],
    [site?.testimonials?.length || "â€”", "Learner stories", "Experiences shared by students"],
    [site?.features?.length || "â€”", "Support pillars", "From learning to career preparation"],
  ];

  return <main id="main-content" className="overflow-hidden bg-white">
    <section className="relative isolate overflow-hidden bg-[#0d1b32] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(202,138,4,.2),transparent_28%),radial-gradient(circle_at_10%_85%,rgba(30,143,224,.16),transparent_30%),linear-gradient(135deg,#0a1020,#172642)]" />
      <div className="mx-auto grid min-h-[360px] max-w-5xl items-center gap-6 px-5 py-7 lg:grid-cols-[1.08fr_.92fr] lg:py-8">
        <div><nav className="flex items-center gap-2 text-xs text-slate-400" aria-label="Breadcrumb"><Link to="/" className="hover:text-white">Home</Link><i className="ti ti-chevron-right text-xs" /><span className="text-slate-200">Academy overview</span></nav><p className="mt-4 text-[10px] font-bold uppercase tracking-[.22em] text-amber-300">About Simatrix Academy</p><h1 className="mt-3 max-w-3xl font-display text-2xl font-semibold leading-[1.1] sm:text-4xl lg:text-5xl">Practical technology education built around <span className="text-amber-300">your next step.</span></h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">We help students and freshers move from uncertainty to practical capability through structured courses, mentor guidance, projects and career preparation.</p><div className="mt-4 flex flex-col gap-2 sm:flex-row"><Link to="/courses" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300">Explore courses<i className="ti ti-arrow-right" /></Link><Link to="/career-guidance" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10">Get career guidance</Link></div></div>
        <div className="relative mx-auto grid aspect-square w-full max-w-[260px] place-items-center"><div className="absolute inset-0 rounded-full border border-white/10" /><div className="absolute inset-7 rounded-full border border-dashed border-amber-300/25 motion-safe:animate-[spin_24s_linear_infinite]" /><div className="absolute h-36 w-36 rounded-full bg-white/[.06] blur-xl" /><div className="relative grid h-28 w-28 place-items-center rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"><img src={academyMark} alt="Simatrix Academy symbol" className="h-full w-full object-contain" /></div>{[["ti-code","left-2 top-1/4"],["ti-briefcase","right-0 top-1/3"],["ti-users","bottom-5 left-1/4"]].map(([ic,pos]) => <span key={ic} className={`absolute ${pos} grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-[#162743] text-2xl text-amber-300 shadow-xl`}><i className={`ti ${ic}`} /></span>)}</div>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-4 max-w-5xl px-5" aria-label="Academy overview statistics"><div className="grid overflow-hidden rounded-xl border border-slate-200 bg-slate-200 shadow-lg sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([value,label,text]) => <div key={label} className="bg-white p-3"><strong className="font-display text-2xl font-semibold text-slate-950">{site === null ? <Spinner className="text-2xl" /> : value}</strong><p className="mt-1 text-sm font-bold text-slate-900">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>)}</div></section>

    <section className="mx-auto grid max-w-5xl gap-6 px-5 py-11 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><Heading left eyebrow="Why we exist" title="Closing the gap between knowing and doing" text="Academic knowledge is valuable, but many students still need practice, feedback and confidence before they can use it professionally." /><Link to="/about/mission" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-700">Read our mission and vision<i className="ti ti-arrow-right" /></Link></div><div className="grid gap-4 sm:grid-cols-2">{PRINCIPLES.map(([ic,title,text]) => <article key={title} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-brand-300 hover:bg-white hover:shadow-xl"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-xl text-brand-700 shadow-sm"><i className={`ti ${ic}`} /></span><h2 className="mt-3 font-display text-lg font-semibold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></section>

    <section className="bg-slate-50 py-11"><div className="mx-auto max-w-5xl px-5"><Heading eyebrow="How learning works" title="A journey with a clear purpose at every stage" text="The experience is designed to reduce confusion and make progress visible." /><ol className="relative mt-7 grid gap-3 lg:grid-cols-4">{JOURNEY.map(([number,title,text], index) => <li key={number} className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="font-display text-3xl font-semibold text-amber-600">{number}</span><h3 className="mt-3 text-base font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>{index < JOURNEY.length - 1 && <i className="ti ti-arrow-right absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-brand-700 lg:grid" />}</li>)}</ol></div></section>

    <section className="bg-[#0d1b32] py-11 text-white"><div className="mx-auto grid max-w-5xl gap-7 px-5 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><Heading left dark eyebrow="Trust through transparency" title="Donâ€™t take our word for itâ€”explore the evidence" text="Use real academy resources to evaluate our environment, learner experiences and institutional credibility." /><div className="grid gap-4 sm:grid-cols-2">{PROOF_LINKS.map(([ic,title,text,to]) => <Link key={title} to={to} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.05] p-4 transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[.09]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl text-amber-300"><i className={`ti ${ic}`} /></span><span className="flex-1"><strong className="block text-white">{title}</strong><span className="mt-1 block text-xs text-slate-400">{text}</span></span><i className="ti ti-arrow-up-right text-slate-500 transition group-hover:text-amber-300" /></Link>)}</div></div></section>

    <section className="bg-amber-50 py-10"><div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">Your next step</p><h2 className="mt-2 font-display text-3xl font-semibold text-slate-950 sm:text-4xl">Find a learning path that fits your goal.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Explore the academyâ€™s programs independently or speak with the team when you need help choosing.</p><div className="mt-5 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"><Link to="/courses" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand-800 px-7 py-3 font-bold text-white transition hover:bg-brand-700">Browse all courses<i className="ti ti-arrow-right" /></Link><Link to="/contact" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-7 py-3 font-bold text-slate-800 transition hover:border-brand-300">Talk to our team</Link></div></div></section>
  </main>;
}


