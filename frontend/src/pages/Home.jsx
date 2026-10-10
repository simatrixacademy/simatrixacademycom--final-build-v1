import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, mediaUrl } from "../api/client";
import { icon } from "../lib/icons";
import { ResponsiveImage } from "../components/ui";
import EnquiryForm from "../components/EnquiryForm";
import { useSeo } from "../lib/useSeo";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CareerAdvisorModal from "../components/CareerAdvisorModal";
import { getLiveReviews } from "../lib/reviewsData";
import TieUpsMarquee from "../components/TieUpsMarquee";
import { getCourseImage } from "../lib/courseImage";
import { Mascot } from "page-mascot";


const HERO_BANNERS = [
  {
    id: "banner-learn-fullstack-ai",
    src: "/banner/REF1_R.png",
    mobileSrc: "/banner/REF1_MOBILE.png",
    alt: "Learn Full Stack & AI Skills: Industry-ready training with hands-on projects, expert mentors, and career support",
    to: "/courses",
    title: "Learn Full Stack & AI Skills",
  },
  {
    id: "banner-learn-build",
    src: "/banner/REF2.png",
    mobileSrc: "/banner/REF2_MOBILE.png",
    alt: "Learn Today, Build Tomorrow: Industry-oriented IT training programs with live classes and placement support",
    to: "/courses",
    title: "Learn Today. Build Tomorrow.",
  },
  {
    id: "banner-lead-tomorrow",
    src: "/banner/REF3.png",
    mobileSrc: "/banner/REF3_MOBILE.png",
    alt: "Learn Today, Lead Tomorrow: Practical learning and placement assistance from industry experts",
    to: "/career-guidance",
    title: "Learn Today. Lead Tomorrow.",
  },
];

const STORIES = [
  {
    id: "story-1",
    name: "Muthuvel Selvam",
    course: "MERN Full Stack Development",
    category: "full-stack",
    college: "KLN College of Engineering, Madurai",
    batch: "2025 Graduate",
    role: "Junior Full Stack Developer",
    headline: "Very patient trainers and good practical lab guidance.",
    quote: "I joined with only basic knowledge of C and Java from college. The mentors taught React, Node.js, and MongoDB step-by-step from scratch. Whenever I had doubts or coding errors, they sat with me in the lab and explained. Very friendly learning environment.",
    highlight: "Clear Doubt Clearance & Friendly Mentors",
    campus: "Virudhunagar",
    rating: 5,
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: "story-2",
    name: "Kavitha Murugesan",
    course: "Python & Web Development",
    category: "ai",
    college: "Thiagarajar College of Engineering",
    batch: "2025 Batch",
    role: "Python & Web Associate",
    headline: "Good institute in Virudhunagar for learning Python.",
    quote: "The practical sessions are really helpful. Instead of just theory notes, we write code every day in the lab. Trainers explain in both Tamil and English, so it was easy for me to understand complex topics without any hesitation.",
    highlight: "Tamil & English Explanations",
    campus: "Virudhunagar",
    rating: 5,
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: "story-3",
    name: "Saravanan Perumal",
    course: "Cloud & DevOps Engineering",
    category: "cloud",
    college: "Sethu Institute of Technology",
    batch: "2025 Graduate",
    role: "Cloud Operations Associate",
    headline: "Good lab setup and practical server practice.",
    quote: "The computer lab facility and high-speed internet are great for daily practice. Flexible lab hours and mentors explain Linux server configurations patiently. Would appreciate a few more weekend advanced workshops, but overall very good learning experience.",
    highlight: "High-Speed Lab & AC Classrooms",
    campus: "Virudhunagar",
    rating: 4,
    gradient: "from-sky-600 to-blue-700",
  },
  {
    id: "story-4",
    name: "Deepika Rangarajan",
    course: "Java Full Stack Development",
    category: "full-stack",
    college: "Kamaraj College of Engineering",
    batch: "2025 Batch",
    role: "Java Backend Developer",
    headline: "Helped me prepare well for technical interviews.",
    quote: "Joined here after completing my B.Sc. Computer Science. They covered Core Java, Spring Boot, and database concepts in depth. The mock interviews and resume guidance gave me a lot of confidence to attend campus interviews.",
    highlight: "Mock Interviews & Resume Help",
    campus: "Virudhunagar",
    rating: 5,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    id: "story-5",
    name: "Karthikeyan Veerappan",
    course: "Data Analytics & SQL",
    category: "ai",
    college: "Mepco Schlenk Engineering College",
    batch: "Career Switcher",
    role: "Business Intelligence Analyst",
    headline: "Easy to learn even if you come from a non-CS background.",
    quote: "I completed mechanical engineering and wanted to switch to software. The faculty supported me patiently from basic Excel and SQL up to Power BI. They never rush through topics until everyone in the batch understands.",
    highlight: "Non-IT Friendly Teaching",
    campus: "Virudhunagar",
    rating: 5,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "story-6",
    name: "Anbuselvi Natarajan",
    course: "React & Modern Web Development",
    category: "full-stack",
    college: "Fatima College, Madurai",
    batch: "BCA Fresher",
    role: "Frontend Engineer Intern",
    headline: "Hands-on coding experience that helped my confidence.",
    quote: "In college we only memorized programs for exams, but here we actually built responsive websites and web pages ourselves. Friendly trainers who explain doubts patiently in the lab. A few more weekend practice hours would be even better.",
    highlight: "100% Practical Daily Coding",
    campus: "Virudhunagar",
    rating: 4,
    gradient: "from-rose-500 to-red-600",
  },
  {
    id: "story-7",
    name: "Senthil Kumar M.",
    course: "Cybersecurity & Network Security",
    category: "cybersecurity",
    college: "Anna University Regional Campus",
    batch: "2025 Batch",
    role: "Junior Security Analyst",
    headline: "Well-equipped lab and dedicated mentors.",
    quote: "Simatrix has good lab infrastructure in Virudhunagar. Trainers have real industry experience and teach practical network security and Linux administration clearly. Worth the course fees.",
    highlight: "Industry Experienced Trainers",
    campus: "Virudhunagar",
    rating: 5,
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    id: "story-8",
    name: "Pavithra Thangavel",
    course: "Python Full Stack & Django",
    category: "full-stack",
    college: "SRNM College, Sattur",
    batch: "2025 Graduate",
    role: "Python Full Stack Developer",
    headline: "Convenient batch timings for students commuting from nearby towns.",
    quote: "I traveled daily from Sattur by bus (only 25 mins journey). The morning batch timings were very convenient. Staff are polite and mentors helped me complete my academic project alongside the course.",
    highlight: "Convenient Morning & Evening Batches",
    campus: "Virudhunagar",
    rating: 5,
    gradient: "from-teal-600 to-cyan-700",
  },
  {
    id: "story-9",
    name: "Dinesh Pandian",
    course: "Full Stack Development",
    category: "full-stack",
    college: "PSNA College of Engineering",
    batch: "Final-Year B.Tech",
    role: "Software Engineer Trainee",
    headline: "Practical approach, regular practice, and helpful mentors.",
    quote: "Daily coding exercises and Git practice helped my basics a lot. Mentors are approachable and clear doubts patiently in the lab. Good value for money compared to traveling to Madurai every day.",
    highlight: "Weekly Coding Tests & Reviews",
    campus: "Virudhunagar",
    rating: 4,
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    id: "story-10",
    name: "Aravindhan Kalidass",
    course: "Linux Administration & Cloud",
    category: "cloud",
    college: "Government Arts College",
    batch: "2024 Graduate",
    role: "Systems & Cloud Engineer",
    headline: "Genuine career guidance and supportive staff.",
    quote: "From admission counselling to course completion, the team provided honest guidance without false promises. Teaching quality is very neat and practical. Definitely recommended for students in Virudhunagar district.",
    highlight: "Honest Guidance & Verified Support",
    campus: "Virudhunagar",
    rating: 5,
    gradient: "from-orange-500 to-amber-600",
  },
];

const STEPS = [
  ["01", "Choose your path", "Compare learning paths or speak with a career counsellor to identify the domain that matches your goals."],
  ["02", "Learn by building", "Master each concept through guided coding labs, mentor code reviews, and production-style projects."],
  ["03", "Prepare for interviews", "Strengthen your technical answers, GitHub portfolio, and resume through rigorous mock interview sessions."],
  ["04", "Build toward your career", "Connect your verified technical work directly to interview opportunities and placement assistance."],
];

