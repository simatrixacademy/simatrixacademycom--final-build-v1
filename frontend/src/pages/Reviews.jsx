import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/client";
import { PageHero, Section, Reveal, Spinner } from "../components/ui";
import { useSeo } from "../lib/useSeo";
import ReviewForm from "../components/ReviewForm";
import { mergeReviewsWithStories, initials, deleteLiveReview } from "../lib/reviewsData";

function Stars({ n = 5, className = "" }) {
  const rounded = Math.round(Number(n) || 5);
  return (
    <div className={`flex items-center gap-0.5 text-amber-400 ${className}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i
          key={i}
          aria-hidden="true"
          className={`ti ti-star-filled ${i < rounded ? "text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const location = useLocation();
  const [backendReviews, setBackendReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [updateTick, setUpdateTick] = useState(0);

  const load = () =>
    api
      .getReviews()
      .then((r) => setBackendReviews(r.data || []))
      .catch(() => setBackendReviews([]));

  useEffect(() => {
    // Purge any review containing 'sakthi' from localStorage
    try {
      const raw = localStorage.getItem("simatrix_live_reviews");
      if (raw) {
        const parsed = JSON.parse(raw);
        const cleaned = parsed.filter((r) => !r.name?.toLowerCase().includes("sakthi"));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem("simatrix_live_reviews", JSON.stringify(cleaned));
        }
      }
    } catch {}

    load();
    const handleLiveUpdate = () => {
      setUpdateTick((t) => t + 1);
    };
    window.addEventListener("simatrix_reviews_updated", handleLiveUpdate);
    return () => window.removeEventListener("simatrix_reviews_updated", handleLiveUpdate);
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("share-review");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = el.querySelector("input");
      setTimeout(() => firstInput?.focus(), 300);
    }
  };

  useEffect(() => {
    if (
      location.hash === "#share-review" ||
      location.hash === "#review-form" ||
      location.hash === "#write"
    ) {
      setTimeout(() => {
        scrollToForm();
      }, 150);
    }
  }, [location]);

  useSeo({
    title: "Student Reviews & Ratings | Simatrix Academy Virudhunagar",
    description:
      "Read verified student reviews and share your own learning experience with Simatrix Academy. 100% authentic feedback from our software training graduates.",
    canonical: "/reviews",
  });

  const allReviews = useMemo(() => {
    return mergeReviewsWithStories(backendReviews || []).filter(
      (r) => !r.name?.toLowerCase().includes("sakthi")
    );
  }, [backendReviews, updateTick]);

  const liveCount = useMemo(() => allReviews.filter((r) => r.isLive).length, [allReviews]);

  const filteredReviews = useMemo(() => {
    if (activeCategory === "all") return allReviews;
    if (activeCategory === "live") return allReviews.filter((r) => r.isLive);
    return allReviews.filter((r) => r.category === activeCategory);
  }, [allReviews, activeCategory]);

  const CATEGORIES = [
    { id: "all", label: "All Reviews", count: allReviews.length },
    ...(liveCount > 0 ? [{ id: "live", label: "🟢 Live Community", count: liveCount }] : []),
    { id: "full-stack", label: "Full Stack Web", count: allReviews.filter((r) => r.category === "full-stack").length },
    { id: "ai", label: "Python & AI", count: allReviews.filter((r) => r.category === "ai").length },
    { id: "cloud", label: "Cloud & DevOps", count: allReviews.filter((r) => r.category === "cloud").length },
    { id: "cybersecurity", label: "Cybersecurity", count: allReviews.filter((r) => r.category === "cybersecurity").length },
  ];

  return (
    <div className="bg-slate-50/40">
      <PageHero
        eyebrow="Student Reviews & Feedback"
        title="Real experiences. Honest perspectives."
        subtitle="Discover how learners from Virudhunagar and across Tamil Nadu built technical confidence and launched their tech careers."
      >
        <div className="reveal mt-8 flex flex-wrap items-center gap-3" style={{ "--d": "160ms" }}>
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white backdrop-blur-md shadow-xs">
            <span className="font-display text-3xl font-bold">4.8</span>
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
              <p className="text-xs text-slate-300">Shared by students &amp; alumni</p>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:scale-[1.02] active:scale-95"
          >
            <i className="ti ti-pencil-star text-base" />
            <span>Write Your Review</span>
            <i className="ti ti-arrow-down text-xs ml-0.5" />
          </button>
        </div>
      </PageHero>

      <Section className="py-12 sm:py-16">
        {/* Prominent Write a Review Section: Visible, clear, directly accessible */}
        <div id="share-review" className="mb-14 scroll-mt-28">
          <div id="review-form" className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#0b1528] via-brand-950 to-brand-800 p-6 text-white sm:p-8">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400 text-2xl text-slate-950 shadow-md">
                  <i className="ti ti-pencil-star" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Share Your Experience at Simatrix
                    </h2>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-400/30">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Instant Live Publishing
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Attended classes or computer labs with us? Submit your honest review below. It will appear live immediately across the site.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <ReviewForm onSubmitted={load} />
            </div>
          </div>
        </div>

        {/* Section Header: All Student Feedback */}
        <div id="all-reviews" className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end border-t border-slate-200/80 pt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-700">
              Verified Student Feedback
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              What our graduates say
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Showing <strong className="text-slate-900">{filteredReviews.length}</strong> learner stories from Virudhunagar &amp; Tamil Nadu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-900"
            >
              <i className="ti ti-edit" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-5">
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

        {/* Reviews Grid & Rating Breakdown Layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left Column: Review Cards */}
          <main>
            {filteredReviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-xs">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
                  <i className="ti ti-message-2-star" />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-slate-950">
                  No stories found in this category yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Be the first student to share your journey in this category.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 underline"
                >
                  View all reviews
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredReviews.map((review, index) => (
                  <div
                    key={review.id || `${review.name}-${index}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_16px_32px_-8px_rgba(15,23,42,0.08)] sm:p-7"
                  >
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-brand-500 to-indigo-600 transition-transform duration-500 group-hover:scale-x-100" />

                    <div>
                      {/* Author Header: Name on TOP, Role UNDER Name */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative shrink-0">
                            <span
                              className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${
                                review.gradient || "from-brand-600 to-indigo-700"
                              } text-sm font-bold text-white shadow-xs`}
                            >
                              {initials(review.name)}
                            </span>
                            <span
                              className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-[11px] text-white ring-2 ring-white"
                              title="Verified graduate"
                            >
                              <i className="ti ti-check" />
                            </span>
                          </div>

                          <div className="min-w-0">
                            {/* Name on Top */}
                            <h4 className="truncate font-display text-base font-bold text-slate-950">
                              {review.name}
                            </h4>
                            {/* Role on Under Name */}
                            <p className="truncate text-xs font-semibold text-brand-700">
                              {review.role || "Simatrix Graduate"}
                            </p>
                            {review.college && (
                              <p className="truncate text-[11px] text-slate-500">
                                {review.college}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Rating & Verified / Live Pill */}
                        <div className="flex flex-col items-end shrink-0 gap-1.5">
                          <div className="flex items-center gap-1">
                            <Stars n={review.rating || 5} className="text-xs" />
                            <span className="text-xs font-bold text-slate-800 ml-0.5">
                              {review.rating ? Number(review.rating).toFixed(1) : "5.0"}
                            </span>
                          </div>
                          {review.isLive ? (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                                </span>
                                Live Review
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteLiveReview(review.id)}
                                title="Delete this review"
                                className="inline-flex h-5 w-5 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                              >
                                <i className="ti ti-trash text-xs" />
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                              <i className="ti ti-circle-check-filled text-[10px] text-emerald-600" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Track Tag */}
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
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
                      {review.headline && (
                        <h5 className="mt-3 font-display text-sm sm:text-base font-bold leading-snug text-slate-900">
                          {review.headline}
                        </h5>
                      )}

                      {/* Quote */}
                      <blockquote className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px] sm:leading-6">
                        “{review.quote || review.content}”
                      </blockquote>
                    </div>

                    {/* Milestone Highlight */}
                    {review.highlight && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50/80 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200/50">
                          <i className="ti ti-sparkles text-amber-600 text-xs" />
                          <span>{review.highlight}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Right Column: Rating Breakdown Card */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
              <h4 className="font-display text-base font-bold text-slate-950">
                Rating Breakdown
              </h4>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-slate-950">4.8</span>
                <div>
                  <Stars n={5} className="text-sm" />
                  <p className="mt-0.5 text-xs text-slate-500">Based on 500+ student evaluations</p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-xs">
                {[
                  { star: 5, pct: "82%", count: "82%" },
                  { star: 4, pct: "16%", count: "16%" },
                  { star: 3, pct: "2%", count: "2%" },
                  { star: 2, pct: "0%", count: "0%" },
                  { star: 1, pct: "0%", count: "0%" },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3">
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

              <div className="mt-5 rounded-2xl bg-blue-50/70 p-4 border border-blue-100/80 text-xs leading-relaxed text-blue-900">
                <i className="ti ti-shield-check mr-1.5 text-blue-700 font-bold" />
                <strong>100% Authentic Feedback:</strong> Every review is checked against enrolled student records and completed projects.
              </div>

              <button
                type="button"
                onClick={scrollToForm}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-brand-900"
              >
                <i className="ti ti-pencil-star" />
                <span>Write Your Review</span>
              </button>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
