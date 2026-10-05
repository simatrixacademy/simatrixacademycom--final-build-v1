import { useState } from "react";
import { api } from "../api/client";
import { useToast, Button, Field, inputClass } from "./ui";
import { saveLiveReview } from "../lib/reviewsData";

const EMPTY = { name: "", role: "", rating: 5, content: "" };

const RATING_LABELS = {
  5: "5/5 — Excellent, highly recommended",
  4: "4/5 — Good, very helpful learning",
  3: "3/5 — Decent experience",
  2: "2/5 — Needs improvement",
  1: "1/5 — Unsatisfied",
};

export default function ReviewForm({ onSubmitted, onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("Please provide both your name and your review.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Immediately publish to live storage so it appears on the website instantly
      const liveItem = saveLiveReview({
        name: form.name.trim(),
        role: form.role.trim() || "Simatrix Student",
        rating: form.rating,
        content: form.content.trim(),
      });

      // 2. Persist to backend database asynchronously
      api.createReview({
        name: form.name.trim(),
        role: form.role.trim(),
        rating: form.rating,
        content: form.content.trim(),
      }).catch((err) => {
        console.warn("Backend review sync note:", err);
      });

      toast.success("Thank you! Your review is now live on our site.");
      setForm(EMPTY);
      onSubmitted?.(liveItem);
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const currentRating = hover || form.rating;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your Full Name" required>
          <input
            className={inputClass}
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Ramesh Kumar"
            maxLength={80}
            autoComplete="name"
            required
          />
        </Field>
        <Field label="Course / Target Role">
          <input
            className={inputClass}
            value={form.role}
            onChange={set("role")}
            placeholder="e.g. Python Full Stack Student"
            maxLength={100}
          />
        </Field>
      </div>

      <Field label="Your Star Rating" required>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={form.rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="rounded-lg p-1 text-2xl transition hover:scale-125 focus:outline-none"
              >
                <i
                  className={`ti ti-star-filled transition-colors ${
                    n <= currentRating ? "text-amber-400" : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-700">
            {RATING_LABELS[currentRating] || `${currentRating}/5`}
          </span>
        </div>
      </Field>

      <Field label="Your Experience / Feedback" required>
        <textarea
          className={inputClass}
          rows={4}
          maxLength={800}
          value={form.content}
          onChange={set("content")}
          placeholder="Share your thoughts on the trainers, computer lab facilities, doubt clearance, and course practicals..."
          required
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <i className="ti ti-shield-check text-emerald-600" />
          <span>Your review will appear publicly on the site right after submitting.</span>
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={submitting}
            className="w-full sm:w-auto min-w-[160px]"
          >
            {submitting ? "Publishing..." : "Publish Live Review"}
            {!submitting && <i className="ti ti-send ml-1" />}
          </Button>
        </div>
      </div>
    </form>
  );
}