const VISITOR_PATHS = [
  { icon: "ti-compass", label: "I’m exploring", title: "Find the right tech path", text: "Compare domains, course levels and career outcomes before you commit.", action: "Explore all courses", to: "/courses" },
  { icon: "ti-briefcase", label: "I need experience", title: "Build a portfolio you can explain", text: "Learn through practical work designed to give freshers something meaningful to discuss in interviews.", action: "View placement assistance", to: "/placement" },
  { icon: "ti-message-circle", label: "I need direction", title: "Talk to a career guide", text: "Share your background and goals, then get a clearer recommendation for your next step.", action: "Book free guidance", to: "/career-guidance" },
];

const OUTCOMES = [
  ["ti-folders", "Portfolio-ready projects", "Turn concepts into practical work you can demonstrate and explain."],
  ["ti-file-description", "A stronger professional profile", "Improve how your skills, projects and experience appear on your resume."],
  ["ti-messages", "Interview confidence", "Practise technical explanations and common interview conversations."],
  ["ti-route", "A clearer career roadmap", "Know which skills to build now and what your next milestone should be."],
];

const FAQ_CATEGORIES = [
  "All Questions",
  "Admissions & Fees",
  "Courses & Labs",
  "Placements & Internships",
];

const FAQ_ITEMS = [
  {
    id: "faq-1",
    num: "01",
    category: "Admissions & Fees",
    tag: "Eligibility",
    question: "Am I eligible to join Simatrix Academy?",
    answer: "Yes! Our programs are designed for college students, final-year students, recent graduates (engineering, arts & science), and working professionals seeking an IT career switch. We provide foundational beginner modules as well as advanced industry tracks.",
    actionText: "Explore Courses & Syllabi",
    actionTo: "/courses",
  },
  {
    id: "faq-2",
    num: "02",
    category: "Courses & Labs",
    tag: "Career Guidance",
    question: "Which technology course is right for my background?",
    answer: "If you enjoy creating visible interfaces and web apps, Full Stack Development is a great fit. If you prefer data analysis and problem-solving, Python & AI / Data Science is ideal. For systems and infrastructure, choose Cloud Computing or Cybersecurity. You can also book a free 1-on-1 session with our counsellors.",
    actionText: "Book Free 1-on-1 Guidance",
    actionTo: "/career-guidance",
  },
  {
    id: "faq-3",
    num: "03",
    category: "Courses & Labs",
    tag: "Training Modes",
    question: "Do you offer classroom (offline) and live online classes?",
    answer: "Yes. We offer fully equipped physical classroom training with dedicated computer labs at our Virudhunagar center, as well as interactive live online batches with screen-sharing, mentor debugging, and recorded sessions.",
  },
  {
    id: "faq-4",
    num: "04",
    category: "Placements & Internships",
    tag: "Free Internship",
    question: "Is there really a free program available?",
    answer: "Yes! We offer a Free Full-Stack Internship for eligible college students and freshers. It focuses on structured practical exercises, guided project exposure, and interview readiness. Our admissions team evaluates eligibility based on current batch capacity.",
    actionText: "Apply for Free Internship",
    actionEnquiry: "internship",
  },
  {
    id: "faq-5",
    num: "05",
    category: "Courses & Labs",
    tag: "GitHub Projects",
    question: "Will I build real projects for my GitHub portfolio?",
    answer: "Absolutely. Every course includes 2 to 4 end-to-end portfolio projects. You will write clean code, use Git version control, deploy applications to the cloud, and document them properly so recruiters can inspect your real work.",
  },
  {
    id: "faq-6",
    num: "06",
    category: "Placements & Internships",
    tag: "Placement Support",
    question: "Is a job guaranteed after completing the course?",
    answer: "We believe in 100% honesty: we do not sell false '100% job guarantee' marketing claims. What we provide is genuine employability: industry-grade skills, verified GitHub projects, professional resume building, technical mock interviews, and direct interview opportunities with hiring partners.",
    actionText: "View Placement Assistance",
    actionTo: "/placement",
  },
  {
    id: "faq-7",
    num: "07",
    category: "Admissions & Fees",
    tag: "Admission Process",
    question: "What happens after I submit an enquiry form?",
    answer: "A Simatrix academic counsellor will contact you via phone or WhatsApp within 24 hours. They will understand your educational background, share detailed syllabi, explain batch schedules, and answer any questions without admission pressure.",
  },
  {
    id: "faq-8",
    num: "08",
    category: "Admissions & Fees",
    tag: "Campus Location",
    question: "Where is Simatrix Academy located?",
    answer: "Our campus is located at 1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001. Our facility features modern computer labs, high-speed internet, and mentor workstations for hands-on learning.",
    actionText: "Get Directions on Google Maps",
    actionHref: "https://www.google.com/maps/search/?api=1&query=1%2F2A+1st+Floor%2C+AA+Road%2C+Near+Head+Post+Office%2C+Virudhunagar%2C+Tamil+Nadu+626001",
  },
];

const TRUST_LINKS = [
  ["ti-star", "Student reviews", "Read experiences shared by learners", "/reviews"],
  ["ti-trophy", "Awards & recognition", "Explore Simatrix achievements", "/awards"],
  ["ti-compass", "Career guidance", "Understand your next learning step", "/career-guidance"],
  ["ti-briefcase", "Placement support", "Understand our career-support process", "/placement"],
];

const LANGUAGE_ITEMS = [
  ["ti-brand-html5", "HTML5", "text-orange-500"], ["ti-brand-css3", "CSS3", "text-sky-400"],
  ["ti-brand-javascript", "JavaScript", "text-yellow-400"], ["ti-brand-typescript", "TypeScript", "text-blue-400"],
  ["ti-brand-react", "React", "text-cyan-400"], ["ti-brand-nodejs", "Node.js", "text-green-400"],
  ["ti-brand-python", "Python", "text-yellow-300"], ["ti-brand-java", "Java", "text-orange-400"],
  ["ti-brand-php", "PHP", "text-indigo-300"], ["ti-brand-c-sharp", "C#", "text-violet-400"],
  ["ti-brand-golang", "Go", "text-cyan-300"], ["ti-brand-kotlin", "Kotlin", "text-purple-400"],
  ["ti-brand-swift", "Swift", "text-orange-400"], ["ti-brand-flutter", "Flutter", "text-sky-400"],
  ["ti-brand-github", "GitHub", "text-white"], ["ti-brand-docker", "Docker", "text-blue-400"],
  ["ti-brand-aws", "AWS", "text-amber-300"], ["ti-database", "SQL", "text-emerald-300"],
];

