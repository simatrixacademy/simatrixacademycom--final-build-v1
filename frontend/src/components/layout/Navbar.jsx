import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { api } from "../../api/client";
import { icon } from "../../lib/icons";

// Enrich categories with authoritative certification subtitles & badges
const CATEGORY_META = {
  "full-stack": {
    sub: "MERN, Java, Python, etc.",
    badge: "Popular",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200/80",
  },
  "data-science": {
    sub: "Machine Learning, Python, etc.",
    badge: "Trending",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200/80",
  },
  "cloud": {
    sub: "AWS, Azure, DevOps, etc.",
    badge: null,
  },
  "cybersecurity": {
    sub: "Ethical Hacking, CCNA, etc.",
    badge: "New",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  "programming": {
    sub: "Python, Java, C++, etc.",
    badge: null,
  },
  "mobile-app": {
    sub: "Flutter, React Native, etc.",
    badge: null,
  },
  "testing": {
    sub: "Selenium, API, Manual QA, etc.",
    badge: null,
  },
  "database": {
    sub: "MySQL, PostgreSQL, Oracle, etc.",
    badge: null,
  },
  "sap": {
    sub: "SAP FICO, MM, ABAP, etc.",
    badge: null,
  },
  "digital-marketing": {
    sub: "SEO, Performance Ads, etc.",
    badge: null,
  },
};

const ABOUT_PRIMARY_LINKS = [
  {
    label: "Academy Overview",
    desc: "Our story, leadership & tech pedigree",
    to: "/about",
    icon: "ti-building-community",
  },
  {
    label: "Mission & Vision",
    desc: "Empowering engineers with high-impact skills",
    to: "/about/mission",
    icon: "ti-target",
  },
  {
    label: "Our Pillars",
    desc: "Project-first learning & mentor guidance",
    to: "/about/pillars",
    icon: "ti-columns",
  },
  {
    label: "Awards & Honors",
    desc: "Industry recognitions & government accolades",
    to: "/awards",
    icon: "ti-award",
  },
];

const CAREER_PRIMARY_LINKS = [
  {
    label: "Placement Assistance",
    desc: "500+ hiring partners, resume reviews & mocks",
    to: "/placement",
    icon: "ti-briefcase",
    badge: "94% Hired",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  {
    label: "1-on-1 Career Guidance",
    desc: "Personalized roadmaps with technical leads",
    to: "/career-guidance",
    icon: "ti-compass",
    badge: "Free Session",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200/80",
  },
  {
    label: "Interview Prep Kit",
    desc: "Curated DSA roadmaps, kits & cheatsheets",
    to: "/interview-resources",
    icon: "ti-file-text",
    badge: "Kit",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200/80",
  },
  {
    label: "Student Reviews",
    desc: "Verified alumni career transitions & stories",
    to: "/reviews",
    icon: "ti-star",
    badge: "Verified",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
  },
];

const SUPPORT_SECONDARY_LINKS = [
  {
    label: "Book Campus Visit",
    desc: "Tour our coding labs & meet instructors",
    to: "/appointment",
    icon: "ti-calendar-event",
  },
  {
    label: "Help Center & FAQ",
    desc: "Admissions, schedules & batch timings",
    to: "/help-center",
    icon: "ti-help-circle",
  },
  {
    label: "Tech Blog & Insights",
    desc: "Framework deep-dives & developer trends",
    to: "/blog",
    icon: "ti-news",
  },
];

export default function Navbar() {
  const { pathname, search } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  // Stripe Morphing Dropdown State
  const [dropdownPos, setDropdownPos] = useState({
    left: 0,
    width: 680,
    height: 340,
    opacity: 0,
    scale: 0.96,
  });
  const [caretLeft, setCaretLeft] = useState(0);

  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  const triggerRefs = {
    courses: useRef(null),
    about: useRef(null),
    support: useRef(null),
  };

  const contentRefs = {
    courses: useRef(null),
    about: useRef(null),
    support: useRef(null),
  };

  useEffect(() => {
    api
      .getSite()
      .then((res) => setCategories(res.data?.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    setHoveredNav(null);
  }, [pathname, search]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setActiveMenu(null);
        setHoveredNav(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
        setHoveredNav(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update position & size whenever activeMenu changes (Stripe Butter Morphing)
  useEffect(() => {
    if (!activeMenu || !navRef.current) return;

    const triggerEl = triggerRefs[activeMenu]?.current;
    const contentEl = contentRefs[activeMenu]?.current;
    if (!triggerEl || !contentEl) return;

    const navRect = navRef.current.getBoundingClientRect();
    const triggerRect = triggerEl.getBoundingClientRect();

    const width = contentEl.offsetWidth || 680;
    const height = contentEl.offsetHeight || 340;

    const triggerCenter = triggerRect.left + triggerRect.width / 2 - navRect.left;
    let targetLeft = triggerCenter - width / 2;

    // Constrain within nav bounds
    targetLeft = Math.max(16, Math.min(targetLeft, navRect.width - width - 16));
    const targetCaret = triggerCenter - targetLeft;

    setDropdownPos({
      left: targetLeft,
      width,
      height,
      opacity: 1,
      scale: 1,
    });
    setCaretLeft(targetCaret);
  }, [activeMenu, categories]);

  const handleTriggerEnter = (menuName) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredNav(menuName);
    setActiveMenu(menuName);
  };

  const handleTriggerLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoveredNav(null);
    }, 180);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredNav(activeMenu || "dropdown");
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoveredNav(null);
    }, 180);
  };

  const toggleMenu = (menuName) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const primaryCategories = categories.slice(0, 6);

  const isHomeActive = pathname === "/";
  const showHomeIndicator = isHomeActive && !activeMenu && (!hoveredNav || hoveredNav === "home");

  const isContactActive = pathname === "/contact";
  const showContactIndicator = isContactActive && !activeMenu && (!hoveredNav || hoveredNav === "contact");

  return (
    <header
      className={`sticky top-0 w-full transition-all duration-200 ${
        mobileOpen
          ? "z-[100] border-b border-slate-200 bg-white shadow-sm"
          : scrolled
          ? "z-50 border-b border-slate-200/90 bg-white/95 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          : "z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md"
      }`}
    >
      <div
        ref={navRef}
        className="relative mx-auto flex h-16 max-w-[1440px] 2xl:max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10"
      >
        {/* Left Section: Brand Logo + Desktop Nav Links */}
        <div className="flex items-center gap-8 xl:gap-10">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center transition-opacity duration-150 hover:opacity-90"
            aria-label="Simatrix Academy Home"
          >
            <img
              src="/darkMode-without-tagline.svg"
              alt="Simatrix Academy"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-150 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden items-center gap-6 lg:flex xl:gap-7"
          >
            <NavLink
              to="/"
              end
              onMouseEnter={() => setHoveredNav("home")}
              className={`relative py-1 text-sm font-medium transition-colors ${
                showHomeIndicator
                  ? "font-semibold text-slate-950"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <span>Home</span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full bg-blue-600 transition-all duration-200 ${
                  showHomeIndicator
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 pointer-events-none"
                }`}
              />
            </NavLink>

            {/* Trigger 1: Courses */}
            <button
              ref={triggerRefs.courses}
              type="button"
              onMouseEnter={() => handleTriggerEnter("courses")}
              onMouseLeave={handleTriggerLeave}
              onClick={() => toggleMenu("courses")}
              aria-expanded={activeMenu === "courses"}
              className={`flex items-center gap-1.5 py-1 text-sm font-medium transition-colors cursor-pointer ${
                activeMenu === "courses" || pathname.startsWith("/courses")
                  ? "font-semibold text-slate-950"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <span>Courses</span>
              <i
                className={`ti ti-chevron-down text-xs text-slate-400 transition-transform duration-200 ${
                  activeMenu === "courses" ? "rotate-180 text-blue-600 font-bold" : ""
                }`}
              />
            </button>

            {/* Trigger 2: About */}
            <button
              ref={triggerRefs.about}
              type="button"
              onMouseEnter={() => handleTriggerEnter("about")}
              onMouseLeave={handleTriggerLeave}
              onClick={() => toggleMenu("about")}
              aria-expanded={activeMenu === "about"}
              className={`flex items-center gap-1.5 py-1 text-sm font-medium transition-colors cursor-pointer ${
                activeMenu === "about" ||
                pathname === "/about" ||
                pathname === "/mission" ||
                pathname === "/awards" ||
                pathname === "/gallery"
                  ? "font-semibold text-slate-950"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <span>About</span>
              <i
                className={`ti ti-chevron-down text-xs text-slate-400 transition-transform duration-200 ${
                  activeMenu === "about" ? "rotate-180 text-blue-600 font-bold" : ""
                }`}
              />
            </button>

            {/* Trigger 3: Career & Placement */}
            <button
              ref={triggerRefs.support}
              type="button"
              onMouseEnter={() => handleTriggerEnter("support")}
              onMouseLeave={handleTriggerLeave}
              onClick={() => toggleMenu("support")}
              aria-expanded={activeMenu === "support"}
              className={`flex items-center gap-1.5 py-1 text-sm font-medium transition-colors cursor-pointer ${
                activeMenu === "support" ||
                pathname === "/placement" ||
                pathname === "/career-guidance" ||
                pathname === "/resume-building" ||
                pathname === "/interview-resources"
                  ? "font-semibold text-slate-950"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <span>Career & Placement</span>
              <i
                className={`ti ti-chevron-down text-xs text-slate-400 transition-transform duration-200 ${
                  activeMenu === "support" ? "rotate-180 text-blue-600 font-bold" : ""
                }`}
              />
            </button>

            {/* Direct Link: Contact */}
            <NavLink
              to="/contact"
              onMouseEnter={() => setHoveredNav("contact")}
              className={`relative py-1 text-sm font-medium transition-colors ${
                pathname === "/contact" && !activeMenu && hoveredNav !== "actions"
                  ? "font-semibold text-slate-950"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <span>Contact</span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-2.5 left-0 right-0 h-0.5 rounded-full bg-blue-600 transition-all duration-200 ${
                  pathname === "/contact" && !activeMenu && hoveredNav !== "actions"
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 pointer-events-none"
                }`}
              />
            </NavLink>
          </nav>
        </div>

        {/* Right Actions: WhatsApp + Divider + Phone + Smaller Cleaner CTA */}
        <div
          onMouseEnter={() => setHoveredNav("actions")}
          onMouseLeave={() => setHoveredNav(null)}
          className="hidden items-center gap-4 xl:gap-5 lg:flex"
        >
          <a
            href="https://wa.me/919363793954?text=Hello%20Simatrix%20Academy%2C%20I%20would%20like%20to%20know%20more%20about%20your%20courses"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
            title="Chat on WhatsApp"
          >
            <i className="ti ti-brand-whatsapp text-lg text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Clean Vertical Divider */}
          <span className="h-4 w-px bg-slate-200" aria-hidden="true" />

          <a
            href="tel:+919363793954"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 transition hover:text-slate-950"
            title="Call Admissions"
          >
            <i className="ti ti-phone text-sm text-sky-600" />
            <span>+91 93637 93954</span>
          </a>

          <Link
            to="/contact"
            className="ml-4 xl:ml-6 inline-flex items-center gap-1.5 rounded-lg bg-[#0070e0] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-[#0060c0] active:translate-y-0"
          >
            <span>Get Course Details</span>
            <i className="ti ti-arrow-right text-xs" />
          </Link>
        </div>

        {/* ==================================================================== */}
        {/* STRIPE BUTTER-SMOOTH MORPHING FLOATING DROPDOWN ISLAND (DESKTOP)     */}
        {/* ==================================================================== */}
        <div
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
          className="absolute top-full mt-2 hidden lg:block overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
          style={{
            transform: `translateX(${dropdownPos.left}px) scale(${activeMenu ? 1 : 0.96})`,
            width: `${dropdownPos.width}px`,
            height: `${dropdownPos.height}px`,
            opacity: activeMenu ? 1 : 0,
            pointerEvents: activeMenu ? "auto" : "none",
            transition:
              "transform 280ms cubic-bezier(0.16, 1, 0.3, 1), width 280ms cubic-bezier(0.16, 1, 0.3, 1), height 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease, scale 200ms ease",
          }}
        >
          {/* Animated Caret Arrow following the active trigger button */}
          <div
            className="absolute -top-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-200/90 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ left: `${caretLeft}px` }}
          />

          {/* PANE 1: COURSES */}
          <div
            ref={contentRefs.courses}
            className={`w-[680px] transition-opacity duration-200 ${
              activeMenu === "courses"
                ? "relative opacity-100"
                : "absolute top-0 left-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {primaryCategories.map((c) => {
                  const meta = CATEGORY_META[c.slug] || {
                    sub: c.description || "Industry Capstone, Placement, etc.",
                    badge: null,
                  };

                  return (
                    <Link
                      key={c.id}
                      to={`/courses?category=${c.slug}`}
                      onClick={() => setActiveMenu(null)}
                      className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all duration-150 hover:border-slate-200 hover:bg-slate-50 hover:shadow-xs"
                    >
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 transition-colors group-hover:border-sky-200 group-hover:bg-sky-100 group-hover:text-sky-700 group-hover:scale-105">
                        <i className={`${icon(c.icon)} text-lg`} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13.5px] font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {c.name}
                          </span>
                          {meta.badge && (
                            <span
                              className={`rounded-full border px-2 py-0.2 text-[9.5px] font-bold tracking-wide uppercase ${meta.badgeColor || "bg-sky-50 text-sky-700 border-sky-200/80"}`}
                            >
                              {meta.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 leading-snug line-clamp-1 group-hover:text-slate-600">
                          {meta.sub}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Simatrix Signature Bottom Strip */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Unsure which stack fits your goal?</span>
                <Link
                  to="/career-guidance"
                  onClick={() => setActiveMenu(null)}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-900 transition hover:text-sky-600 group"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-600 text-xs">
                    <i className="ti ti-compass" />
                  </span>
                  <span className="underline underline-offset-4 decoration-sky-300 group-hover:decoration-sky-500">
                    Talk to a Tech Mentor
                  </span>
                </Link>
              </div>

              <Link
                to="/courses"
                onClick={() => setActiveMenu(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              >
                <span>Explore all Programs</span>
                <i className="ti ti-arrow-right text-xs text-slate-400" />
              </Link>
            </div>
          </div>

          {/* PANE 2: ABOUT */}
          <div
            ref={contentRefs.about}
            className={`w-[580px] transition-opacity duration-200 ${
              activeMenu === "about"
                ? "relative opacity-100"
                : "absolute top-0 left-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="grid grid-cols-12 gap-4 p-5">
              <div className="col-span-7 space-y-2">
                {ABOUT_PRIMARY_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setActiveMenu(null)}
                    className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 transition hover:border-slate-200 hover:bg-slate-50 hover:shadow-xs"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600 transition-colors group-hover:border-sky-200 group-hover:bg-sky-100 group-hover:text-sky-700">
                      <i className={`ti ${item.icon} text-base`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug group-hover:text-slate-600">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="col-span-5 flex flex-col justify-between rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/90 via-blue-50/60 to-indigo-50/80 p-3.5">
                <div>
                  <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-700 mb-1.5">
                    <i className="ti ti-flame text-xs" />
                    <span>Hands-on Pedagogy</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-950">
                    Life at Simatrix
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                    Experience our modern coding labs, hackathon arenas, and mentor-led collaborative spaces.
                  </p>
                </div>

                <Link
                  to="/gallery"
                  onClick={() => setActiveMenu(null)}
                  className="mt-3 flex items-center justify-between rounded-lg border border-sky-200/80 bg-white px-3 py-2 text-xs font-semibold text-sky-700 shadow-xs transition hover:bg-sky-50 hover:text-sky-800"
                >
                  <span>Explore Campus Gallery</span>
                  <i className="ti ti-photo text-xs" />
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Want to inspect our training labs?</span>
                <Link
                  to="/appointment"
                  onClick={() => setActiveMenu(null)}
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-sky-600"
                >
                  <i className="ti ti-building text-sky-600" />
                  <span className="underline underline-offset-4 decoration-sky-300">
                    Schedule a Campus Tour
                  </span>
                </Link>
              </div>

              <Link
                to="/about"
                onClick={() => setActiveMenu(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
              >
                About Overview →
              </Link>
            </div>
          </div>

          {/* PANE 3: CAREER & SUPPORT */}
          <div
            ref={contentRefs.support}
            className={`w-[680px] transition-opacity duration-200 ${
              activeMenu === "support"
                ? "relative opacity-100"
                : "absolute top-0 left-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="grid grid-cols-12 gap-5 p-5">
              <div className="col-span-7 flex flex-col">
                <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Career Acceleration
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                    Placement Cell
                  </span>
                </div>

                <div className="space-y-2">
                  {CAREER_PRIMARY_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setActiveMenu(null)}
                      className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 transition hover:border-slate-200 hover:bg-slate-50 hover:shadow-xs"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600 transition-colors group-hover:border-sky-200 group-hover:bg-sky-100 group-hover:text-sky-700">
                        <i className={`ti ${item.icon} text-base`} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`rounded-full border px-1.5 py-0.2 text-[9px] font-bold uppercase ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug group-hover:text-slate-600">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="col-span-5 flex flex-col justify-between">
                <div>
                  <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Support & Community
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Student Hub
                    </span>
                  </div>

                  <div className="space-y-2">
                    {SUPPORT_SECONDARY_LINKS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setActiveMenu(null)}
                        className="group flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 transition hover:border-slate-200 hover:bg-slate-50 hover:shadow-xs"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-100">
                          <i className={`ti ${item.icon} text-sm`} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                            {item.label}
                          </div>
                          <div className="text-[10.5px] leading-tight text-slate-500 mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/80 p-3">
                  <div className="text-[11px] font-semibold text-sky-800">
                    Admissions Helpline
                  </div>
                  <a
                    href="tel:+919363793954"
                    className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-sky-700 transition"
                  >
                    <i className="ti ti-phone text-sky-600 text-xs" />
                    <span>+91 93637 93954</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Have specific admission questions?</span>
                <Link
                  to="/contact"
                  onClick={() => setActiveMenu(null)}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-900 transition hover:text-sky-600"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs">
                    <i className="ti ti-message-circle" />
                  </span>
                  <span className="underline underline-offset-4 decoration-emerald-300">
                    Chat with an Advisor
                  </span>
                </Link>
              </div>

              <Link
                to="/placement"
                onClick={() => setActiveMenu(null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 transition"
              >
                <span>View Placement Records</span>
                <i className="ti ti-chevron-right text-xs text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <i className={`ti ${mobileOpen ? "ti-x" : "ti-menu-2"} text-lg`} />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-16 bottom-0 h-[calc(100dvh-4rem)] z-[100] flex flex-col justify-between overflow-y-auto border-t border-slate-200 bg-white px-5 py-6 lg:hidden"
        >
          <div className="space-y-3">
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-50 text-sky-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`
              }
            >
              <span>Home</span>
              <i className="ti ti-chevron-right text-xs text-slate-400" />
            </NavLink>

            {/* Mobile Courses Accordion */}
            <MobileAccordion label="Courses" iconName="ti-book-2">
              <div className="space-y-1 pt-1 pb-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/courses?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-950"
                  >
                    <i className={`${icon(c.icon)} text-sky-600`} />
                    <span>{c.name}</span>
                  </Link>
                ))}
                <Link
                  to="/courses"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                >
                  <span>View All Courses</span>
                  <i className="ti ti-arrow-right text-xs" />
                </Link>
              </div>
            </MobileAccordion>

            {/* Mobile About Accordion */}
            <MobileAccordion label="About Simatrix" iconName="ti-building-community">
              <div className="space-y-1 pt-1 pb-2">
                {ABOUT_PRIMARY_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-950"
                  >
                    <i className={`ti ${l.icon} text-sky-600`} />
                    <span>{l.label}</span>
                  </Link>
                ))}
                <Link
                  key="/gallery"
                  to="/gallery"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-950"
                >
                  <i className="ti ti-photo text-sky-600" />
                  <span>Campus Gallery</span>
                </Link>
              </div>
            </MobileAccordion>

            {/* Mobile Career & Placement Accordion */}
            <MobileAccordion label="Career & Placement" iconName="ti-briefcase">
              <div className="space-y-1 pt-1 pb-2">
                {CAREER_PRIMARY_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-950"
                  >
                    <i className={`ti ${l.icon} text-sky-600`} />
                    <span>{l.label}</span>
                  </Link>
                ))}
                {SUPPORT_SECONDARY_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-950"
                  >
                    <i className={`ti ${l.icon} text-sky-600`} />
                    <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </MobileAccordion>

            <NavLink
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-50 text-sky-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`
              }
            >
              <span>Contact Us</span>
              <i className="ti ti-chevron-right text-xs text-slate-400" />
            </NavLink>
          </div>

          {/* Mobile Bottom Actions */}
          <div className="mt-6 space-y-2.5 border-t border-slate-200 pt-5">
            <a
              href="https://wa.me/919363793954?text=Hello%20Simatrix%20Academy%2C%20I%20would%20like%20to%20know%20more%20about%20your%20courses"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              <i className="ti ti-brand-whatsapp text-emerald-600 text-base" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="tel:+919363793954"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              <i className="ti ti-phone text-sky-600" />
              <span>Call +91 93637 93954</span>
            </a>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500"
            >
              <span>Get Course Details</span>
              <i className="ti ti-arrow-right text-xs" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileAccordion({ label, iconName, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200/80 bg-slate-50/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-800"
      >
        <div className="flex items-center gap-2.5">
          <i className={`ti ${iconName} text-sky-600`} />
          <span>{label}</span>
        </div>
        <i
          className={`ti ti-chevron-down text-xs text-slate-400 transition-transform duration-150 ${
            open ? "rotate-180 text-sky-600" : ""
          }`}
        />
      </button>
      {open && <div className="border-t border-slate-200/60 px-3.5 pb-2">{children}</div>}
    </div>
  );
}
