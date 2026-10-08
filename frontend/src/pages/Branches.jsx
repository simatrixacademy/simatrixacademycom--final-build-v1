import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { Section, Spinner, Reveal } from "../components/ui";
import MapEmbed from "../components/MapEmbed";
import { useSeo } from "../lib/useSeo";

/* ═══════════════════════════════════════════════════════════════
   REGIONAL SERVICE HUBS — Distributes PageRank and guides
   students from surrounding towns to the central Virudhunagar campus
   or live online training.
   ═══════════════════════════════════════════════════════════════ */
const REGIONAL_HUBS = [
  {
    name: "Virudhunagar",
    slug: "virudhunagar",
    type: "Main Campus & Corporate Office",
    badge: "Head Office",
    distance: "In Town (AA Road)",
    transit: "2 mins walk from Head Post Office; 5 mins from Old Bus Stand",
    headline: "Central software training campus with state-of-the-art labs and in-person mentor desks.",
    highlights: ["AC Computer Labs with Dedicated Workstations", "In-person Code Reviews & Mock Interview Rooms", "Direct MNC Placement Drives on Campus"],
    popularCourses: ["Python Full Stack", "Java Full Stack", "MERN Stack", "Data Analytics"],
  },
  {
    name: "Sivakasi",
    slug: "sivakasi",
    type: "Regional Student Service Area",
    badge: "25 km Away",
    distance: "25 km from Main Campus",
    transit: "Buses every 5-10 minutes from Sivakasi Bus Stand to Virudhunagar (~35 mins journey)",
    headline: "Comprehensive software training programs designed for Sivakasi graduates and college learners.",
    highlights: ["Daily Commuter-Friendly Morning & Evening Batches", "Weekend Batches for Working Professionals", "Interactive Live Online Option with Lab Access"],
    popularCourses: ["Python Course", "MERN Stack", "Data Analytics", "Cloud & DevOps"],
  },
  {
    name: "Rajapalayam",
    slug: "rajapalayam",
    type: "Regional Student Service Area",
    badge: "40 km Away",
    distance: "40 km from Main Campus",
    transit: "Frequent direct express buses & passenger trains to Virudhunagar Junction",
    headline: "Job-oriented IT courses with placement support for students and engineers across Rajapalayam.",
    highlights: ["Live Online Interactive Training with Mentor Debugging", "Weekend Classroom Bootcamps at Virudhunagar", "100% Placement Referral Network"],
    popularCourses: ["Java Full Stack", "Python Programming", "Full Stack Development", "AI & ML"],
  },
  {
    name: "Srivilliputhur",
    slug: "srivilliputhur",
    type: "Regional Student Service Area",
    badge: "35 km Away",
    distance: "35 km from Main Campus",
    transit: "Direct buses along Madurai-Tenkasi highway to Virudhunagar (~45 mins)",
    headline: "Advanced software engineering training bridging the gap for ambitious students from Srivilliputhur.",
    highlights: ["Industry-aligned curriculum replacing basic computer courses", "End-to-End Real-World GitHub Projects", "Resume Building & MNC Interview Prep"],
    popularCourses: ["Python Full Stack", "Java Training", "Data Analyst Course", "Power BI & SQL"],
  },
  {
    name: "Aruppukottai",
    slug: "aruppukottai",
    type: "Regional Student Service Area",
    badge: "18 km Away",
    distance: "18 km from Main Campus",
    transit: "Fast 20-minute bus commute via NH 38; buses depart every 15 minutes",
    headline: "Nearest premier software training institute for Aruppukottai students and college graduates.",
    highlights: ["Easy Daily Commute (Under 30 Minutes)", "High-Speed Internet & Modern Development Rigs", "Direct Placement Assistance & Job Referrals"],
    popularCourses: ["Full Stack Development", "Python Course", "Data Analytics", "UI/UX Design"],
  },
  {
    name: "Sattur",
    slug: "sattur",
    type: "Regional Student Service Area",
    badge: "24 km Away",
    distance: "24 km from Main Campus",
    transit: "Direct trains & NH 44 highway express buses (~25 mins to Virudhunagar)",
    headline: "Hands-on software and IT career preparation for freshers and degree holders in Sattur.",
    highlights: ["Fast Highway & Rail Connectivity", "Affordable Fee Structures with Flexible Installments", "Mock Interviews & Soft Skill Workshops"],
    popularCourses: ["Python Training", "Java Full Stack", "Web Development", "Data Analytics"],
  },
];