function initials(name = "Student") {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function SectionTitle({ eyebrow, title, description, dark = false, left = false }) {
  return <div className={`${left ? "" : "mx-auto text-center"} max-w-2xl`}>
    <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] ${dark ? "text-amber-300" : "text-amber-700"}`}><span className={`h-px w-7 ${dark ? "bg-amber-300" : "bg-amber-600"}`} />{eyebrow}<span className={`h-px w-7 ${left ? "hidden" : ""} ${dark ? "bg-amber-300" : "bg-amber-600"}`} /></p>
    <h2 className={`mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>
    {description && <p className={`mt-4 leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}>{description}</p>}
  </div>;
}


function CourseTile({ course }) {
  const courseImg = getCourseImage(course);

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group relative mx-auto flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1E0295]/40 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#1E0295]"
    >
      {/* Top Banner with Clean Normal Image */}
      <div className="relative aspect-[16/8] w-full overflow-hidden bg-slate-100">
        <img
          src={courseImg}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Card Body - Simatrix Design */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
            <span>
              <i className="ti ti-clock mr-1 text-slate-400" />
              {course.duration || "3 Months"}
            </span>
            <span className="text-slate-300">•</span>
            <span>
              <i className="ti ti-folders mr-1 text-emerald-600" />
              3+ Projects
            </span>
            <span className="text-slate-300">•</span>
            <span>
              <i className="ti ti-certificate mr-1 text-amber-600" />
              Certificate
            </span>
          </div>

          <h3 className="mt-2.5 font-display text-base sm:text-lg font-bold leading-snug text-slate-950 transition-colors group-hover:text-[#1E0295] line-clamp-1">
            {course.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
            {course.summary || `Hands-on ${course.title} training with guided labs and industry-oriented projects.`}
          </p>
        </div>

        {/* Explore Program CTA Bar */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#1E0295]">
          <span className="transition-colors group-hover:text-[#2804a8]">
            Explore Program
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#1E0295] bg-white text-[#1E0295] shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:bg-[#1E0295] group-hover:text-white">
            <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[350px] animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-sm">
      <div className="aspect-[16/8] w-full bg-slate-200/70" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex gap-2">
          <div className="h-3 w-16 rounded bg-slate-200/70" />
          <div className="h-3 w-20 rounded bg-slate-200/70" />
        </div>
        <div className="mt-3 h-5 w-4/5 rounded bg-slate-300/80" />
        <div className="mt-2.5 h-3.5 w-full rounded bg-slate-200/60" />
        <div className="mt-1.5 h-3.5 w-2/3 rounded bg-slate-200/60" />
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="h-3 w-20 rounded bg-slate-200/70" />
          <div className="h-8 w-8 rounded-full bg-slate-200/70" />
        </div>
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200/70" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-300/80" />
        <div className="h-3 w-1/3 rounded bg-slate-200/60" />
      </div>
      <div className="h-4 w-4 rounded bg-slate-200/40" />
    </div>
  );
}

function PopularCoursesCarousel({ courses }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalDots = Math.min(5, Math.max(courses.length, 1));

  const updateActiveDot = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    const ratio = track.scrollLeft / maxScroll;
    const index = Math.min(totalDots - 1, Math.max(0, Math.round(ratio * (totalDots - 1))));
    setActiveIndex(index);
  };

  const scrollToDot = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = (idx / (totalDots - 1)) * maxScroll;
    track.scrollTo({ left: target, behavior: "smooth" });
    setActiveIndex(idx);
  };

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const scrollAmount = card ? card.getBoundingClientRect().width + 20 : 340;
    track.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="mt-8">
      {/* Scrollable Track */}
      <div
        ref={trackRef}
        onScroll={updateActiveDot}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {courses.map((course) => (
          <div
            key={course.id}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
          >
            <CourseTile course={course} />
          </div>
        ))}
      </div>

      {/* Navigation Controls Centered with Matching Centered Purple Buttons */}
      <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:relative">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous courses"
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#1E0295] bg-transparent text-[#1E0295] transition-all duration-200 hover:bg-[#1E0295] hover:text-white active:scale-95 cursor-pointer shadow-xs"
          >
            <i className="ti ti-arrow-left text-sm" />
          </button>

          {/* Dots Indicator in Simatrix Centered Purple */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-1" role="tablist" aria-label="Course pagination">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeIndex === idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => scrollToDot(idx)}
                className="flex items-center justify-center p-1 cursor-pointer border-0 bg-transparent outline-none focus:outline-none appearance-none leading-none"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${activeIndex === idx
                      ? "h-2 w-6 bg-[#1E0295] shadow-xs"
                      : "h-2 w-2 bg-slate-200 hover:bg-[#1E0295]/30"
                    }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next courses"
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#1E0295] bg-transparent text-[#1E0295] transition-all duration-200 hover:bg-[#1E0295] hover:text-white active:scale-95 cursor-pointer shadow-xs"
          >
            <i className="ti ti-arrow-right text-sm" />
          </button>
        </div>

        {/* Explore All Courses Button */}
        <div className="sm:absolute sm:right-0">
          <Link
            to="/courses"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-[#1E0295] bg-white px-6 text-xs font-bold text-[#1E0295] shadow-xs transition-all duration-200 hover:bg-[#1E0295] hover:text-white active:scale-95 cursor-pointer"
          >
            <span>Explore All 20+ Courses</span>
            <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function getInitials(name = "Student") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function ModernLearnerStories({ testimonials = [] }) {
  const [liveTick, setLiveTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setLiveTick((t) => t + 1);
    window.addEventListener("simatrix_reviews_updated", handleUpdate);
    return () => window.removeEventListener("simatrix_reviews_updated", handleUpdate);
  }, []);

  const curatedStories = useMemo(() => {
    const liveList = getLiveReviews();
    const liveItems = liveList.map((l) => ({
      id: l.id,
      name: l.name,
      role: l.role,
      track: l.course || "Live Review",
      quote: l.quote,
      rating: l.rating || 5,
      gradient: l.gradient || "from-emerald-600 to-teal-700",
      isLive: true,
    }));

    if (testimonials?.length && testimonials !== STORIES) {
      const dynamicList = testimonials
        .filter((t) => t?.quote || t?.content)
        .map((t, idx) => ({
          id: `dyn-${t.id || idx}`,
          name: t.name || "Student",
          role: t.role || t.designation || "Simatrix Graduate",
          track: t.course || "Technical Track",
          quote: t.quote || t.content,
          rating: t.rating || 5,
          gradient: STORIES[idx % STORIES.length]?.gradient || "from-blue-600 to-indigo-600",
          isLive: false,
        }));
      if (dynamicList.length > 0) {
        return [...liveItems, ...dynamicList];
      }
    }

    const baseline = STORIES.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      track: s.course,
      quote: s.quote,
      rating: s.rating || 5,
      gradient: s.gradient,
      isLive: false,
    }));

    return [...liveItems, ...baseline];
  }, [testimonials, liveTick]);

  return (
    <div className="relative">
      {/* 1. Minimal Header */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold tracking-wider text-slate-700 shadow-2xs">
          <i className="ti ti-star-filled text-amber-500 text-xs" />
          <span>Student Stories</span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
          Confidence built through practice.
        </h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
          Real feedback from Tamil Nadu graduates who built practical portfolio projects and launched their tech careers.
        </p>
      </div>

      {/* 2. Infinite Marquee Stream (No images, pure typography and stylish initials) */}
      <div className="reviews-marquee mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="reviews-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-5 pr-5" aria-hidden={copy === 1 ? "true" : undefined}>
              {curatedStories.map((item) => (
                <figure
                  key={`${copy}-${item.id}`}
                  className="group flex h-[240px] w-[310px] sm:w-[350px] shrink-0 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_18px_36px_-8px_rgba(15,23,42,0.12)] hover:ring-1 hover:ring-slate-900/10"
                >
                  <div>
                    {/* Top: Name on TOP, Role UNDER Name, 5 Full Stars */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.gradient || "from-blue-600 to-indigo-600"} text-xs font-bold text-white shadow-2xs`}
                        >
                          {getInitials(item.name)}
                        </span>
                        <div className="min-w-0">
                          {/* Name on Top */}
                          <div className="flex items-center gap-1.5">
                            <strong className="truncate text-xs sm:text-[13px] font-bold text-slate-950">{item.name}</strong>
                            {item.isLive ? (
                              <span className="rounded bg-emerald-50 px-1 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                                Live
                              </span>
                            ) : (
                              <i className="ti ti-circle-check-filled text-emerald-500 text-xs shrink-0" title="Verified Student" />
                            )}
                          </div>
                          {/* Role under Name */}
                          <p className="truncate text-[11px] font-semibold text-brand-700">{item.role}</p>
                        </div>
                      </div>

                      {/* Stars: Show filled/empty stars based on rating */}
                      <div className="flex items-center gap-0.5 text-xs shrink-0 pt-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <i
                            key={s}
                            className={`ti ti-star-filled ${
                              s < (item.rating || 5) ? "text-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Concise Quote */}
                    <blockquote className="mt-3 text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal line-clamp-4">
                      “{item.quote}”
                    </blockquote>
                  </div>

                  {/* Track Badge Strip */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100 shrink-0">
                      {item.track}
                    </span>
                    <i className="ti ti-quote text-lg text-slate-200" />
                  </div>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Subtle Bottom Trust Strip with Live Feedback Status & Action */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
        <span className="flex text-amber-400 text-xs">
          <i className="ti ti-star-filled" />
        </span>
        <span className="font-semibold text-slate-800">4.8 / 5.0 rating</span>
        <span className="text-slate-300">•</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Reviews Active
        </span>
        <span className="text-slate-300">•</span>
        <Link
          to="/reviews#share-review"
          className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-900 transition-colors"
        >
          <i className="ti ti-pencil text-xs" />
          <span>Write a Review</span>
        </Link>
        <span className="text-slate-300">•</span>
        <Link
          to="/reviews"
          className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-brand-700 transition-colors"
        >
          <span>All reviews</span>
          <i className="ti ti-arrow-right text-xs" />
        </Link>
      </div>

      <style>{`
        .reviews-track {
          animation: reviews-scroll 50s linear infinite;
        }
        .reviews-marquee:hover .reviews-track,
        .reviews-marquee:focus-within .reviews-track {
          animation-play-state: paused;
        }
        @keyframes reviews-scroll {
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .reviews-track {
            animation: none;
          }
          .reviews-marquee {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}

function TechnologyMarquee() {
  const rows = [LANGUAGE_ITEMS.slice(0, 9), LANGUAGE_ITEMS.slice(9)];
  return <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-[#0a1020] py-7 text-white shadow-xl" aria-label="Programming languages and technologies">
    <div className="mb-5 flex items-center justify-between gap-4 px-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Technologies you can explore</p><p className="mt-1 text-sm text-slate-300">Languages, frameworks and tools used in modern development.</p></div><i className="ti ti-code text-3xl text-white/20" aria-hidden="true" /></div>
    <div className="language-marquee space-y-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {rows.map((row, rowIndex) => <div key={rowIndex} className={`language-track flex w-max ${rowIndex ? "language-track-reverse" : ""}`}>
        {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1 ? "true" : undefined}>{row.map(([ic, name, color]) => <span key={`${copy}-${name}`} className="flex min-w-max items-center gap-2.5 rounded-xl border border-white/10 bg-white/[.07] px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-white/25 hover:bg-white/[.13]"><i className={`ti ${ic} text-xl ${color}`} /><span>{name}</span></span>)}</div>)}
      </div>)}
    </div>
    <style>{`
      .language-track { animation: language-scroll 28s linear infinite; }
      .language-track-reverse { animation-direction: reverse; animation-duration: 34s; }
      .language-marquee:hover .language-track, .language-marquee:focus-within .language-track { animation-play-state: paused; }
      @keyframes language-scroll { to { transform: translateX(-50%); } }
      @media (prefers-reduced-motion: reduce) { .language-track { animation: none; } .language-marquee { overflow-x: auto; } }
    `}</style>
  </div>;
}

const TECH_ROW_1 = [
  {
    name: "HTML5",
    detail: "Structures modern web pages",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#E44D26] text-xs font-black text-white shadow-sm">
        5
      </span>
    ),
  },
  {
    name: "CSS3",
    detail: "Styles responsive interfaces",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#264DE4] text-xs font-black text-white shadow-sm">
        3
      </span>
    ),
  },
  {
    name: "JS",
    detail: "Adds interactive web behavior",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7DF1E] text-[11px] font-black text-black shadow-sm">
        JS
      </span>
    ),
  },
  {
    name: "React",
    detail: "Builds component-based interfaces",
    icon: <i className="ti ti-brand-react text-2xl text-cyan-400" />,
  },
  {
    name: "Node.js",
    detail: "Runs JavaScript on servers",
    icon: <i className="ti ti-brand-nodejs text-2xl text-emerald-400" />,
  },
  {
    name: "Python",
    detail: "Powers web, data and AI apps",
    icon: <i className="ti ti-brand-python text-2xl text-amber-300" />,
  },
  {
    name: "Git",
    detail: "Version control and collaboration",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F05032] text-xs font-bold text-white shadow-sm">
        <i className="ti ti-git-branch text-base" />
      </span>
    ),
  },
];

