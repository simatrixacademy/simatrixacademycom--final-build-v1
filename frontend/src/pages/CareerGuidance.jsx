import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo";

const audiences = [
  {
    icon: "ti-school",
    label: "For school students",
    title: "Choose your next step with clarity.",
    description:
      "Understand how your interests, subjects and strengths can connect to future study and career options.",
    points: ["Subject and stream direction", "Education-path awareness", "Early skill exploration"],
  },
  {
    icon: "ti-building-community",
    label: "For college students",
    title: "Turn your degree into a practical direction.",
    description:
      "Explore suitable roles, identify skill gaps and build a realistic learning plan for entering the industry.",
    points: ["Role and domain discovery", "Skill-gap identification", "Career-readiness roadmap"],
  },
];

const guidanceAreas = [
  {
    icon: "ti-compass",
    title: "Self-discovery",
    text: "Reflect on your interests, strengths and the kind of problems you enjoy solving.",
  },
  {
    icon: "ti-route",
    title: "Career-path mapping",
    text: "Compare relevant education routes, technology domains and entry-level roles.",
  },
  {
    icon: "ti-chart-arrows",
    title: "Skill roadmap",
    text: "Prioritise what to learn now, what can wait and how to practise with purpose.",
  },
  {
    icon: "ti-message-circle-question",
    title: "Decision support",
    text: "Ask questions openly and leave with practical next steps—not generic motivation.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us where you are",
    text: "Share your education stage, interests and the decision you need help with.",
  },
  {
    number: "02",
    title: "Join a Saturday session",
    text: "Discuss your options with a mentor in a focused, student-friendly conversation.",
  },
  {
    number: "03",
    title: "Leave with a direction",
    text: "Receive a clearer set of priorities you can discuss, research and act on next.",
  },
];

const faqs = [
  {
    question: "Is the career-guidance session free?",
    answer:
      "Yes. Simatrix Academy conducts free career-guidance sessions on Saturdays, subject to available appointment slots.",
  },
  {
    question: "Who can attend the session?",
    answer:
      "The program is designed for school students, college students and freshers who need clarity about education, skills or early career options.",
  },
  {
    question: "Do I need a technical background?",
    answer:
      "No. The conversation begins with your present situation and goals. You do not need prior programming or technology experience.",
  },
  {
    question: "Does the session guarantee admission or employment?",
    answer:
      "No. Guidance helps you understand options and plan your next steps. Admissions and employment depend on individual eligibility, preparation and selection processes.",
  },
];

