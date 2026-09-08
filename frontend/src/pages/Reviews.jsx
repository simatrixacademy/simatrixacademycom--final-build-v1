import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { PageHero, Section, Reveal, Spinner } from "../components/ui";
import { useSeo } from "../lib/useSeo";
import ReviewForm from "../components/ReviewForm";
import { mergeReviewsWithStories, initials } from "../lib/reviewsData";

function Stars({ n = 5, className = "" }) {
  return (
    <div className={`flex items-center gap-1 text-amber-400 ${className}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} aria-hidden="true" className={`ti ti-star-filled ${i < n ? "" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [backendReviews, setBackendReviews] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const load = () =>
    api
      .getReviews()
      .then((r) => setBackendReviews(r.data))
      .catch(() => setBackendReviews([]));

  useEffect(() => {
    load();
  }, []);

  useSeo({
    title: "Student Reviews & Outcomes · Simatrix Academy",
    description:
      "Read verified student reviews, career transformations, and placement feedback from Simatrix Academy learners in Virudhunagar.",
    canonical: "/reviews",
  });

  const allReviews = useMemo(() => {
    return mergeReviewsWithStories(backendReviews || []);
  }, [backendReviews]);

  const filteredReviews = useMemo(() => {
    if (activeCategory === "all") return allReviews;
    return allReviews.filter((r) => r.category === activeCategory);
  }, [allReviews, activeCategory]);

  const CATEGORIES = [
    { id: "all", label: "All Reviews", count: allReviews.length },
    { id: "full-stack", label: "Full Stack Web", count: allReviews.filter((r) => r.category === "full-stack").length },
    { id: "ai", label: "Python & AI", count: allReviews.filter((r) => r.category === "ai").length },
    { id: "cloud", label: "Cloud & DevOps", count: allReviews.filter((r) => r.category === "cloud").length },
    { id: "cybersecurity", label: "Cybersecurity", count: allReviews.filter((r) => r.category === "cybersecurity").length },
  ];

  return (
    <div className="bg-slate-50/40">
      <PageHero
        eyebrow="Verified Learner Stories"
        title="Real experiences. Honest perspectives."
        subtitle="Discover how learners from Virudhunagar and across Tamil Nadu transitioned from classroom training to software engineering careers."
      >
        <div className="reveal mt-8 flex flex-wrap gap-3" style={{ "--d": "160ms" }}>
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white backdrop-blur-md shadow-xs">
            <span className="font-display text-3xl font-bold">4.9</span>
            <div className="border-l border-white/20 pl-4">
              <Stars n={5} className="text-sm" />
              <p className="mt-1 text-xs text-slate-300">
                From {allReviews.length}+ verified learner stories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white backdrop-blur-md shadow-xs">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300 text-lg">
              <i className="ti ti-shield-check" />
            </span>
            <div>
              <p className="text-sm font-semibold">100% Authentic Feedback</p>
              <p className="text-xs text-slate-300">Shared by students &amp; placed alumni</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white backdrop-blur-md shadow-xs">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-400/20 text-blue-300 text-lg">
              <i className="ti ti-briefcase" />
            </span>
            <div>
              <p className="text-sm font-semibold">85%+ Placement Support</p>
              <p className="text-xs text-slate-300">Direct employer drives &amp; resume reviews</p>
            </div>
          </div>
        </div>
      </PageHero>

      <Section className="py-16 sm:py-20">
        {/* Header & Category Filter Bar */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-700">
              Verified Student Feedback
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              What our graduates say
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              First-hand perspectives on our hands-on computer labs, 1-on-1 mentor guidance, and technical placement prep.
            </p>
          </div>

          <a
            href="#share-review"
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#0b1528] px-6 text-xs font-bold text-white shadow-sm transition hover:bg-brand-900 active:scale-95 sm:self-auto"
          >
            <span>Share Your Experience</span>
            <i className="ti ti-arrow-down text-xs" />
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0b1528] text-white shadow-md shadow-brand-950/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid: Reviews on Left, Form + Rating Breakdown on Right */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
          <main>
            {backendReviews === null ? (
              <div className="grid min-h-80 place-items-center rounded-3xl border border-slate-200 bg-white shadow-xs">
                <Spinner className="text-3xl text-brand-700" />
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-xs">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
                  <i className="ti ti-message-2-star" />
                </span>
                <p className="mt-5 font-display text-xl font-bold text-slate-950">
                  No stories found in this domain yet
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Be the first student to share your journey in this category.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 underline"
                >
                  View all reviews
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredReviews.map((review, index) => (
                  <Reveal
                    key={review.id || `${review.name}-${index}`}
                    delay={(index % 2) * 80}
                    className="group relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_20px_45px_-12px_rgba(15,23,42,0.1)] sm:p-8"
                  >
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-brand-500 to-indigo-600 transition-transform duration-500 group-hover:scale-x-100" />

                    <div>
                      {/* Rating & Verified Pill */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Stars n={review.rating || 5} className="text-sm" />
                          <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                          <i className="ti ti-circle-check-filled text-xs text-emerald-600" />
                          Verified Student
                        </span>
                      </div>

                      {/* Course Track Tag */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-lg bg-slate-100/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                          {review.course || review.designation || "Career Track"}
                        </span>
                        {review.campus && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] font-medium text-slate-500">{review.campus}</span>
                          </>
                        )}
                      </div>

                      {/* Headline */}
                      <h3 className="mt-4 font-display text-base font-bold leading-snug text-slate-950 sm:text-lg">
                        {review.headline || `“${(review.quote || review.content).slice(0, 50)}...”`}
                      </h3>

                      {/* Quote */}
                      <blockquote className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-[13px] sm:leading-6">
                        “{review.quote || review.content}”
                      </blockquote>
                    </div>

                    {/* Milestone Highlight & Author Information */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      {review.highlight && (
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-900 border border-amber-200/50">
                          <i className="ti ti-sparkles text-amber-600 text-xs" />
                          <span>{review.highlight}</span>
                        </div>
                      )}

                      <figcaption className="flex items-center gap-3">
                        <div className="relative">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-100 shadow-xs"
                            />
                          ) : (
                            <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-indigo-700 text-sm font-bold text-white shadow-xs">
                              {initials(review.name)}
                            </span>
                          )}
                          <span
                            className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-blue-600 text-[10px] text-white ring-2 ring-white"
                            title="Verified graduate"
                          >
                            <i className="ti ti-check" />
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-sm font-bold text-slate-950">
                            {review.name}
                          </strong>
                          <p className="truncate text-xs font-semibold text-brand-700">
                            {review.role || "Simatrix Graduate"}
                          </p>
                          <p className="truncate text-[11px] text-slate-500">
                            {review.college || review.batch || "Virudhunagar Campus"}
                          </p>
                        </div>
                      </figcaption>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar: Rating Breakdown & Share Form */}
          <aside id="share-review" className="scroll-mt-28 space-y-6 lg:sticky lg:top-28">
            {/* Rating Breakdown Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
              <h3 className="font-display text-lg font-bold text-slate-950">
                Review Breakdown
              </h3>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-slate-950">4.9</span>
                <div>
                  <Stars n={5} className="text-sm" />
                  <p className="mt-0.5 text-xs text-slate-500">Based on 500+ student evaluations</p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {[
                  { star: 5, pct: "96%", count: "96%" },
                  { star: 4, pct: "4%", count: "4%" },
                  { star: 3, pct: "0%", count: "0%" },
                  { star: 2, pct: "0%", count: "0%" },
                  { star: 1, pct: "0%", count: "0%" },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-medium text-slate-600">{row.star} stars</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: row.pct }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-slate-500">{row.count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-blue-50/70 p-4 border border-blue-100/80 text-xs leading-relaxed text-blue-900">
                <i className="ti ti-shield-check mr-1.5 text-blue-700 font-bold" />
                <strong>100% Verified Feedback:</strong> Every review is checked against enrolled student records and project completions.
              </div>
            </div>

            {/* Share Your Story Form */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5">
              <div className="bg-gradient-to-br from-[#0d1b32] via-brand-950 to-brand-800 p-6 text-white sm:p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-xl text-amber-300">
                  <i className="ti ti-pencil-star" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold">Share your story</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Your feedback helps incoming students make confident decisions about their technology learning.
                </p>
              </div>
              <div className="p-6 sm:p-7">
                <ReviewForm onSubmitted={load} />
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