const BRANCH_FAQS = [
  {
    q: "Where is the Simatrix Academy campus located?",
    a: "Our main campus is at 1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001. We are conveniently situated in the heart of Virudhunagar, easily accessible from the bus terminal and railway station.",
  },
  {
    q: "Can students from Sivakasi, Srivilliputhur, or Rajapalayam attend classroom training in Virudhunagar?",
    a: "Yes! A significant portion of our classroom students travel daily from nearby towns like Sivakasi (35 mins), Aruppukottai (20 mins), Sattur (25 mins), and Srivilliputhur (45 mins). Batch timings are scheduled comfortably to match local bus and train transit times.",
  },
  {
    q: "Do you offer live online classes for students who cannot travel daily?",
    a: "Yes. Every course at Simatrix Academy is available in live online interactive format. You get the exact same curriculum, live mentor code reviews, project guidance, and 100% placement support from the comfort of your home.",
  },
  {
    q: "What facilities are available at the Virudhunagar campus?",
    a: "Our campus features high-speed air-conditioned computer labs, individual workstations, high-speed fiber internet, dedicated mock interview cabins, and a library area for peer project collaboration.",
  },
];

export default function Branches() {
  const [branches, setBranches] = useState(null);

  useSeo({
    title: "Our Branches & Regional Training Hubs | Software Training Institute | Simatrix Academy",
    description: "Explore Simatrix Academy branches and regional training centres serving Virudhunagar, Sivakasi, Rajapalayam, Srivilliputhur, Aruppukottai, and Sattur. Practical IT training with placement support.",
    canonical: "/branches",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Simatrix Academy — Regional Training Hubs",
      url: "https://www.simatrixacademy.com/branches",
      telephone: "+91-93637-93954",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1/2A, 1st Floor, AA Road, Near Head Post Office",
        addressLocality: "Virudhunagar",
        addressRegion: "Tamil Nadu",
        postalCode: "626001",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "City", name: "Virudhunagar" },
        { "@type": "City", name: "Sivakasi" },
        { "@type": "City", name: "Rajapalayam" },
        { "@type": "City", name: "Srivilliputhur" },
        { "@type": "City", name: "Aruppukottai" },
        { "@type": "City", name: "Sattur" },
      ],
    },
  });

  useEffect(() => {
    api.getBranches().then((res) => setBranches(res.data)).catch(() => setBranches([]));
  }, []);

  /* Injected FAQPage Schema */
  useEffect(() => {
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: BRANCH_FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "branches-faq");
    script.text = JSON.stringify(faqLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <>
      {/* ═══════════════ HERO BANNER ═══════════════ */}
      <section className="animated-gradient relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 py-20 text-white">
        <div className="bg-dotgrid absolute inset-0 opacity-50" />
        <div className="blob absolute -left-28 -top-36 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="blob absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-accent-500/12 blur-3xl" style={{ animationDelay: "-6s" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-300/45 to-transparent" />
        <Section className="relative">
          <div className="reveal flex items-center gap-3">
            <span className="h-px w-10 bg-accent-300/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-300">Regional Learning Network</span>
          </div>
          <h1 className="reveal mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ "--d": "80ms" }}>
            Our Campus & Regional Training Hubs
          </h1>
          <p className="reveal mt-4 max-w-3xl text-lg text-brand-100/85" style={{ "--d": "160ms" }}>
            Serving ambitious students and professionals across Virudhunagar district — including Sivakasi, Rajapalayam, Srivilliputhur, Aruppukottai, and Sattur — with hands-on software training and 100% placement support.
          </p>
        </Section>
      </section>

      {/* ═══════════════ MAIN CAMPUS SPOTLIGHT ═══════════════ */}
      <Section className="py-14 sm:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-600">Physical Training Headquarters</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">Virudhunagar Main Campus</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Our fully equipped training centre is designed for deep practical learning with individual high-performance workstations, expert instructors, and dedicated project mentors.
          </p>
        </div>

        {!branches ? (
          <div className="grid place-items-center py-16">
            <Spinner className="text-3xl" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            {/* Map Embed Container */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
              <div className="aspect-[16/10] w-full lg:aspect-auto lg:h-full">
                <MapEmbed
                  src={
                    branches[0]?.map_src ||
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.568285514681!2d77.95476317587784!3d9.582499690502946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b012b1849a62657%3A0x868b753aebfd8c4c!2sSimatrix%20Academy!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  }
                  title="Simatrix Academy Virudhunagar Campus"
                />
              </div>
            </div>

            {/* Campus Info Card */}
            <div className="flex flex-col justify-between rounded-3xl border border-brand-200 bg-brand-50/40 p-8 shadow-sm">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Admissions Open for Next Batch
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">Simatrix Academy Virudhunagar</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Campus & Career Cell</p>

                <ul className="mt-6 space-y-4 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm border border-brand-100">
                      <i className="ti ti-map-pin text-base" />
                    </span>
                    <div>
                      <strong className="block text-xs uppercase tracking-wide text-slate-500">Address</strong>
                      <span>1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm border border-brand-100">
                      <i className="ti ti-phone text-base" />
                    </span>
                    <div>
                      <strong className="block text-xs uppercase tracking-wide text-slate-500">Admissions Helpline</strong>
                      <a href="tel:+919363793954" className="font-semibold text-brand-700 hover:underline">
                        +91 93637 93954
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm border border-brand-100">
                      <i className="ti ti-clock text-base" />
                    </span>
                    <div>
                      <strong className="block text-xs uppercase tracking-wide text-slate-500">Operating Hours</strong>
                      <span>Monday – Saturday: 9:00 AM – 7:00 PM</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm border border-brand-100">
                      <i className="ti ti-device-laptop text-base" />
                    </span>
                    <div>
                      <strong className="block text-xs uppercase tracking-wide text-slate-500">Training Modes</strong>
                      <span>Full-Time Classroom, Fast-Track Weekend, and Live Interactive Online</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-brand-200/70">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Simatrix+Academy+Virudhunagar+AA+Road"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
                >
                  <i className="ti ti-map-2" /> Get Driving Directions
                </a>
                <Link
                  to="/appointment"
                  className="inline-flex items-center gap-2 rounded-xl border border-brand-300 bg-white px-5 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
                >
                  <i className="ti ti-calendar" /> Book Campus Visit
                </Link>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* ═══════════════ REGIONAL TRAINING HUBS GRID ═══════════════ */}
      <section className="bg-slate-50 py-16 sm:py-20 border-t border-slate-200/80">
        <Section>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent-700">Location Directory</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Software Training Across Virudhunagar District
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Students from across southern Tamil Nadu join Simatrix Academy for industry-standard IT courses. Select your location below to explore localized curriculum, batch timings, and commute options.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REGIONAL_HUBS.map((hub, i) => (
              <Reveal
                key={hub.slug}
                delay={(i % 3) * 80}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-600/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 border border-brand-100">
                      {hub.badge}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <i className="ti ti-navigation text-accent-600" /> {hub.distance}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold text-slate-900 group-hover:text-brand-700 transition">
                    Software Training in {hub.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{hub.type}</p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">{hub.headline}</p>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
                    <strong className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                      <i className="ti ti-bus text-brand-600" /> Commute & Transit
                    </strong>
                    {hub.transit}
                  </div>

                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular Courses</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {hub.popularCourses.map((c) => (
                        <span key={c} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <Link
                    to={`/software-training-in-${hub.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-brand-800 transition hover:bg-brand-600 hover:text-white"
                  >
                    View {hub.name} Details & Syllabi <i className="ti ti-arrow-right text-[11px]" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* ═══════════════ FREQUENTLY ASKED QUESTIONS ═══════════════ */}
      <Section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Clear Answers</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Frequently Asked Questions About Our Branches
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Have questions regarding campus location, travel from surrounding towns, or batch schedules? Here are the most common inquiries.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {BRANCH_FAQS.map((faq, idx) => (
            <div key={idx} className={`py-5 ${idx === 0 ? "pt-0" : ""} ${idx === BRANCH_FAQS.length - 1 ? "pb-0" : ""}`}>
              <h3 className="font-display text-base font-bold text-slate-900 flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                  {idx + 1}
                </span>
                {faq.q}
              </h3>
              <p className="mt-2.5 pl-9 text-sm leading-relaxed text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
