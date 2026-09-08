import { useRef } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../lib/useSettings";

function getFogColor(ratio) {
  const clamped = Math.max(0, Math.min(1, ratio));
  let r, g, b;
  if (clamped <= 0.5) {
    const t = clamped / 0.5;
    // Cyan: 56, 189, 248 -> Electric Indigo: 99, 102, 241
    r = Math.round(56 + (99 - 56) * t);
    g = Math.round(189 + (102 - 189) * t);
    b = Math.round(248 + (241 - 248) * t);
  } else {
    const t = (clamped - 0.5) / 0.5;
    // Electric Indigo: 99, 102, 241 -> Rich Purple / Fuchsia: 192, 38, 211
    r = Math.round(99 + (192 - 99) * t);
    g = Math.round(102 + (38 - 102) * t);
    b = Math.round(241 + (211 - 241) * t);
  }
  return `${r}, ${g}, ${b}`;
}

export default function Footer() {
  const watermarkRef = useRef(null);
  const year = new Date().getFullYear();
  const s = useSettings();

  const handleMouseMove = (e) => {
    if (!watermarkRef.current) return;
    const rect = watermarkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ratio = rect.width ? x / rect.width : 0.5;
    const fogRgb = getFogColor(ratio);

    watermarkRef.current.style.setProperty("--mouse-x", `${x}px`);
    watermarkRef.current.style.setProperty("--mouse-y", `${y}px`);
    watermarkRef.current.style.setProperty("--fog-rgb", fogRgb);
    watermarkRef.current.style.setProperty("--mouse-active", "1");
  };

  const handleMouseEnter = () => {
    if (watermarkRef.current) {
      watermarkRef.current.style.setProperty("--mouse-active", "1");
    }
  };

  const handleMouseLeave = () => {
    if (watermarkRef.current) {
      watermarkRef.current.style.setProperty("--mouse-active", "0");
    }
  };

  const phone = "+91 93637 93954";
  const rawEmail = s.contact_email || "info@simatrixacademy.com";
  const email = rawEmail.includes("elysiumacademy") ? "info@simatrixacademy.com" : rawEmail;
  const address = "1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001";

  const explore = [
    ["About Academy", "/about"],
    ["Explore Courses", "/courses"],
    ["Placement Records", "/placement"],
    ["Student Reviews", "/reviews"],
    ["Campus Gallery", "/gallery"],
    ["Tech Blog", "/blog"],
    ["Contact & Support", "/contact"],
  ];

  const programs = [
    ["Full Stack Web Development", "/courses?category=full-stack"],
    ["Data Science & Machine Learning", "/courses?category=data-science"],
    ["Cloud Computing & DevOps", "/courses?category=cloud"],
    ["Cybersecurity & Ethical Hacking", "/courses?category=cybersecurity"],
    ["Python & AI Engineering", "/courses?category=programming"],
    ["Mobile App Development", "/courses?category=mobile-app"],
  ];

  const socials = [
    { icon: "ti-brand-linkedin", href: s.social_linkedin || "https://linkedin.com/company/simatrix-academy", label: "LinkedIn" },
    { icon: "ti-brand-instagram", href: s.social_instagram || "https://instagram.com/simatrixacademy", label: "Instagram" },
    { icon: "ti-brand-youtube", href: s.social_youtube || "https://youtube.com/@simatrixacademy", label: "YouTube" },
    { icon: "ti-brand-facebook", href: s.social_facebook || "https://facebook.com/simatrixacademy", label: "Facebook" },
    { icon: "ti-brand-whatsapp", href: "https://wa.me/919363793954", label: "WhatsApp" },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden bg-[#050811] text-slate-300">
      {/* Top Hairline Gradient Accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #38BDF8 25%, #6366F1 50%, #C026D3 75%, transparent)",
        }}
      />

      {/* Ambient Top Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full opacity-25 blur-[140px]"
        style={{
          background: "linear-gradient(90deg, rgba(56,189,248,0.3), rgba(99,102,241,0.25), rgba(192,38,211,0.25))",
        }}
      />

      <div className="relative mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10 pt-12 sm:pt-16">
        {/* ================================================================= */}
        {/* CORE DIRECTORY GRID                                               */}
        {/* ================================================================= */}
        <div className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/" className="inline-block" aria-label="Simatrix Academy Home">
              <img
                src="/lightMode-without-tagline.svg"
                alt="Simatrix Academy"
                className="h-10 w-auto object-contain transition-opacity hover:opacity-90"
              />
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              Empowering students and freshers through industry-grade software training, portfolio projects, and direct
              interview opportunities.
            </p>

            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Connect with us</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="group grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-200 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-sky-400 hover:shadow-lg hover:shadow-sky-500/10 active:translate-y-0"
                  >
                    <i className={`ti ${item.icon} text-base`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <FooterHeading>Explore</FooterHeading>
            <ul className="mt-5 space-y-2.5 text-sm">
              {explore.map(([label, to]) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Flagship Programs */}
          <div>
            <FooterHeading>Top Programs</FooterHeading>
            <ul className="mt-5 space-y-2.5 text-sm">
              {programs.map(([label, to]) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Campus */}
          <div>
            <FooterHeading>Campus & Contact</FooterHeading>
            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <ContactIcon icon="ti-phone" />
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Admissions Helpline</span>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold text-white transition hover:text-sky-400">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ContactIcon icon="ti-mail" />
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Official Inquiries</span>
                  <a href={`mailto:${email}`} className="font-semibold text-white transition hover:text-sky-400">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ContactIcon icon="ti-map-pin" />
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Campus Address</span>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* GRAND ARCHITECTURAL WATERMARK (Refined 50% scale)                */}
      {/* ================================================================= */}
      <div
        ref={watermarkRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full overflow-hidden border-t border-white/[0.06] pt-6 pb-2 select-none cursor-default"
        style={{
          "--mouse-x": "50%",
          "--mouse-y": "50%",
          "--fog-rgb": "99, 102, 241",
          "--mouse-active": "0",
        }}
      >
        {/* Soft persistent ambient backlighting beam */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-[50rem] -translate-x-1/2 rounded-full opacity-15 blur-[100px]"
          style={{
            background: "linear-gradient(90deg, #38BDF8, #6366F1, #C026D3)",
          }}
          aria-hidden="true"
        />

        {/* Subtle Ambient Fog Glow behind SIMATRIX (Smoothly follows cursor, shifts color across X-axis) */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            opacity: "var(--mouse-active, 0)",
            background:
              "radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--fog-rgb), 0.12) 0%, rgba(var(--fog-rgb), 0.03) 45%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex flex-col items-center justify-center text-center">
          <span
            className="simatrix-grand-watermark block font-sans font-black leading-none tracking-[-0.03em] text-transparent"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
            }}
          >
            SIMATRIX
          </span>

          <div className="-mt-1 sm:-mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
            <span className="h-px w-6 bg-slate-700" />
            <span>Excellence in Technology Education</span>
            <span className="h-px w-6 bg-slate-700" />
          </div>
        </div>

        {/* Bottom Legal / Copyright Row */}
        <div className="relative mx-auto mt-8 flex max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] flex-col items-center justify-between gap-4 border-t border-white/5 px-4 sm:px-6 lg:px-8 xl:px-10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {year} Simatrix Academy. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link to="/placement" className="transition hover:text-slate-300">
              Placement Cell
            </Link>
            <span className="h-3 w-px bg-white/10" aria-hidden="true" />
            <Link to="/reviews" className="transition hover:text-slate-300">
              Learner Stories
            </Link>
            <span className="h-3 w-px bg-white/10" aria-hidden="true" />
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-slate-400 transition hover:border-sky-400/40 hover:bg-white/5 hover:text-white"
            >
              <i className="ti ti-lock text-[11px] text-amber-400" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .simatrix-grand-watermark {
          background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.08) 55%,
            rgba(255, 255, 255, 0.01) 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          filter: drop-shadow(0 0 35px rgba(99, 102, 241, 0.15));
          animation: watermark-shimmer 8s ease-in-out infinite alternate;
        }

        @keyframes watermark-shimmer {
          0% {
            filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.1));
          }
          50% {
            filter: drop-shadow(0 0 45px rgba(99, 102, 241, 0.25));
          }
          100% {
            filter: drop-shadow(0 0 35px rgba(192, 38, 211, 0.18));
          }
        }
      `}</style>
    </footer>
  );
}

/* ---- Micro-Components ---- */

function FooterHeading({ children }) {
  return (
    <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
      {children}
      <span
        className="mt-2.5 block h-0.5 w-8 rounded-full"
        style={{ background: "linear-gradient(90deg, #38BDF8, #818CF8)" }}
      />
    </h4>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-block text-slate-400 transition-all duration-200 ease-out hover:translate-x-1.5 hover:text-white"
    >
      {children}
    </Link>
  );
}

function ContactIcon({ icon }) {
  return (
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/10 text-sky-400"
      style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(124,58,237,0.08))" }}
    >
      <i className={`ti ${icon} text-sm`} />
    </span>
  );
}