export default function CareerGuidance() {
  useSeo({
    title: "Job Oriented Courses in Virudhunagar | Career Guidance | Simatrix Academy",
    description:
      "Explore job oriented and career oriented courses in Virudhunagar. Book a free career-guidance session for students and freshers at Simatrix Academy — discover suitable learning paths with placement support.",
    canonical: "/career-guidance",
  });

  return (
    <main id="main-content" className="overflow-hidden bg-white text-[#0d1b32]">
      <section className="relative isolate bg-[#08172b] text-white">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-28 top-14 h-80 w-80 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-10 lg:py-24">
          <div>
            <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-slate-300">
              <Link to="/" className="transition hover:text-white">Home</Link>
              <i className="ti ti-chevron-right text-xs" aria-hidden="true" />
              <span className="text-amber-300">Career guidance</span>
            </nav>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
              <i className="ti ti-calendar-event" aria-hidden="true" />
              Free guidance sessions every Saturday
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Your future needs clarity, <span className="text-amber-300">not guesswork.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              A practical conversation for school and college students who want to understand their options, choose relevant skills and move forward with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/appointment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-[#0d1b32] transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-300/30"
              >
                Book a free session <i className="ti ti-arrow-right" aria-hidden="true" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
              >
                Explore courses
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {["School & college students", "Focused next steps", "No technical background required"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <i className="ti ti-circle-check-filled text-emerald-400" aria-hidden="true" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl" aria-label="Career guidance journey illustration">
            <div className="rounded-[2rem] border border-white/15 bg-white/[.07] p-5 shadow-2xl backdrop-blur sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Saturday guidance desk</p>
                  <p className="mt-2 text-xl font-bold">One conversation. Clearer options.</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-xl text-[#0d1b32]">
                  <i className="ti ti-bulb" aria-hidden="true" />
                </div>
              </div>
              <div className="my-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <i className="ti ti-school text-2xl text-sky-300" aria-hidden="true" />
                  <p className="mt-3 font-semibold">School path</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">Subjects → study options</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <i className="ti ti-briefcase-2 text-2xl text-emerald-300" aria-hidden="true" />
                  <p className="mt-3 font-semibold">College path</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">Skills → career roles</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#051121]/80 p-5">
                <p className="text-sm font-semibold text-slate-200">Your guidance roadmap</p>
                <div className="mt-5 flex items-center" aria-hidden="true">
                  {[
                    ["ti-user-search", "You"],
                    ["ti-compass", "Options"],
                    ["ti-route", "Plan"],
                  ].map(([icon, label], index) => (
                    <div key={label} className={`flex items-center ${index < 2 ? "flex-1" : ""}`}>
                      <div className="text-center">
                        <span className="grid h-11 w-11 place-items-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300">
                          <i className={`ti ${icon}`} />
                        </span>
                        <span className="mt-2 block text-xs text-slate-300">{label}</span>
                      </div>
                      {index < 2 && <span className="mx-2 mb-5 h-px flex-1 bg-gradient-to-r from-amber-300/50 to-sky-300/40" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-600">Guidance that meets you where you are</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Different stages need different conversations.</h2>
          <p className="mt-4 leading-7 text-slate-600">Select the journey closest to yours. The session is shaped around the decision in front of you.</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {audiences.map((audience, index) => (
            <article key={audience.label} className={`rounded-3xl border p-6 sm:p-8 ${index === 0 ? "border-sky-100 bg-sky-50/60" : "border-emerald-100 bg-emerald-50/60"}`}>
              <div className="flex items-center gap-4">
                <span className={`grid h-13 w-13 place-items-center rounded-2xl text-2xl ${index === 0 ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}`}>
                  <i className={`ti ${audience.icon}`} aria-hidden="true" />
                </span>
                <p className="text-sm font-bold uppercase tracking-[.16em] text-slate-600">{audience.label}</p>
              </div>
              <h3 className="mt-6 text-2xl font-bold">{audience.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{audience.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {audience.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm font-medium text-slate-700">
                    <i className="ti ti-check mt-0.5 text-emerald-600" aria-hidden="true" /> {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-600">What we work through</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Move from uncertainty to an actionable direction.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {guidanceAreas.map((area) => (
              <article key={area.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#0d1b32] text-xl text-amber-300">
                  <i className={`ti ${area.icon}`} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-600">Simple booking journey</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Clarity in three steps.</h2>
            <blockquote className="mt-7 rounded-3xl bg-[#0d1b32] p-7 text-white shadow-xl">
              <i className="ti ti-quote text-3xl text-amber-300" aria-hidden="true" />
              <p className="mt-4 text-xl font-semibold leading-8">“The right guidance does not choose your future for you. It helps you understand your options.”</p>
              <footer className="mt-5 text-sm text-slate-300">Simatrix Academy guidance principle</footer>
            </blockquote>
          </div>
          <ol className="space-y-5">
            {steps.map((step) => (
              <li key={step.number} className="grid gap-5 rounded-2xl border border-slate-200 p-6 sm:grid-cols-[auto_1fr] sm:p-7">
                <span className="text-3xl font-bold text-amber-500">{step.number}</span>
                <div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-amber-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-700">What you can take away</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A clearer plan for your next decision.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">The goal is not to overwhelm you with every possible career. It is to help you narrow the field and identify useful next actions.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {["Relevant paths to explore", "Skills to prioritise", "Questions to research", "Practical next steps"].map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white px-4 py-4 font-semibold shadow-sm">
                <i className="ti ti-circle-check-filled text-emerald-600" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-600">Before you book</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="mt-9 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-md">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {faq.question}
                <i className="ti ti-plus shrink-0 text-xl text-amber-600 transition group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-4 max-w-3xl border-t border-slate-100 pt-4 leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d1b32] px-6 py-12 text-center text-white sm:px-10 sm:py-14">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-amber-300">Your next step can be a conversation</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Book your free Saturday career-guidance session.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">Tell us what you are deciding, and our team will help you explore a more practical way forward.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/appointment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-[#0d1b32] transition hover:bg-amber-300">
              Reserve a Saturday slot <i className="ti ti-calendar-plus" aria-hidden="true" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10">
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
