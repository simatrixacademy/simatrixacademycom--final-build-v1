import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useToast } from "./ui";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  course_id: "",
  current_status: "",
  preferred_mode: "",
  message: "",
};

export default function EnquiryForm({ courses = [], compact = false, type = "contact" }) {
  const toast = useToast();
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    course_id: courses.length === 1 ? String(courses[0]?.id || "") : "",
  }));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courses.length === 1 && !form.course_id) {
      setForm((f) => ({ ...f, course_id: String(courses[0].id) }));
    }
  }, [courses, form.course_id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const details = [];
      if (form.current_status) details.push(`Status: ${form.current_status}`);
      if (form.preferred_mode) details.push(`Mode: ${form.preferred_mode}`);
      const enrichedMessage = [details.join(" | "), form.message].filter(Boolean).join("\n\n");

      const res = await api.createEnquiry({
        ...form,
        degree: form.current_status || undefined,
        college: form.preferred_mode ? `Mode: ${form.preferred_mode}` : undefined,
        course_id: form.course_id || null,
        message: enrichedMessage,
        type,
      });
      toast.success(res.message || "Enquiry submitted! A counsellor will contact you shortly.");
      setForm(EMPTY);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Full Name */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">
            Full Name <span className="text-rose-500">*</span>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
              <i className="ti ti-user" />
            </span>
            <input
              name="name"
              autoComplete="name"
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 shadow-2xs outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
              value={form.name}
              onChange={set("name")}
              placeholder="Your full name"
            />
          </div>
        </label>

        {/* Phone Number */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">
            Phone Number <span className="text-rose-500">*</span>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
              <i className="ti ti-phone" />
            </span>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 shadow-2xs outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
              value={form.phone}
              onChange={set("phone")}
              placeholder="Mobile number"
            />
          </div>
        </label>

        {/* Email Address */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
              <i className="ti ti-mail" />
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 shadow-2xs outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 sm:text-sm"
              value={form.email}
              onChange={set("email")}
              placeholder="you@email.com"
            />
          </div>
        </label>

        {/* Interested Track */}
        {courses.length > 1 ? (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Interested Track</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
                <i className="ti ti-folders" />
              </span>
              <select
                name="course_id"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs text-slate-900 shadow-2xs outline-none transition hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 sm:text-sm appearance-none"
                value={form.course_id}
                onChange={set("course_id")}
              >
                <option value="">Select a course (or Discuss All)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 text-xs">
                <i className="ti ti-chevron-down" />
              </span>
            </div>
          </label>
        ) : courses.length === 1 ? (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Course</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-700 sm:text-sm"
              value={courses[0].title}
              readOnly
            />
          </label>
        ) : null}

        {/* Current Status */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">Current Status</span>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
              <i className="ti ti-school" />
            </span>
            <select
              name="current_status"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs text-slate-900 shadow-2xs outline-none transition hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 sm:text-sm appearance-none"
              value={form.current_status}
              onChange={set("current_status")}
            >
              <option value="">Select your status</option>
              <option value="College Student (Pre-Final Year)">College Student (Pre-Final Year)</option>
              <option value="Final-Year Student">Final-Year Student</option>
              <option value="Recent Graduate (Fresher)">Recent Graduate (Fresher)</option>
              <option value="Working Professional">Working Professional</option>
              <option value="Career Switcher">Career Switcher (Non-IT to IT)</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 text-xs">
              <i className="ti ti-chevron-down" />
            </span>
          </div>
        </label>

        {/* Preferred Mode */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">Preferred Learning Mode</span>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
              <i className="ti ti-device-desktop" />
            </span>
            <select
              name="preferred_mode"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs text-slate-900 shadow-2xs outline-none transition hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 sm:text-sm appearance-none"
              value={form.preferred_mode}
              onChange={set("preferred_mode")}
            >
              <option value="">Select learning mode</option>
              <option value="Classroom Offline (Virudhunagar Labs)">Classroom Labs (Virudhunagar)</option>
              <option value="Live Interactive Online">Live Interactive Online</option>
              <option value="Flexible / Hybrid">Flexible / Discuss with Advisor</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 text-xs">
              <i className="ti ti-chevron-down" />
            </span>
          </div>
        </label>
      </div>

      {/* Message */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-700">
          Message or Questions <span className="text-slate-400 font-normal">(Optional)</span>
        </span>
        <textarea
          name="message"
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-2xs outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 sm:text-sm resize-none"
          rows={compact ? 2 : 3}
          value={form.message}
          onChange={set("message")}
          placeholder="Any specific goal, batch timing preference, or questions..."
        />
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-xs sm:text-sm transition-all duration-200 bg-[#0b1528] hover:bg-brand-900 hover:shadow-lg hover:shadow-brand-950/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <i className="ti ti-loader-2 animate-spin text-sm" />
            <span>Sending your request…</span>
          </>
        ) : (
          <>
            <span>
              {type === "internship"
                ? "Apply for Free Internship"
                : type === "guidance"
                ? "Get Free Career Guidance"
                : "Request Free Callback"}
            </span>
            <i className="ti ti-arrow-right text-xs" />
          </>
        )}
      </button>

      {/* WhatsApp Conversion Alternative */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-500 font-medium">Need instant answers about fees &amp; batch availability?</p>
        <a
          href="https://wa.me/919363793954?text=Hello%20Simatrix%20Academy%2C%20I%20would%20like%20to%20know%20more%20about%20your%20courses%20and%20admissions"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 py-2.5 px-4 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 hover:border-emerald-300 shadow-2xs"
        >
          <i className="ti ti-brand-whatsapp text-emerald-600 text-base" />
          <span>Chat Directly on WhatsApp (+91 93637 93954)</span>
        </a>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
        <i className="ti ti-shield-lock text-emerald-600 text-xs" />
        <span>100% Privacy Guaranteed · No spam · Direct advisor response</span>
      </div>
    </form>
  );
}
