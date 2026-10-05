import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../api/client";

/**
 * CareerAdvisorModal
 *
 * Clean, human-crafted career advisory modal strictly matching the Brototype reference.
 * - Triggers when the user scrolls down to / past the course section (~400px or when courses enter view)
 * - Solid crimson red button (#c52233)
 * - Clean input styling with country-code pill and red chevron dropdown
 * - Rendered via createPortal to document.body with fixed viewport centering
 */
export default function CareerAdvisorModal({
  isOpen: controlledIsOpen,
  onOpen,
  onClose,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const hasTriggeredRef = useRef(false);
  const hasDismissedRef = useRef(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    status: "",
  });

  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Sync internal state if controlled from outside
  useEffect(() => {
    if (isControlled) {
      setInternalIsOpen(controlledIsOpen);
    }
  }, [isControlled, controlledIsOpen]);

  // Clear stale session block so scroll testing always works in current session
  useEffect(() => {
    try {
      sessionStorage.removeItem("simatrix_career_popup_seen");
    } catch (_) {}
  }, []);

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const openModal = () => {
    if (hasDismissedRef.current) return;
    setInternalIsOpen(true);
    if (onOpen) onOpen();
  };

  const closeModal = () => {
    hasDismissedRef.current = true;
    setInternalIsOpen(false);
    if (onClose) onClose();
  };

  // Reliable scroll trigger: triggers when user scrolls down past the hero or into course slide show
  useEffect(() => {
    const handleScroll = () => {
      if (hasTriggeredRef.current || hasDismissedRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const target =
        document.getElementById("tie-ups") ||
        document.getElementById("popular-programs") ||
        document.getElementById("learning-paths");

      let shouldTrigger = false;

      if (target) {
        const rect = target.getBoundingClientRect();
        // Triggers as soon as the course section enters the viewport
        if (rect.top <= window.innerHeight * 0.85) {
          shouldTrigger = true;
        }
      }

      // Also trigger if user scrolls past hero (~400px down)
      if (scrollY >= 400) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        hasTriggeredRef.current = true;
        openModal();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run an initial check in case page is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and contact number.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const message = [
        "Lead Source: Career Advisory Modal",
        form.status ? `Background: ${form.status}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      await api.createEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        degree: form.status || "Career Advisory Lead",
        message,
        type: "lead-popup",
      });

      try {
        sessionStorage.setItem("simatrix_lead_submitted", "true");
      } catch (_) {}

      setSubmitted(true);
      setTimeout(() => {
        closeModal();
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      setError(err?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999999,
      }}
      className="flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-white p-7 sm:p-9 shadow-2xl transition-all duration-200 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close modal"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-xl text-emerald-600 mb-3 border border-emerald-200">
              <i className="ti ti-check" />
            </div>
            <h3 className="font-sans text-xl font-bold text-slate-900">Thank You!</h3>
            <p className="mt-1 text-sm text-slate-600">
              Our career advisor will call you shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header (Matching Brototype reference) */}
            <div className="pr-4">
              <h3 className="text-xl sm:text-[22px] font-medium text-slate-900 leading-snug">
                Talk to our career experts<br />
                to help you find a{" "}
                <strong className="font-bold text-slate-950">suitable<br className="hidden sm:inline" /> career path</strong>
              </h3>
            </div>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none transition"
                />
              </div>

              {/* Contact Number with flag pill */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-slate-800 transition">
                  <span className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-700 select-none">
                    <span>🇮🇳 +91</span>
                    <span className="text-[9px] text-slate-400">▾</span>
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* What represents you the best? */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  What represents you the best? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-slate-800 focus:outline-none transition appearance-none cursor-pointer pr-10"
                  >
                    <option value="" disabled>select</option>
                    <option value="Final Year College Student">Final Year College Student (BE / B.Tech / BCA / MCA)</option>
                    <option value="Recent Graduate / Fresher">Recent Graduate / Fresher Seeking IT Job</option>
                    <option value="Working Professional (Career Switch)">Working Professional (Switching to Tech)</option>
                    <option value="Non-IT / Arts / Diploma Background">Non-IT / Arts / Diploma Background</option>
                    <option value="Pre-Final Year / Seeking Internship">Pre-Final Year Student Seeking Internship</option>
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-red-600 text-[10px]">
                    ▼
                  </span>
                </div>
              </div>

              {/* Primary Solid Red CTA Button (Brototype style) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-[#c52233] hover:bg-[#a91828] py-3.5 text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Connecting..." : "TALK TO OUR CAREER EXPERT"}
                </button>
              </div>

              {/* Secondary Red Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-xs sm:text-sm font-semibold text-[#c52233] hover:underline cursor-pointer"
                >
                  I want to know more
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

