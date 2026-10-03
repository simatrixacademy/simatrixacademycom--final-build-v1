import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, mediaUrl } from "../api/client";
import { Section, Reveal } from "../components/ui";
import { courseLogo, courseIcon } from "../lib/courseLogo";
import { useSeo } from "../lib/useSeo";
import EnquiryForm from "../components/EnquiryForm";
import CourseQuiz from "../components/CourseQuiz";
import CourseCard from "../components/CourseCard";

const sections = [
  ["overview", "Overview"],
  ["curriculum", "Curriculum"],
  ["roadmap", "Roadmap"],
  ["careers", "Careers"],
  ["faqs", "FAQs"],
  ["locations", "Locations"],
  ["quiz", "Quiz"],
  ["enquire", "Enquire"],
];

function getCourseSeoConfig(course) {
  if (!course) return { title: "Software Courses in Virudhunagar | Simatrix Academy" };
  const s = (course.slug || "").toLowerCase();
  const t = (course.title || "").toLowerCase();

  let title = `${course.title} Training in Virudhunagar | Simatrix Academy`;
  let description = `${course.summary || ""} Learn ${course.title} in Virudhunagar with hands-on projects, industry mentors, and 100% placement support at Simatrix Academy.`;

  if (s.includes("python") || t.includes("python")) {
    title = "Python Course & Training in Virudhunagar | Simatrix Academy";
    description = "Best Python training institute in Virudhunagar. Master Python programming, Django, data structures, and practical projects with 100% placement support.";
  } else if (s.includes("java") || t.includes("java")) {
    title = "Java Training Institute in Virudhunagar | Java Course | Simatrix Academy";
    description = "Leading Java training institute in Virudhunagar. Learn Core Java, Spring Boot, Microservices, and REST APIs with placement assistance at Simatrix Academy.";
  } else if (s.includes("full-stack") || s.includes("mern") || t.includes("full stack")) {
    title = "Full Stack Development Course in Virudhunagar | Simatrix Academy";
    description = "Comprehensive full stack developer course in Virudhunagar. Master frontend, backend, databases, and deployment with job-oriented placement support.";
  } else if (s.includes("data-analytics") || s.includes("data-science") || t.includes("data analyst")) {
    title = "Data Analytics Course in Virudhunagar | Power BI & SQL | Simatrix Academy";
    description = "Premier Data Analytics training in Virudhunagar. Learn Power BI, SQL, Python for Data Analysis, and Excel with career-focused placement assistance.";
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${course.title} Training in Virudhunagar`,
    description: course.summary || course.description,
    educationalCredentialAwarded: "Course Completion Certificate & Verified Project Portfolio",
    provider: {
      "@type": "EducationalOrganization",
      name: "Simatrix Academy",
      url: "https://www.simatrixacademy.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1/2A, 1st Floor, AA Road, Near Head Post Office",
        addressLocality: "Virudhunagar",
        addressRegion: "Tamil Nadu",
        postalCode: "626001",
        addressCountry: "IN",
      },
    },
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Blended",
        courseWorkload: "PT60H",
        location: {
          "@type": "Place",
          name: "Simatrix Academy Virudhunagar Campus",
          address: {
            "@type": "PostalAddress",
            streetAddress: "1/2A, 1st Floor, AA Road, Near Head Post Office",
            addressLocality: "Virudhunagar",
            addressRegion: "Tamil Nadu",
            postalCode: "626001",
            addressCountry: "IN",
          },
        },
      },
      {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: "PT60H",
      },
    ],
  };

  return { title, description, canonical: `/courses/${course.slug}`, jsonLd };
}

const COURSE_FAQS = (title) => [
  {
    q: `What is the eligibility for the ${title} course in Virudhunagar?`,
    a: `Our ${title} program is open to college students, freshers, engineering/arts graduates (B.E, B.Tech, BCA, B.Sc CS/IT), and working professionals seeking to transition into software development. No prior advanced coding knowledge is required as we begin from fundamental principles.`,
  },
  {
    q: `Do you provide placement support for ${title} students?`,
    a: `Yes! Every student enrolled in ${title} at Simatrix Academy receives dedicated placement assistance. This includes technical mock interviews, resume optimization, portfolio review, soft skill enhancement, and interview calls with our hiring partner network across Tamil Nadu and Bangalore.`,
  },
  {
    q: `Can students from Sivakasi, Rajapalayam, or Srivilliputhur enroll in this ${title} course?`,
    a: `Absolutely! We offer flexible morning and evening classroom batches at our central Virudhunagar campus (easily reachable by bus/train), as well as interactive live online batches so you can attend without daily travel.`,
  },
  {
    q: `Will I work on real-world projects during the ${title} training?`,
    a: `Yes. Practical learning is our core philosophy. You will build end-to-end applications, commit code to GitHub, and deploy live apps to showcase in technical interviews.`,
  },
];

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setCourse(null); setError(null);
    api.getCourse(slug).then((res) => setCourse(res.data)).catch((err) => setError(err.message));
  }, [slug]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!course) return;
    api.getCourses(course.category?.slug).then((res) => setRelated((res.data || []).filter((item) => item.slug !== course.slug).slice(0, 3))).catch(() => setRelated([]));
  }, [course]);

  useSeo(getCourseSeoConfig(course));

  /* Dynamic FAQPage Schema for Course */
  useEffect(() => {
    if (!course) return;
    const faqs = COURSE_FAQS(course.title);
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "course-faq");
    script.text = JSON.stringify(faqLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, [course]);

  if (error) return <CourseError message={error} onRetry={load} />;
  if (!course) return <CourseSkeleton />;

  const logo = courseLogo(course);
  const outcomes = (course.syllabus || []).slice(0, 4);

  return <>
    <section className="relative overflow-hidden bg-brand-950 py-16 text-white sm:py-20">
      <div className="bg-dotgrid absolute inset-0 opacity-40" /><div className="aurora pointer-events-none absolute inset-0 opacity-50" />
      <Section className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-brand-200"><Link to="/courses" className="hover:text-white">Courses</Link>{course.category && <><i className="ti ti-chevron-right text-xs" /><Link to={`/courses?category=${course.category.slug}`} className="hover:text-white">{course.category.name}</Link></>}</nav>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.22em] text-accent-300">Practical learning program</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{course.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-brand-100 sm:text-lg">{course.summary}</p>
          <div className="mt-7 flex flex-wrap gap-3"><Badge icon="ti-clock" text={course.duration} /><Badge icon="ti-stairs" text={course.level} /><Badge icon="ti-map-pin" text="Virudhunagar" /></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#enquire" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-400 px-6 font-bold text-brand-950 transition hover:-translate-y-0.5 hover:bg-accent-300">Enquire now <i className="ti ti-arrow-right" /></a>
            <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 font-bold text-white transition hover:bg-white/15"><i className="ti ti-download" /> Save course details</button>
            <a href="tel:+919363793954" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 font-bold text-white transition hover:bg-white/10"><i className="ti ti-phone" /> Talk to a counsellor</a>
          </div>
        </div>
        <div className="mx-auto grid h-44 w-44 place-items-center rounded-[2rem] border border-white/15 bg-white p-8 shadow-2xl shadow-black/30 lg:h-52 lg:w-52">
          {logo && <img src={logo.src} alt={`${logo.label} logo`} className="h-full w-full object-contain" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling?.classList.remove("hidden"); }} />}
          <i className={`${courseIcon(course)} text-6xl text-brand-600 ${logo ? "hidden" : ""}`} />
        </div>
      </Section>
    </section>

    <nav aria-label="Course sections" className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <Section className="-mx-1 flex overflow-x-auto px-1">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="shrink-0 border-b-2 border-transparent px-4 py-4 text-sm font-semibold text-slate-600 transition hover:border-accent-400 hover:text-brand-800">{label}</a>)}</Section>
    </nav>

    <Section className="py-14 sm:py-16">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
        <main className="min-w-0 space-y-14">
          <section id="overview" className="scroll-mt-36">
            {course.image ? <div className="group relative mb-8 aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100 shadow-lg"><img src={mediaUrl(course.image)} alt={course.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" /><span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{course.category?.name || "Technology program"}</span></div>
            : <div className="mb-8 grid aspect-[16/7] place-items-center rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-slate-100 text-6xl text-brand-600"><i className={courseIcon(course)} /></div>}
            <SectionTitle eyebrow="Course overview" title="About this course" />
            <p className="mt-5 text-base leading-8 text-slate-600">{course.description}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Fact icon="ti-clock" label="Duration" value={course.duration || "Ask our team"} /><Fact icon="ti-chart-bar" label="Level" value={course.level || "Open to learners"} /><Fact icon="ti-category" label="Domain" value={course.category?.name || "Technology"} /><Fact icon="ti-map-pin" label="Campus" value="Virudhunagar" /></div>
          </section>

          {outcomes.length > 0 && <section><SectionTitle eyebrow="Practical outcomes" title="Skills you will develop" /><div className="mt-6 grid gap-4 sm:grid-cols-2">{outcomes.map((item, index) => <Reveal key={`${item}-${index}`} delay={(index % 2) * 70} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><i className="ti ti-check" /></span><p className="text-sm leading-6 text-slate-700">Build practical understanding of {item}</p></Reveal>)}</div></section>}

          {course.syllabus?.length > 0 && <section id="curriculum" className="scroll-mt-36"><SectionTitle eyebrow="Course curriculum" title="What you’ll learn" subtitle={`${course.syllabus.length} structured learning modules`} /><div className="mt-6 space-y-3">{course.syllabus.map((module, index) => <CurriculumItem key={`${module}-${index}`} module={module} index={index} />)}</div></section>}

          {course.roadmap?.length > 0 && <section id="roadmap" className="scroll-mt-36"><SectionTitle eyebrow="Learning journey" title="Your course roadmap" /><ol className="relative mt-7 space-y-0 before:absolute before:bottom-6 before:left-[1.15rem] before:top-6 before:w-px before:bg-brand-200">{course.roadmap.map((step, index) => <Reveal as="li" key={`${step}-${index}`} delay={(index % 5) * 60} className="relative flex gap-4 pb-6 last:pb-0"><span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white shadow-md">{index + 1}</span><div className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><p className="text-sm font-medium leading-6 text-slate-700">{step}</p></div></Reveal>)}</ol></section>}

          {course.designations?.length > 0 && <section id="careers" className="scroll-mt-36"><SectionTitle eyebrow="Career pathways" title="Roles you can explore" subtitle="These are potential career directions, not placement or employment guarantees." /><ul className="mt-6 grid gap-4 sm:grid-cols-2">{course.designations.map((designation, index) => <Reveal as="li" key={`${designation}-${index}`} delay={(index % 2) * 70} className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-brand-700 shadow-sm"><i className="ti ti-briefcase" /></span><div><p className="text-sm font-bold text-slate-900">{designation}</p><p className="mt-1 text-xs text-slate-500">A role aligned with skills from this program</p></div></Reveal>)}</ul></section>}

          {/* Course FAQs Section */}
          <section id="faqs" className="scroll-mt-36">
            <SectionTitle
              eyebrow="Frequently asked questions"
              title={`${course.title} Training FAQ`}
              subtitle={`Everything you need to know about learning ${course.title} in Virudhunagar.`}
            />
            <div className="mt-6 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {COURSE_FAQS(course.title).map((faq, idx) => (
                <div key={idx} className={`py-4 ${idx === 0 ? "pt-0" : ""} ${idx === 3 ? "pb-0" : ""}`}>
                  <h3 className="font-display text-base font-bold text-slate-900">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Regional Training Locations Strip */}
          <section id="locations" className="scroll-mt-36 rounded-3xl border border-brand-200 bg-brand-50/40 p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-700">Regional Learning Options</span>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {course.title} Training Across Southern Tamil Nadu
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Attend classroom training at our Virudhunagar campus or interactive live online batches from your hometown with 100% placement support.
                </p>
              </div>
              <Link to="/branches" className="shrink-0 text-xs font-bold text-brand-700 hover:text-brand-900">
                View All Branches &rarr;
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                ["Virudhunagar (Campus)", "/software-training-in-virudhunagar"],
                ["Sivakasi (25 km)", "/software-training-in-sivakasi"],
                ["Rajapalayam (40 km)", "/software-training-in-rajapalayam"],
                ["Srivilliputhur (35 km)", "/software-training-in-srivilliputhur"],
                ["Aruppukottai (18 km)", "/software-training-in-aruppukottai"],
                ["Sattur (24 km)", "/software-training-in-sattur"],
              ].map(([name, url]) => (
                <Link
                  key={url}
                  to={url}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 shadow-sm"
                >
                  <i className="ti ti-map-pin text-brand-600 text-sm" />
                  {name}
                </Link>
              ))}
            </div>
          </section>

          <section id="quiz" className="scroll-mt-36"><CourseQuiz key={course.slug} courseTitle={course.title} questions={course.quiz} /></section>
        </main>

        <aside id="enquire" className="scroll-mt-36 lg:sticky lg:top-36">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
            <div className="bg-brand-950 p-6 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent-300">Virudhunagar campus</p><h2 className="mt-2 font-display text-2xl font-semibold">Enquire about this course</h2><p className="mt-2 text-sm leading-6 text-brand-100">Request the latest fees, complete syllabus and available batch timings.</p><div className="mt-4 flex gap-4 text-xs text-brand-100"><span><i className="ti ti-clock mr-1 text-accent-300" />Business-hours response</span><span><i className="ti ti-lock mr-1 text-accent-300" />Details kept private</span></div></div>
            <div className="p-6"><EnquiryForm courses={[course]} compact /><div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5"><a href="tel:+919363793954" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-brand-300"><i className="ti ti-phone" /> Call</a><a href="https://wa.me/919363793954" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700"><i className="ti ti-brand-whatsapp" /> WhatsApp</a></div></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">{[["ti-tools", "Practical learning"], ["ti-users", "Mentor support"], ["ti-briefcase", "Career preparation"], ["ti-message-star", "Student perspectives"]].map(([icon, text]) => <div key={text} className="rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-600"><i className={`ti ${icon} mr-1.5 text-accent-600`} />{text}</div>)}</div>
        </aside>
      </div>

      {related.length > 0 && <section className="mt-20 border-t border-slate-200 pt-14"><div className="flex items-end justify-between gap-4"><SectionTitle eyebrow="Keep exploring" title="Related courses" /><Link to={`/courses${course.category?.slug ? `?category=${course.category.slug}` : ""}`} className="hidden text-sm font-bold text-brand-700 hover:text-accent-600 sm:inline-flex">View all <i className="ti ti-arrow-right ml-1" /></Link></div><div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item, index) => <Reveal key={item.id} delay={index * 70}><CourseCard course={item} /></Reveal>)}</div></section>}
    </Section>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_25px_-15px_rgba(15,23,42,.35)] backdrop-blur lg:hidden"><div className="mx-auto grid max-w-lg grid-cols-2 gap-3"><a href="tel:+919363793954" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 font-bold text-slate-800"><i className="ti ti-phone" /> Call</a><a href="#enquire" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-400 font-bold text-brand-950">Enquire now <i className="ti ti-arrow-up" /></a></div></div>
  </>;
}

function CurriculumItem({ module, index }) {
  const [open, setOpen] = useState(index === 0);
  return <div className={`overflow-hidden rounded-2xl border bg-white transition ${open ? "border-brand-300 shadow-md" : "border-slate-200"}`}><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center gap-4 p-5 text-left"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">{String(index + 1).padStart(2, "0")}</span><span className="flex-1 text-sm font-bold text-slate-900">{module}</span><i className={`ti ti-chevron-down text-slate-400 transition ${open ? "rotate-180" : ""}`} /></button>{open && <div className="border-t border-slate-100 px-5 py-4 pl-[5rem] text-sm leading-6 text-slate-600">This module develops practical understanding of {module}. Contact our team for the detailed topic breakdown.</div>}</div>;
}

function SectionTitle({ eyebrow, title, subtitle }) { return <div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent-700">{eyebrow}</p><h2 className="mt-2 font-display text-3xl font-semibold text-slate-950">{title}</h2>{subtitle && <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>}</div>; }
function Badge({ icon, text }) { return text ? <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"><i className={`ti ${icon} text-accent-300`} />{text}</span> : null; }
function Fact({ icon, label, value }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4"><i className={`ti ${icon} text-xl text-accent-600`} /><p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div>; }

function CourseSkeleton() { return <div className="animate-pulse"><div className="bg-brand-950 py-24"><Section><div className="h-4 w-36 rounded bg-white/10" /><div className="mt-6 h-12 max-w-2xl rounded bg-white/10" /><div className="mt-5 h-5 max-w-xl rounded bg-white/10" /></Section></div><Section className="grid gap-10 py-16 lg:grid-cols-3"><div className="space-y-5 lg:col-span-2"><div className="aspect-[16/7] rounded-3xl bg-slate-200" /><div className="h-8 w-64 rounded bg-slate-200" /><div className="h-24 rounded bg-slate-100" /></div><div className="h-96 rounded-3xl bg-slate-200" /></Section></div>; }
function CourseError({ message, onRetry }) { return <Section className="grid min-h-[60vh] place-items-center py-24 text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-3xl text-rose-500"><i className="ti ti-alert-circle" /></span><h1 className="mt-5 font-display text-3xl font-semibold text-slate-950">We couldn’t load this course</h1><p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{message}</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={onRetry} className="rounded-xl bg-brand-800 px-5 py-3 text-sm font-bold text-white">Try again</button><Link to="/courses" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">Browse courses</Link><Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">Contact support</Link></div></div></Section>; }
