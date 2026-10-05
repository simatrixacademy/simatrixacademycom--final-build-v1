import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import CourseCard from "../components/CourseCard";
import { PageHero, Reveal, Section, Spinner } from "../components/ui";
import { icon } from "../lib/icons";
import { useSeo } from "../lib/useSeo";

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "";
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState(null);

  useEffect(() => { api.getSite().then((res) => setCategories(res.data.categories || [])).catch(() => setCategories([])); }, []);
  useEffect(() => { setCourses(null); api.getCourses(active).then((res) => setCourses(res.data)).catch(() => setCourses([])); }, [active]);

  const activeName = active && categories.find((category) => category.slug === active)?.name;
  const setCategory = (slug) => setParams(slug ? { category: slug } : {});
  useSeo({ title: `${activeName ? `${activeName} Courses in Virudhunagar` : "Software Courses in Virudhunagar"} | IT Training | Simatrix Academy`, description: "Explore job-oriented software courses in Virudhunagar — Python, Java, Full Stack, Data Analytics, Cloud & AI. Compare practical learning paths with placement support at Simatrix Academy.", canonical: active ? `/courses?category=${active}` : "/courses" });

  return (
    <main id="main-content">
      <PageHero eyebrow="Practical learning paths" title="Find the course that fits your next step." subtitle="Compare available technology programs by domain, then review the course details, prerequisites and learning outcomes before enquiring.">
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link to="/career-guidance" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-[#0d1b32] hover:bg-amber-300">
            Help me choose<i className="ti ti-compass" />
          </Link>
          <a href="#find-your-path" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">
            Browse programs<i className="ti ti-arrow-down" />
          </a>
        </div>
      </PageHero>

      {/* Find Your Path - Choose the skill you want to build */}
      <section id="find-your-path" className="scroll-mt-24 w-full bg-white py-14 sm:py-20 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">Find your path</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-slate-950">
              Choose the skill you want to build
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Start with a field that matches your goals. Each path takes you from essential concepts to practical application.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setCategory(category.slug);
                  document.getElementById("course-list")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                  active === category.slug
                    ? "border-brand-500 bg-brand-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-brand-300"
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl text-brand-700">
                  <i className={icon(category.icon)} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-slate-950 font-bold">{category.name}</strong>
                  <span className="mt-1 block text-sm text-slate-500">
                    {(category.courses || []).length || ""} courses
                  </span>
                </span>
                <i className="ti ti-chevron-right text-slate-400 transition group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Section id="course-list" className="scroll-mt-24 py-16 sm:py-20">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
          {[["ti-target-arrow","Choose by goal","Begin with the role or skill you want to explore."],["ti-adjustments","Check the level","Review prerequisites and expected effort."],["ti-message-circle","Still unsure?","Use free career guidance to compare paths."]].map(([ico,title,text]) => <div key={title} className="flex gap-3"><i className={`ti ${ico} mt-0.5 text-xl text-amber-700`} /><div><p className="text-sm font-bold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{text}</p></div></div>)}
        </div>

        <div className="mt-10"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-slate-500">Filter by technology domain</p><div aria-label="Filter courses by category" className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:flex-wrap sm:px-0"><FilterChip label="All courses" active={!active} onClick={() => setCategory("")} />{categories.map((category) => <FilterChip key={category.id} label={category.name} ico={category.icon} active={active === category.slug} onClick={() => setCategory(category.slug)} />)}</div></div>

        <div className="mt-10 flex items-end justify-between gap-5 border-b border-slate-200 pb-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">Available learning paths</p><h2 className="mt-2 font-display text-3xl font-semibold text-slate-950">{activeName || "All courses"}</h2></div>{courses && <span className="shrink-0 text-sm text-slate-500" aria-live="polite">{courses.length} {courses.length === 1 ? "course" : "courses"}</span>}</div>

        <div className="mt-8">{!courses ? <div className="grid place-items-center py-24"><Spinner className="text-3xl" /></div> : courses.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center"><i className="ti ti-search-off text-4xl text-slate-400" /><h3 className="mt-4 font-display text-xl font-semibold text-slate-900">No courses in this category yet</h3><p className="mt-2 text-sm text-slate-600">View all courses or ask a career guide about a suitable alternative.</p><button type="button" onClick={() => setCategory("")} className="mt-6 rounded-xl bg-[#0d1b32] px-5 py-3 text-sm font-bold text-white">View all courses</button></div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{courses.map((course, index) => <Reveal key={course.id} delay={(index % 4) * 70}><CourseCard course={course} /></Reveal>)}</div>}</div>
      </Section>
    </main>
  );
}

function FilterChip({ label, ico, active, onClick }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${active ? "bg-[#0d1b32] text-white shadow-md" : "border border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50"}`}>{ico && <i className={`${icon(ico)} text-sm ${active ? "text-amber-300" : "text-slate-400"}`} />}{label}</button>;
}