const TECH_ROW_2 = [
  {
    name: "Docker",
    detail: "Packages apps into containers",
    icon: <i className="ti ti-brand-docker text-2xl text-sky-400" />,
  },
  {
    name: "AWS",
    detail: "Deploys apps in the cloud",
    icon: (
      <span className="font-black text-amber-400 text-sm tracking-tighter">
        aws
      </span>
    ),
  },
  {
    name: "MySQL",
    detail: "Relational database management",
    icon: <i className="ti ti-brand-mysql text-2xl text-sky-400" />,
  },
  {
    name: "MongoDB",
    detail: "Document-oriented NoSQL database",
    icon: <i className="ti ti-brand-mongodb text-2xl text-emerald-400" />,
  },
  {
    name: "PostgreSQL",
    detail: "Enterprise-grade SQL database",
    icon: <i className="ti ti-database text-2xl text-sky-300" />,
  },
  {
    name: "TypeScript",
    detail: "Type-safe modern JavaScript development",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#3178C6] text-[11px] font-black text-white shadow-sm">
        TS
      </span>
    ),
  },
  {
    name: "Next.js",
    detail: "Production framework for full-stack React apps",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[11px] font-black text-white ring-1 ring-white/20 shadow-sm">
        N
      </span>
    ),
  },
];

const SIMATRIX_PRINCIPLES = [
  {
    number: "01",
    label: "Foundations First",
    title: "We teach the terminal before the framework.",
    description:
      "Frameworks and libraries change every two years. Fundamentals don't. You will understand how memory works, how HTTP cycles execute, how git trees branch, and how the Linux shell behaves before you write a single line of React or Python.",
    point: "Foundational durability over temporary trends",
  },
  {
    number: "02",
    label: "Clean Architecture",
    title: "Code is written once, but read a hundred times.",
    description:
      "Anyone can copy-paste code that compiles. We train you to write code that teams can maintain. Every project undergoes real pull request reviews, clean architecture scrutiny, and refactoring sessions with senior developers.",
    point: "Pull requests · Code readability · Maintainability",
  },
  {
    number: "03",
    label: "Real Debugging",
    title: "You learn by breaking production, not tutorials.",
    description:
      "Tutorials create the illusion of competence because everything works on the first try. In our labs, we deliberately hand you broken builds, failing database migrations, and edge-case errors so you develop genuine debugging muscle.",
    point: "Root-cause analysis · Live bug fixing · Zero tutorial debt",
  },
];

