import { Link } from "react-router-dom";
import { PageHero, Section, Reveal } from "../components/ui";
import { useSeo } from "../lib/useSeo";

export const REGIONAL_LOCATIONS = [
  {
    city: "Virudhunagar",
    slug: "virudhunagar",
    badge: "Main Campus",
    desc: "Head office on AA Road with state-of-the-art computer labs, high-speed fiber internet, and daily hands-on mentor desks.",
    courses: "Python, Java, MERN, Data Analytics",
    commute: "In-town central hub; 2 min walk from Head Post Office",
  },
  {
    city: "Sivakasi",
    slug: "sivakasi",
    badge: "25 km Away",
    desc: "35 mins direct bus ride. Popular among Sivakasi engineering and arts graduates seeking high-paying IT placements.",
    courses: "Full Stack, Python, Cloud, AI",
    commute: "Frequent direct buses every 10 mins from Sivakasi Stand",
  },
  {
    city: "Rajapalayam",
    slug: "rajapalayam",
    badge: "40 km Away",
    desc: "Direct train and express bus connectivity. Live interactive online batches and weekend classroom options available.",
    courses: "Java Full Stack, Data Analytics, Python",
    commute: "Direct express buses & passenger train connectivity",
  },
  {
    city: "Srivilliputhur",
    slug: "srivilliputhur",
    badge: "35 km Away",
    desc: "Industry-grade software training replacing basic computer centers. End-to-end GitHub projects and interview coaching.",
    courses: "Python Full Stack, Power BI & SQL, Web Dev",
    commute: "Direct buses along Madurai-Tenkasi highway (~40 mins)",
  },
  {
    city: "Aruppukottai",
    slug: "aruppukottai",
    badge: "18 km Away",
    desc: "Fast 20-minute bus commute via NH 38. Convenient morning and evening batches aligned with college schedules.",
    courses: "MERN Stack, Python, Data Analytics",
    commute: "Fast 20-min commute via NH 38; departures every 15 mins",
  },
  {
    city: "Sattur",
    slug: "sattur",
    badge: "24 km Away",
    desc: "25 mins via NH 44 highway. Career-focused curriculum with verified certificates and dedicated placement assistance.",
    courses: "Java, Python, Web Development",
    commute: "25 mins via NH 44 four-lane highway or direct rail",
  },
];

export default function SoftwareTraining() {
  useSeo({
    title: "Software Training Across Virudhunagar District | Simatrix Academy",
    description: "Simatrix Academy is the premier IT training destination for learners from all major towns in Virudhunagar district: Virudhunagar, Sivakasi, Rajapalayam, Srivilliputhur, Aruppukottai, and Sattur.",
    canonical: "/software-training",
  });

  return (
    <main id="main-content" className="bg-white">
      {/* Page Hero */}
      <PageHero
        eyebrow="Regional Coverage"
        title="Software Training Across Virudhunagar District"
        subtitle="Simatrix Academy is the premier IT training destination for learners from all major towns in the district. Choose your location to see dedicated batch timings, travel directions, and localized course roadmaps."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/branches"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-md transition hover:bg-amber-400"
          >
            <span>View All Branches & Travel Guidance</span>
            <i className="ti ti-arrow-right" />
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <span>Browse All Courses</span>
            <i className="ti ti-chevron-right" />
          </Link>
        </div>
      </PageHero>

      {/* Regional Training Locations Hub Section */}
      <section className="border-b border-slate-200/80 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-amber-700">
                <span className="h-px w-7 bg-amber-600" />
                Select Your Nearest City
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                Town-Wise Software Training Programs
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Whether you prefer in-person training at our central campus or flexible hybrid/online batches, our curriculum is tailored to launch high-paying IT careers.
              </p>
            </div>
            <Link
              to="/branches"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900"
            >
              <span>View All Branches & Travel Guidance</span>
              <i className="ti ti-arrow-right" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REGIONAL_LOCATIONS.map((loc, idx) => (
              <Reveal key={loc.slug} delay={idx * 60}>
                <Link
                  to={`/software-training-in-${loc.slug}`}
                  className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700 border border-brand-100">
                        {loc.badge}
                      </span>
                      <span className="text-xs font-semibold text-brand-600 transition group-hover:translate-x-1">
                        Explore <i className="ti ti-arrow-right ml-0.5" />
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold text-slate-900 group-hover:text-brand-700">
                      Software Training in {loc.city}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{loc.desc}</p>
                    {loc.commute && (
                      <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <i className="ti ti-bus text-amber-600" />
                        <span>{loc.commute}</span>
                      </p>
                    )}
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Top Tracks:</span> {loc.courses}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Simatrix Section */}
      <Section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">Why Simatrix Academy</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Southern Tamil Nadu's Premier IT Academy
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Engineered for students, job-seekers, and non-IT degree holders looking for authentic industry-grade software skills.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "ti-code",
              title: "100% Hands-On Labs",
              desc: "Build production-level applications on GitHub. No boring slides or rote theory.",
            },
            {
              icon: "ti-users",
              title: "Expert MNC Mentors",
              desc: "Learn directly from senior software engineers with active industry experience.",
            },
            {
              icon: "ti-briefcase",
              title: "Placement Assistance",
              desc: "Resume prep, mock interviews, and direct referral drives with top hiring partners.",
            },
            {
              icon: "ti-clock",
              title: "Flexible Batch Timings",
              desc: "Daily morning, evening, and weekend batches designed to accommodate bus & train schedules.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl text-brand-700 border border-brand-100">
                  <i className={`ti ${item.icon}`} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#071426] via-[#0d1b32] to-[#152642] p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold">Ready to Start Your Software Career?</h3>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Talk to our academic counselors today for personalized course recommendations, fee structures, and batch timings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-md transition hover:bg-amber-400"
            >
              <span>Contact Campus</span>
              <i className="ti ti-arrow-right" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <span>Explore Courses</span>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