function CommunitySection() {
  const cardsRef = useRef([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let rafId = null;

    const updateCardStack = () => {
      const cards = cardsRef.current;
      if (!cards || cards.length === 0) return;

      let highestActive = 0;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card) continue;

        const currentRect = card.getBoundingClientRect();

        // Mark active step based on which card is near its sticky position
        if (currentRect.top <= 200) {
          highestActive = i;
        }

        // Calculate overlap from all subsequent cards
        let overlapWeight = 0;
        for (let j = i + 1; j < cards.length; j++) {
          const higherCard = cards[j];
          if (!higherCard) continue;
          const higherRect = higherCard.getBoundingClientRect();

          const overlapRange = currentRect.height || 260;
          const dist = (currentRect.top + overlapRange) - higherRect.top;
          const progress = Math.max(0, Math.min(1, dist / overlapRange));
          overlapWeight += progress;
        }

        // Scale and depth styling
        const scale = Math.max(0.90, 1 - overlapWeight * 0.045);
        const brightness = Math.max(0.88, 1 - overlapWeight * 0.06);
        const shadowOpacity = Math.min(0.2, 0.07 + overlapWeight * 0.05);

        card.style.transform = `scale(${scale})`;
        card.style.filter = `brightness(${brightness})`;
        card.style.boxShadow = `0 14px 45px -8px rgba(15, 23, 42, ${shadowOpacity})`;
      }

      setActiveStep(highestActive);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCardStack);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateCardStack();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="why-simatrix"
      className="scroll-mt-32 border-y border-slate-200/80 bg-white py-16 sm:py-24"
      aria-label="The Simatrix Standard"
    >
      <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16 xl:gap-24 items-start">
          {/* Left Column: Permanent Sticky Brand Statement */}
          <div className="lg:sticky lg:top-32 self-start pb-6">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              THE SIMATRIX STANDARD
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-[1.12]">
              Software engineering cannot be learned through slides.
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-lg">
              Most courses optimize for quick quizzes and certificates. Simatrix is built around the actual friction of software craftsmanship: debugging live errors, architecting clean code, and shipping work you can defend in interviews.
            </p>

            {/* Active Stack Step Indicators */}
            <div className="mt-8 flex items-center gap-2">
              {SIMATRIX_PRINCIPLES.map((p, idx) => (
                <div
                  key={p.number}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === activeStep
                      ? "w-8 bg-amber-600"
                      : idx < activeStep
                      ? "w-4 bg-slate-400"
                      : "w-3 bg-slate-200"
                  }`}
                />
              ))}
              <span className="ml-2 font-mono text-xs text-slate-400">
                Principle 0{activeStep + 1} of 0{SIMATRIX_PRINCIPLES.length}
              </span>
            </div>

            {/* Small line of supporting points at the bottom */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 flex items-center gap-3 font-mono text-[11px] sm:text-xs text-slate-500">
              <i className="ti ti-terminal text-slate-700 text-sm" />
              <span>Terminal-first · Peer-reviewed · Production standards</span>
            </div>
          </div>

          {/* Right Column: Scroll Stacking Cards */}
          <div className="relative pb-8">
            {SIMATRIX_PRINCIPLES.map((item, index) => {
              // Stacking offsets (110px base + 24px per card)
              const topOffset = 110 + index * 24;
              return (
                <div
                  key={item.number}
                  ref={(el) => (cardsRef.current[index] = el)}
                  style={{
                    top: `${topOffset}px`,
                    transformOrigin: "top center",
                    zIndex: index + 10,
                  }}
                  className="sticky rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-md transition-all duration-200 ease-out mb-24 sm:mb-32 last:mb-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-700">
                        Principle {item.number}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      0{index + 1} / 0{SIMATRIX_PRINCIPLES.length}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
                    <i className="ti ti-check text-emerald-600 font-bold text-sm" />
                    <span>{item.point}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCarousel({ onEnquiry }) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 639px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } else {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  const activeBanners = useMemo(() => {
    if (isMobile) {
      const mobileOnly = HERO_BANNERS.filter((b) => Boolean(b.mobileSrc)).map((b) => ({
        ...b,
        src: b.mobileSrc,
      }));
      return mobileOnly.length > 0 ? mobileOnly : HERO_BANNERS;
    }
    return HERO_BANNERS;
  }, [isMobile]);

  const isSingle = activeBanners.length <= 1;

  // Build slide list with boundary clones for infinite loop when multiple slides exist:
  // [Clone of Last, ...Banners, Clone of First]
  const extendedSlides = useMemo(() => {
    if (activeBanners.length <= 1) return activeBanners;
    const first = activeBanners[0];
    const last = activeBanners[activeBanners.length - 1];
    return [
      { ...last, keyId: `${last.id}-clone-start`, isClone: true, realIndex: activeBanners.length - 1 },
      ...activeBanners.map((b, i) => ({ ...b, keyId: b.id, isClone: false, realIndex: i })),
      { ...first, keyId: `${first.id}-clone-end`, isClone: true, realIndex: 0 },
    ];
  }, [activeBanners]);

  // Index 1 corresponds to activeBanners[0] when cloned; index 0 when single
  const [current, setCurrent] = useState(() => (activeBanners.length <= 1 ? 0 : 1));
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const hasDragged = useRef(false);
  const isAnimating = useRef(false);
  const containerRef = useRef(null);

  const realCurrent = useMemo(() => {
    if (isSingle) return 0;
    if (current <= 0) return activeBanners.length - 1;
    if (current >= extendedSlides.length - 1) return 0;
    return current - 1;
  }, [current, isSingle, activeBanners.length, extendedSlides.length]);

  // Sync current index when switching between single and multiple banners
  useEffect(() => {
    setCurrent(activeBanners.length <= 1 ? 0 : 1);
  }, [activeBanners.length]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // When transition was disabled for instant boundary reset, re-enable it on next animation frame
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Safety fallback for isAnimating flag in case transitionend is interrupted
  useEffect(() => {
    if (isAnimating.current) {
      const timer = setTimeout(() => {
        isAnimating.current = false;
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [current]);

  // Autoplay (only when multiple slides exist) - swipe each 3 seconds, stop on hover
  useEffect(() => {
    if (isSingle || paused || tabHidden || isDragging || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      setWithTransition(true);
      setCurrent((val) => val + 1);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [isSingle, paused, tabHidden, isDragging]);

  const move = (direction) => {
    if (isSingle || isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setCurrent((val) => val + direction);
    setTimeout(() => {
      isAnimating.current = false;
    }, 450);
  };

  // Seamless jump when reaching boundary clones
  const handleTransitionEnd = (e) => {
    if (isSingle || e.target !== e.currentTarget) return;
    isAnimating.current = false;

    if (current >= extendedSlides.length - 1) {
      // Reached clone of first slide -> snap instantly to real first slide
      setWithTransition(false);
      setCurrent(1);
    } else if (current <= 0) {
      // Reached clone of last slide -> snap instantly to real last slide
      setWithTransition(false);
      setCurrent(extendedSlides.length - 2);
    }
  };

  // Unified Pointer Events (works for both mouse cursor on desktop and finger touch on mobile)
  const handlePointerDown = (e) => {
    if (isSingle) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (isAnimating.current) return;
    startX.current = e.clientX;
    setIsDragging(true);
    hasDragged.current = false;
    setDragOffset(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) { }
  };

  const handlePointerMove = (e) => {
    if (isSingle || !isDragging) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 8) {
      hasDragged.current = true;
    }
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const clamped = Math.max(-containerWidth, Math.min(containerWidth, diff));
    setDragOffset(clamped);
  };

  const handlePointerUp = (e) => {
    if (isSingle || !isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) { }

    const threshold = 50;
    if (dragOffset < -threshold) {
      // Swiped left -> move to next
      isAnimating.current = true;
      setWithTransition(true);
      setCurrent((val) => val + 1);
    } else if (dragOffset > threshold) {
      // Swiped right -> move to previous
      isAnimating.current = true;
      setWithTransition(true);
      setCurrent((val) => val - 1);
    } else {
      // Snapped back
      setWithTransition(true);
    }
    setDragOffset(0);

    // Reset hasDragged after a brief delay so click handler can block unwanted link navigation during drag
    setTimeout(() => {
      hasDragged.current = false;
    }, 80);
  };

  const handlePointerCancel = () => {
    if (isSingle) return;
    setIsDragging(false);
    setDragOffset(0);
    setWithTransition(true);
    hasDragged.current = false;
  };

  return (
    <section
      className="relative w-full bg-white"
      aria-label="Simatrix Featured Announcements"
    >
      <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-0 sm:px-6 lg:px-8 xl:px-10 sm:pt-4 sm:pb-2">
        <div
          ref={containerRef}
          tabIndex={isSingle ? -1 : 0}
          className={`group relative w-full overflow-hidden bg-white sm:rounded-2xl lg:rounded-3xl outline-none select-none ${isSingle ? "" : isDragging ? "cursor-grabbing touch-pan-y" : "cursor-grab touch-pan-y"
            }`}
          aria-roledescription="carousel"
          aria-label="Simatrix opportunities"
          onKeyDown={(e) => {
            if (isSingle) return;
            if (e.key === "ArrowLeft") move(-1);
            if (e.key === "ArrowRight") move(1);
          }}
          onMouseEnter={() => !isSingle && setPaused(true)}
          onMouseLeave={() => !isSingle && setPaused(false)}
          onPointerEnter={() => !isSingle && setPaused(true)}
          onPointerLeave={() => !isSingle && setPaused(false)}
          onFocusCapture={() => !isSingle && setPaused(true)}
          onBlurCapture={(e) => {
            if (!isSingle && !e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
          onPointerDown={isSingle ? undefined : handlePointerDown}
          onPointerMove={isSingle ? undefined : handlePointerMove}
          onPointerUp={isSingle ? undefined : handlePointerUp}
          onPointerCancel={isSingle ? undefined : handlePointerCancel}
        >
          {/* Banner Slides Track */}
          <div
            className="flex motion-reduce:transition-none"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: isSingle ? "none" : `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
              transition: isSingle || isDragging || !withTransition ? "none" : "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {extendedSlides.map((banner, index) => {
              const isCurrent = isSingle ? true : index === current;
              return (
                <article
                  key={banner.keyId || `${banner.id}-${index}`}
                  className="relative w-full shrink-0 aspect-square sm:aspect-[1535/353]"
                  aria-hidden={!isCurrent}
                  inert={!isCurrent ? "" : undefined}
                >
                  <Link
                    to={banner.to}
                    onClick={(e) => {
                      if (hasDragged.current) {
                        e.preventDefault();
                      }
                    }}
                    className="block h-full w-full select-none focus:outline-none"
                    aria-label={banner.title}
                    tabIndex={isCurrent ? 0 : -1}
                    draggable="false"
                  >
                    <ResponsiveImage
                      src={banner.src}
                      alt={banner.alt}
                      priority={isSingle ? true : index === 1}
                      widths={isMobile ? [360, 480, 640, 768, 1080, 1254] : [480, 768, 1080, 1440, 1535, 1920, 2560]}
                      sizes="100vw"
                      forceCloudflare={true}
                      className="h-full w-full object-cover object-center select-none pointer-events-none"
                      draggable="false"
                    />
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Navigation Arrows (Reveal on Hover) */}
          {!isSingle && (
            <>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  move(-1);
                }}
                aria-label="Previous slide"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.18)] backdrop-blur-md border border-white/60 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out hover:bg-white hover:text-blue-600 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:opacity-100 cursor-pointer"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  move(1);
                }}
                aria-label="Next slide"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.18)] backdrop-blur-md border border-white/60 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out hover:bg-white hover:text-blue-600 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:opacity-100 cursor-pointer"
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {!isSingle && (
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              className="absolute bottom-2 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex h-3.5 sm:h-4 items-center gap-1 sm:gap-1.5 rounded-full bg-black/25 px-1.5 sm:px-2 backdrop-blur-xs border border-white/10 shadow-xs transition-all duration-300"
            >
              {activeBanners.map((banner, idx) => (
                <button
                  key={banner.id || idx}
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (idx === realCurrent) return;
                    isAnimating.current = true;
                    setWithTransition(true);
                    setCurrent(idx + 1);
                    setTimeout(() => {
                      isAnimating.current = false;
                    }, 450);
                  }}
                  className="flex h-full items-center justify-center p-0.5 cursor-pointer border-0 bg-transparent outline-none focus:outline-none appearance-none leading-none"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${idx === realCurrent
                        ? "h-1 w-3.5 sm:h-1.5 sm:w-4.5 bg-white shadow-xs"
                        : "h-1 w-1 sm:h-1.5 sm:w-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroActionHub({ onEnquiry }) {
  return (
    <section className="bg-slate-50/50 pt-4 pb-3 sm:pt-5 sm:pb-3.5 border-b border-slate-100">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* Action Buttons: Clean, Human-Crafted, On-Brand */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* 1. Primary Solid Brand Button */}
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <span>Explore All Courses</span>
            <i className="ti ti-arrow-right text-xs" />
          </Link>

          {/* 2. Secondary White Demo Button */}
          <button
            type="button"
            onClick={() => onEnquiry("demo")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] cursor-pointer"
          >
            <i className="ti ti-calendar text-slate-500" />
            <span>Book Free 1:1 Demo</span>
          </button>

          {/* 3. Placement Records */}
          <Link
            to="/placement"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
          >
            <i className="ti ti-trophy text-amber-600" />
            <span>Placement Records</span>
          </Link>
        </div>

        {/* Clean, Non-distracting Trust Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <i className="ti ti-code text-slate-400 text-sm" />
            100% Practical Labs
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ti ti-users text-slate-400 text-sm" />
            1-on-1 Mentor Guidance
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ti ti-circle-check text-emerald-600 text-sm" />
            500+ Students Placed
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ti ti-map-pin text-slate-400 text-sm" />
            Virudhunagar Campus
          </span>
        </div>
      </div>
    </section>
  );
}

const TOP_FAQS = [
  {
    id: "faq-1",
    num: "01",
    question: "Am I eligible to join if I don't have a CS background?",
    answer: "Yes! Our programs start with foundational concepts and build up to advanced modules. They are designed for beginners, engineering and arts & science graduates, and working professionals switching to IT.",
    actionText: "Explore Courses & Syllabi",
    actionTo: "/courses",
  },
  {
    id: "faq-2",
    num: "02",
    question: "Do you offer offline lab sessions as well as online classes?",
    answer: "Yes. We offer fully equipped physical computer labs at our Virudhunagar campus with daily trainer mentoring, as well as live interactive online batches with recorded sessions.",
  },
  {
    id: "faq-3",
    num: "03",
    question: "Is there a free internship program available?",
    answer: "Yes! We offer a Free Full-Stack Internship for eligible college students and freshers focusing on practical exercises, guided project exposure, and interview readiness.",
    actionText: "Apply for Free Internship",
    actionEnquiry: "internship",
  },
  {
    id: "faq-4",
    num: "04",
    question: "What kind of placement support do students receive?",
    answer: "Every student builds 2–4 verified GitHub portfolio projects, goes through technical mock interviews and resume reviews, and gets direct interview referrals with hiring partners.",
    actionText: "View Placement Assistance",
    actionTo: "/placement",
  },
  {
    id: "faq-5",
    num: "05",
    question: "Where is Simatrix Academy located and how do I visit?",
    answer: "Our campus is at 1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001. You can walk in for a lab tour or meet our mentors in person.",
  },
];

function FaqSection({ toEnquiry }) {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="scroll-mt-24 border-t border-slate-200/80 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] items-start">
          {/* Left Column: Editorial Style Header */}
          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-700">
              Support &amp; Help
            </p>

            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 leading-none">
              Common
              <span className="block font-serif italic text-3xl sm:text-4xl text-amber-600 font-normal capitalize mt-1">
                queries
              </span>
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-slate-600 max-w-sm">
              Find answers to the most frequent questions about our courses, booking a campus tour, and placement support.
            </p>

            <div className="mt-8">
              <a
                href="https://wa.me/919363793954?text=Hi%20Simatrix%20Academy%2C%20I%20have%20a%20question%20about%20your%20courses."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-950 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[.18em] text-slate-950 transition hover:bg-slate-950 hover:text-white shadow-2xs"
              >
                <span>Ask a unique question</span>
                <i className="ti ti-arrow-up-right text-xs" />
              </a>
            </div>
          </div>

          {/* Right Column: Clean Numbered Questions */}
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {TOP_FAQS.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-start justify-between gap-4 py-5 sm:py-6 text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-slate-400 group-hover:text-amber-600 transition">
                        {faq.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 group-hover:text-amber-700 transition leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <span className="ml-4 shrink-0 text-xl font-light text-slate-400 group-hover:text-slate-900 transition-colors">
                      <i className={isOpen ? "ti ti-minus" : "ti ti-plus"} />
                    </span>
                  </button>

                  {/* Smooth Animated Accordion Body */}
                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden pl-8 sm:pl-12">
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600 pr-6">
                        {faq.answer}
                      </p>

                      {faq.actionText && (
                        <div className="mt-3">
                          {faq.actionTo ? (
                            <Link
                              to={faq.actionTo}
                              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
                            >
                              <span>{faq.actionText}</span>
                              <i className="ti ti-arrow-right text-[11px]" />
                            </Link>
                          ) : faq.actionEnquiry ? (
                            <button
                              type="button"
                              onClick={() => toEnquiry?.(faq.actionEnquiry)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                            >
                              <span>{faq.actionText}</span>
                              <i className="ti ti-arrow-right text-[11px]" />
                            </button>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [enquiryIntent, setEnquiryIntent] = useState("guidance");
  const [scrollProgress, setScrollProgress] = useState(0);
  const enquiryRef = useRef(null);
  const mainRef = useRef(null);

  useSeo({
    title: "No.1 Software Training Institute in Virudhunagar | Simatrix Academy",
    description: "Best software training institute in Virudhunagar with 100% placement support. Learn Python, Java, Full Stack, Data Analytics, Cloud & AI with hands-on projects and expert mentors at Simatrix Academy.",
    canonical: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Simatrix Academy",
      alternateName: ["Simatrix", "Simatrix Academy Virudhunagar"],
      url: "https://www.simatrixacademy.com",
      logo: "https://www.simatrixacademy.com/logos/simatrix_logo.png",
      description: "No.1 software training institute in Virudhunagar offering Python, Java, Full Stack, Data Analytics, Cloud and AI courses with 100% placement support.",
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
      sameAs: [
        "https://www.google.com/maps/search/?api=1&query=Simatrix+Academy+Virudhunagar+AA+Road",
      ],
    },
  });

  /* Injected FAQPage Schema for Google Rich Snippets on Homepage */
  useEffect(() => {
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "home-faq");
    script.text = JSON.stringify(faqLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  useEffect(() => {
    let active = true;
    api.getSite().then((res) => active && setData(res.data)).catch((err) => active && setError(err.message));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(pageHeight > 0 ? Math.min(window.scrollY / pageHeight, 1) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [data]);

  useEffect(() => {
    if (!mainRef.current || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const sections = mainRef.current.querySelectorAll(":scope > section:not(:first-of-type)");
    sections.forEach((section) => section.classList.add("home-reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("home-reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [data]);

  const courses = useMemo(() => data?.categories?.flatMap((category) => category.courses || []) || [], [data]);
  const featured = useMemo(() => {
    if (!courses.length) return [];
    // Prioritize Simatrix flagship career tracks: Full Stack (MERN, MEAN, Python, Java), AI & Data Science, Cloud & DevOps
    const flagshipRank = (c) => {
      const slug = (c.slug || "").toLowerCase();
      const title = (c.title || "").toLowerCase();
      if (slug.includes("full-stack") || title.includes("full stack") || slug.includes("mern")) return 1;
      if (slug.includes("ai") || slug.includes("artificial") || title.includes("ai") || slug.includes("python") || title.includes("python")) return 2;
      if (slug.includes("cloud") || slug.includes("devops") || title.includes("cloud") || title.includes("aws")) return 3;
      if (slug.includes("cyber") || title.includes("cyber") || slug.includes("security")) return 4;
      if (slug.includes("data") || title.includes("data science")) return 5;
      if (c.featured || c.is_featured) return 6;
      return 10;
    };
    return [...courses].sort((a, b) => flagshipRank(a) - flagshipRank(b)).slice(0, 8);
  }, [courses]);

  const testimonials = data?.testimonials?.length ? data.testimonials : STORIES;
  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);

  const toEnquiry = (intent = "guidance") => {
    if (intent === "demo") {
      setAdvisorModalOpen(true);
      return;
    }
    setEnquiryIntent(typeof intent === "string" ? intent : "guidance");
    window.requestAnimationFrame(() => enquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main ref={mainRef} id="main-content" className="overflow-x-clip bg-white">
      {/* Career Advisory Modal (Scroll-triggered + Demo button) */}
      <CareerAdvisorModal
        isOpen={advisorModalOpen}
        onOpen={() => setAdvisorModalOpen(true)}
        onClose={() => setAdvisorModalOpen(false)}
        courses={courses}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-transparent" aria-hidden="true">
        <span
          className="block h-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-brand-600 shadow-[0_0_12px_rgba(245,158,11,.45)]"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>
      <HeroCarousel onEnquiry={toEnquiry} />
      <HeroActionHub onEnquiry={toEnquiry} />

      {error && !data ? (
        <section className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10 py-20 text-center">
          <p className="text-slate-600">We couldn’t load the latest courses right now.</p>
          <Link to="/courses" className="mt-4 inline-flex font-bold text-brand-700">
            Browse courses
          </Link>
        </section>
      ) : (
        <>
          {/* Academic & Corporate Tie-Ups Marquee */}
          <TieUpsMarquee />

          {(!data || featured.length > 0) && (
            <section id="popular-programs" className="scroll-mt-32 bg-slate-50 py-20 sm:py-28">
              <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <SectionTitle
                    left
                    eyebrow="Flagship Programs"
                    title="Industry-ready career tracks"
                    description="Engineered for employability. Compare project outcomes, technical curriculum, and duration before getting started."
                  />
                  <div className="hidden md:flex items-center gap-2 pb-2">
                    <span className="text-xs font-semibold text-slate-500">Need foundations?</span>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 underline underline-offset-4"
                    >
                      Explore C, C++, Java &amp; more <i className="ti ti-arrow-right text-[10px]" />
                    </Link>
                  </div>
                </div>
                {!data ? (
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <CourseCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <PopularCoursesCarousel courses={featured} />
                )}
              </div>
            </section>
          )}
        </>
      )}



      {/* =========================================================================
          SECTION 1: "Skills That Get You Hired" (Tangible Outcomes)
          STATUS: HIDDEN (Do not delete - easily re-enable anytime)
          TO RE-ENABLE: Change "false && (" below to "true && ("
         ========================================================================= */}
      {false && (
        <section id="outcomes" className="scroll-mt-32 border-y border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Skills That Get You Hired</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Learn to build real software. Not just collect paper certificates.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Companies don&apos;t hire pieces of paper. They hire people who know how to build apps and solve problems. At Simatrix Academy in Virudhunagar, you don&apos;t just watch theory—you build real projects that prove you are ready for a tech job.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-xl text-blue-700">
                      <i className="ti ti-device-desktop" />
                    </span>
                    <h4 className="mt-3 font-bold text-slate-950">Real Apps You Can Show Online</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      Build 3 live websites and apps that open on any phone or laptop. Show interviewers real proof that your code works.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-xl text-purple-700">
                      <i className="ti ti-messages" />
                    </span>
                    <h4 className="mt-3 font-bold text-slate-950">Practice Job Interviews</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      Practice face-to-face coding interviews with our trainers before the real test. Speak clearly with zero fear.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
                      <i className="ti ti-user-check" />
                    </span>
                    <h4 className="mt-3 font-bold text-slate-950">Learn From Real Software Engineers</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      Learn directly from engineers who work in tech companies. They sit beside you and help you fix bugs every day.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-xl text-amber-700">
                      <i className="ti ti-briefcase" />
                    </span>
                    <h4 className="mt-3 font-bold text-slate-950">Job &amp; Placement Support</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      We build your resume, prepare you for company tests, and connect you with hiring IT companies across Tamil Nadu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Graduate Takeaway Checklist Card */}
              <div className="rounded-3xl border border-brand-200/70 bg-gradient-to-br from-brand-900 to-[#0b1528] p-7 text-white shadow-2xl sm:p-9">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                  <i className="ti ti-certificate" />
                  What You Walk Away With
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  Everything you hold in your hands when you finish:
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  You don&apos;t just finish a class. You leave with real proof that companies look for:
                </p>

                <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">
                  {[
                    "3+ Live, working apps running on your own web link",
                    "Your own GitHub profile full of real code you wrote",
                    "A clean software resume checked by senior tech leads",
                    "Real confidence to explain your code in any company interview",
                    "Official Simatrix Course Certificate + mentor recommendation",
                    "Direct entry to company job drives and our student hiring network",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <i className="ti ti-check text-xs font-bold" />
                      </span>
                      <span className="text-slate-200 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => toEnquiry("guidance")}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                  >
                    <span>Talk to a Mentor</span>
                    <i className="ti ti-arrow-right text-xs" />
                  </button>
                  <Link
                    to="/placement"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    <span>See Placement Support</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2: "Your Learning Journey" (A structured path from day one to tech job)
          STATUS: HIDDEN (Do not delete - easily re-enable anytime)
          TO RE-ENABLE: Change "false && (" below to "true && ("
         ========================================================================= */}
      {false && (
        <section id="learning-journey" className="scroll-mt-32 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="relative overflow-hidden rounded-3xl bg-[#0d1b32] p-8 sm:p-12 lg:p-14 shadow-2xl border border-slate-800">
              <SectionTitle
                dark
                eyebrow="Your learning journey"
                title="A structured path from day one to your first tech job"
                description="Every stage is intentionally designed so you never wonder what to work on next."
              />
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map(([number, title, text], index) => (
                  <div
                    key={number}
                    className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[.04] p-6 backdrop-blur-xs transition hover:border-amber-400/40 hover:bg-white/[.06]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-3xl font-bold text-amber-300">{number}</span>
                        {index < STEPS.length - 1 && (
                          <span className="hidden lg:flex items-center text-slate-500 font-mono text-xs">
                            Step 0{index + 1} → 0{index + 2}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
                      <p className="mt-2 text-xs leading-6 text-slate-300">{text}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] font-semibold text-amber-400">
                      <i className="ti ti-circle-check text-xs" />
                      <span>Phase Milestone</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Real Campus & Lab Environment (Virudhunagar) + Parent Trust */}
      <section id="learning-environment" className="scroll-mt-32 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* =========================================================================
              SECTION 3A: "Campus & Environment" (Physical computer labs & mentor assistance)
              STATUS: HIDDEN (Do not delete - easily re-enable anytime)
              TO RE-ENABLE: Change "false && (" below to "true && ("
             ========================================================================= */}
          {false && (
            <>
              <SectionTitle
                eyebrow="Campus & Environment"
                title="Learn in physical computer labs with mentor assistance"
                description="We believe programming is best learned when you are surrounded by fellow learners and dedicated trainers ready to debug with you."
              />

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
                    <i className="ti ti-device-desktop" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-slate-950">Dedicated High-Speed Labs</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Fully equipped computer workstations with development environments pre-configured so you focus on writing code from day one.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <i className="ti ti-map-pin" /> Virudhunagar Campus
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-2xl text-purple-700">
                    <i className="ti ti-user-check" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-slate-950">Daily In-Person Lab Mentors</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Stuck on a syntax error, CORS bug, or database migration? Trainers sit beside you to explain why the bug occurred and how to fix it.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                    <i className="ti ti-check" /> Zero waiting for tickets
                  </div>
                </div>

                <div className="relative mt-8 md:mt-0 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs">
                  <div className="absolute -top-16 right-6 z-10">
                    <Mascot
                      directions="/mascots/glasses-directions.webp"
                      reactions="/mascots/glasses-reactions.webp"
                      size={84}
                      label="Glasses Mascot"
                    />
                  </div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
                    <i className="ti ti-devices" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-slate-950">Flexible Classroom or Online</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Attend daily offline lab sessions or switch to live interactive classes online if you are a working professional or out of town.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <i className="ti ti-video" /> Recorded sessions available
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Parent & Student Trust Box (Uncommented & Active) */}
          <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-900 to-[#0b1528] p-6 text-white sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
                  <i className="ti ti-shield-heart" />
                  For Students &amp; Parents
                </div>
                <h4 className="mt-3 font-display text-xl font-bold sm:text-2xl">
                  Transparent guidance. Honest career advice. No false promises.
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-blue-100/80 sm:text-sm">
                  We believe parents and students deserve honest clarity. We provide weekly progress milestones, practical lab attendance records, and direct counsellor access without aggressive sales tactics.
                </p>
              </div>
              <div className="flex shrink-0 flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => toEnquiry("guidance")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-slate-950 transition hover:bg-blue-50 cursor-pointer"
                >
                  <span>Speak with a Counsellor</span>
                  <i className="ti ti-arrow-right text-xs" />
                </button>
                <a
                  href="tel:+919363793954"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  <i className="ti ti-phone text-xs" />
                  <span>+91 93637 93954</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "The Simatrix Standard" (Software engineering cannot be learned through slides)
          STATUS: HIDDEN (Do not delete - easily re-enable anytime)
          TO RE-ENABLE: Change "false && (" below to "true && ("
         ========================================================================= */}
      {false&& (
        <CommunitySection data={data} courses={courses} testimonials={testimonials} />
      )}

      {/* Learner Stories / Testimonials */}
      <section id="learner-stories" className="scroll-mt-32 relative bg-slate-50/40 py-16 sm:py-20 overflow-hidden border-y border-slate-100">
        <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <ModernLearnerStories testimonials={testimonials} />
        </div>
      </section>

      {/* 1-on-1 Career Guidance Section - Clean Editorial 2-Column Split */}
      <section
        ref={enquiryRef}
        id="enquiry"
        className="scroll-mt-28 border-t border-slate-200/80 bg-slate-50/70 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Reassurance & Context */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[.20em] text-slate-700 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                {enquiryIntent === "internship" ? "Internship Admissions" : "1-on-1 Career Guidance"}
              </div>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-950 leading-[1.15]">
                {enquiryIntent === "internship"
                  ? "Take the first step toward practical software experience."
                  : "Not sure which tech path matches your goal?"}
              </h2>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl">
                {enquiryIntent === "internship"
                  ? "Share your details so our academic leads can verify eligibility, walk you through the syllabus, and reserve your batch seat."
                  : "Just leave your details — we’ll help you choose. Speak directly with an experienced tech trainer to chart a realistic, pressure-free career roadmap."}
              </p>

              {/* Trust Points */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xs sm:text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-slate-900 text-xs">
                      <i className="ti ti-user-check" />
                    </span>
                    <span>Trainer, Not Sales Rep</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    Honest advice whether you are in college, non-IT switching, or upskilling.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xs sm:text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-slate-900 text-xs">
                      <i className="ti ti-file-text" />
                    </span>
                    <span>Syllabus &amp; Fee Clarity</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    Clear answers on course modules, batch schedules, and flexible payment plans.
                  </p>
                </div>
              </div>

              {/* Immediate Contact Reassurance */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="font-medium">Prefer an immediate conversation?</span>
                <a
                  href="tel:+919363793954"
                  className="inline-flex items-center gap-1.5 font-bold text-slate-950 hover:text-brand-700 transition"
                >
                  <i className="ti ti-phone text-brand-600 text-sm" />
                  <span>+91 93637 93954</span>
                </a>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">Virudhunagar Campus</span>
              </div>
            </div>

            {/* Right Column: Clean Focused Form Card */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-950">
                    {enquiryIntent === "internship" ? "Register Your Interest" : "Request a Mentor Callback"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Quick 10-second request · Free callback within 24 hours
                  </p>
                </div>

                <EnquiryForm courses={courses} compact type={enquiryIntent} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Training Locations Hub — (Hidden on Home page, moved to standalone route /software-training)
      <section className="border-t border-slate-200/80 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-amber-700">
                <span className="h-px w-7 bg-amber-600" />
                Regional Coverage
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                Software Training Across Virudhunagar District
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Simatrix Academy is the premier IT training destination for learners from all major towns in the district. Choose your location to see dedicated batch timings and travel directions.
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

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                city: "Virudhunagar",
                slug: "virudhunagar",
                badge: "Main Campus",
                desc: "Head office on AA Road with state-of-the-art computer labs, high-speed fiber internet, and daily hands-on mentor desks.",
                courses: "Python, Java, MERN, Data Analytics",
              },
              {
                city: "Sivakasi",
                slug: "sivakasi",
                badge: "25 km Away",
                desc: "35 mins direct bus ride. Popular among Sivakasi engineering and arts graduates seeking high-paying IT placements.",
                courses: "Full Stack, Python, Cloud, AI",
              },
              {
                city: "Rajapalayam",
                slug: "rajapalayam",
                badge: "40 km Away",
                desc: "Direct train and express bus connectivity. Live interactive online batches and weekend classroom options available.",
                courses: "Java Full Stack, Data Analytics, Python",
              },
              {
                city: "Srivilliputhur",
                slug: "srivilliputhur",
                badge: "35 km Away",
                desc: "Industry-grade software training replacing basic computer centers. End-to-end GitHub projects and interview coaching.",
                courses: "Python Full Stack, Power BI & SQL, Web Dev",
              },
              {
                city: "Aruppukottai",
                slug: "aruppukottai",
                badge: "18 km Away",
                desc: "Fast 20-minute bus commute via NH 38. Convenient morning and evening batches aligned with college schedules.",
                courses: "MERN Stack, Python, Data Analytics",
              },
              {
                city: "Sattur",
                slug: "sattur",
                badge: "24 km Away",
                desc: "25 mins via NH 44 highway. Career-focused curriculum with verified certificates and dedicated placement assistance.",
                courses: "Java, Python, Web Development",
              },
            ].map((loc) => (
              <Link
                key={loc.slug}
                to={`/software-training-in-${loc.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-md"
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
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Top Tracks:</span> {loc.courses}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* FAQs Section with Single-Open Accordion & Category Filters */}
      <FaqSection toEnquiry={toEnquiry} />
      <style>{`
        #main-content > section[class*="py-20"],
        #main-content > section[class*="py-24"],
        #main-content > section[class*="py-28"],
        #main-content > section[class*="py-16"],
        #main-content > section[class*="py-12"] {
          padding-top: 2.5rem;
          padding-bottom: 2.5rem;
        }
        #main-content > section:first-of-type { padding-top: 0; padding-bottom: 0; }
        #main-content > section:last-of-type { padding-bottom: 1.5rem; }
        #main-content > section .scroll-mt-32 { scroll-margin-top: 5rem; }
        @media (min-width: 640px) {
          #main-content > section[class*="py-20"],
          #main-content > section[class*="py-24"],
          #main-content > section[class*="py-28"],
          #main-content > section[class*="py-16"],
          #main-content > section[class*="py-12"] {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
        }
        @media (max-width: 640px) {
          #main-content > section[class*="py-20"],
          #main-content > section[class*="py-24"],
          #main-content > section[class*="py-28"],
          #main-content > section[class*="py-16"],
          #main-content > section[class*="py-12"] {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </main>
  );
}
