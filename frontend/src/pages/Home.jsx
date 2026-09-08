import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, mediaUrl } from "../api/client";
import { icon } from "../lib/icons";
import { ResponsiveImage } from "../components/ui";
import EnquiryForm from "../components/EnquiryForm";
import { useSeo } from "../lib/useSeo";
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const HERO_BANNERS = [
  {
    id: "banner-offer-20",
    src: "/banner/REF1.png",
    mobileSrc: "/banner/REF1_MOBILE.png",
    alt: "September Special Offer: Get 20% OFF Full Stack & AI Courses with hands-on projects and expert mentors",
    to: "/courses",
    title: "Get 20% OFF Full Stack & AI Courses",
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
    name: "Priya R.",
    course: "MERN Full Stack Development",
    category: "full-stack",
    avatar: avatar1,
    college: "KLN College of Engineering",
    batch: "2025 Graduate",
    role: "Placed as Junior Web Developer",
    headline: "From final-year confusion to a full-stack developer offer.",
    quote: "Before Simatrix, my college projects were mostly copied tutorial code. Here, mentors pushed us to build a full-stack e-commerce engine with real authentication, payment gateways, and Docker deployment. During my interview, I shared my live GitHub repo and defended the database schema with complete confidence.",
    highlight: "3 Live Full-Stack Apps Shipped",
    campus: "Madurai Campus",
    rating: 5,
  },
  {
    id: "story-2",
    name: "Karthik S.",
    course: "Python & AI Engineering",
    category: "ai",
    avatar: avatar2,
    college: "TCE Madurai",
    batch: "2025-2026 Batch",
    role: "AI / Data Science Associate",
    headline: "Trainers explain complex ML pipelines simply. The code reviews were invaluable.",
    quote: "Moving from basic Python syntax to training LLM embeddings and writing production FastAPI endpoints gave me a genuine portfolio. The trainers don't just lecture—they sit with you in the lab to debug Tensor errors and optimize model latency.",
    highlight: "FastAPI & LLM Model Deployment",
    campus: "Virudhunagar Center",
    rating: 5,
  },
  {
    id: "story-3",
    name: "Divya M.",
    course: "Cloud & DevOps Engineering",
    category: "cloud",
    avatar: avatar3,
    college: "Sethu Institute of Technology",
    batch: "2025 Graduate",
    role: "Cloud Operations Associate",
    headline: "Physical lab access with real server equipment made all the difference.",
    quote: "Online video courses never give you real server muscle memory. Setting up CI/CD pipelines, Kubernetes clusters, and AWS VPCs in the Simatrix computer lab gave me practical skills that directly matched the job requirements in my technical interview.",
    highlight: "AWS Certified & Docker CI/CD",
    campus: "Madurai Campus",
    rating: 5,
  },
  {
    id: "story-4",
    name: "Sanjay Kumar",
    course: "Cybersecurity & Ethical Hacking",
    category: "cybersecurity",
    avatar: avatar2,
    college: "Kamaraj College of Engg",
    batch: "2025 Batch",
    role: "Junior SOC Analyst",
    headline: "Hands-on packet analysis and network security labs you cannot get from slides.",
    quote: "The practical defensive labs, Wireshark packet captures, and vulnerability scanning exercises gave me practical experience that impressed the hiring panel. The placement team also conducted 3 rounds of mock technical interviews before my drive.",
    highlight: "SOC Lab & Penetration Testing",
    campus: "Madurai Campus",
    rating: 5,
  },
  {
    id: "story-5",
    name: "Anitha Balan",
    course: "Full Stack JavaScript / React",
    category: "full-stack",
    avatar: avatar1,
    college: "Fatima College, Madurai",
    batch: "BCA Fresher",
    role: "Frontend Engineer Intern",
    headline: "As a non-engineering student, the step-by-step guidance removed all self-doubt.",
    quote: "Coming from a non-engineering degree, I was intimidated by modern frameworks. The mentors at Simatrix took me from HTML fundamentals to building full-scale Next.js web applications with TypeScript. The 1-on-1 lab support is unmatched.",
    highlight: "Next.js & Tailwind SaaS App",
    campus: "Madurai Campus",
    rating: 5,
  },
  {
    id: "story-6",
    name: "Vigneshwaran P.",
    course: "Data Analytics & Power BI",
    category: "ai",
    avatar: avatar3,
    college: "Mepco Schlenk Engg College",
    batch: "Career Switcher",
    role: "Business Intelligence Analyst",
    headline: "Transitioned from a non-tech sales job to a BI analyst role in 4 months.",
    quote: "I wanted to transition into IT without starting from zero. Simatrix gave me a structured track covering advanced SQL, Python data pipelines, and interactive executive dashboards. The career counsellors helped me rework my resume to highlight transferable problem-solving skills.",
    highlight: "Interactive Power BI Dashboards",
    campus: "Virudhunagar Center",
    rating: 5,
  },
  {
    id: "story-7",
    name: "Harish Roshan",
    course: "Free Full-Stack Internship",
    category: "full-stack",
    avatar: avatar2,
    college: "PSNA College of Engg",
    batch: "Final-Year B.Tech",
    role: "Software Intern @ Startup",
    headline: "The free internship gave me live sprint experience before campus placements.",
    quote: "Most college internships are just certificate rubber-stamps. At Simatrix, we had daily standups, Git branch reviews, and sprint deadlines. That tangible experience was the single biggest talking point during my on-campus placement interview.",
    highlight: "Sprint-Based Team Development",
    campus: "Madurai Campus",
    rating: 5,
  },
  {
    id: "story-8",
    name: "Ravi Chandran",
    course: "Cloud Infrastructure & Linux",
    category: "cloud",
    avatar: avatar3,
    college: "Anna University Regional Campus",
    batch: "2024 Graduate",
    role: "Systems & Cloud Engineer",
    headline: "The placement support doesn't end until you receive a verified offer letter.",
    quote: "Even after course completion, the placement desk arranged direct interviews with partner IT firms in Madurai and Chennai. Their resume optimization helped my profile pass ATS screening, and the mock HR rounds helped me negotiate my offer with confidence.",
    highlight: "Placed at Chennai IT Hub",
    campus: "Madurai Campus",
    rating: 5,
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
    answer: "Yes. We offer fully equipped physical classroom training with dedicated computer labs at our Madurai and Virudhunagar centers, as well as interactive live online batches with screen-sharing, mentor debugging, and recorded sessions.",
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

function getCourseImage(course) {
  if (course?.image) {
    if (course.image.startsWith("/") || course.image.startsWith("http")) {
      return course.image;
    }
    return mediaUrl(course.image);
  }
  const slug = (course?.slug || "").toLowerCase();
  const title = (course?.title || "").toLowerCase();

  if (slug.includes("data-science") || title.includes("data science") || slug.includes("data-analytics")) {
    return "/courses/MasterDataScienceCourseWithIitmPravartakCertification310.webp";
  }
  if (slug.includes("ai") || slug.includes("artificial") || title.includes("machine learning") || slug.includes("machine-learning")) {
    return "/courses/ArtificialIntelligenceMachineLearningCertifiedByIntelIitmPravartak334.webp";
  }
  if (slug.includes("gen-ai") || slug.includes("python") || slug.includes("software")) {
    return "/courses/GenAiSoftwareDevelopmentProgramCertifiedByMongodbIitmPravartak334.webp";
  }
  if (slug.includes("mern") || slug.includes("mean") || slug.includes("full-stack") || title.includes("full stack")) {
    return "/courses/FullStackDevelopmentCourseWithAiTools310.webp";
  }
  if (slug.includes("uiux") || slug.includes("ui-ux") || slug.includes("design") || slug.includes("mobile") || slug.includes("flutter") || slug.includes("android") || slug.includes("react-native")) {
    return "/courses/UiuxDesignCourse310.webp";
  }
  if (slug.includes("devops") || slug.includes("cloud") || slug.includes("aws") || slug.includes("azure") || slug.includes("security") || slug.includes("cyber") || slug.includes("ccna")) {
    return "/courses/DevopsCourse310.webp";
  }
  if (slug.includes("marketing") || slug.includes("business") || slug.includes("analytics") || slug.includes("sap")) {
    return "/courses/BusinessAndMarketingAnalyticsWithAiTools310.webp";
  }

  return "/courses/FullStackDevelopmentCourseWithAiTools310.webp";
}

function CourseTile({ course }) {
  const courseImg = getCourseImage(course);

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group relative mx-auto flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/80 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-blue-500"
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

          <h3 className="mt-2.5 font-display text-base sm:text-lg font-bold leading-snug text-slate-950 transition-colors group-hover:text-blue-600 line-clamp-1">
            {course.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
            {course.summary || `Hands-on ${course.title} training with guided labs and industry-oriented projects.`}
          </p>
        </div>

        {/* Explore Program CTA Bar */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-blue-600">
          <span className="transition-colors group-hover:text-blue-700">
            Explore Program
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white">
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
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
          >
            <CourseTile course={course} />
          </div>
        ))}
      </div>

      {/* Navigation Controls in Simatrix Blue/Dark Style */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous courses"
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 active:scale-95 cursor-pointer"
          >
            <i className="ti ti-arrow-left text-sm" />
          </button>

          {/* Dots Indicator in Simatrix Blue */}
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
                  className={`block rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? "h-2 w-6 bg-blue-600 shadow-xs"
                      : "h-2 w-2 bg-slate-200 hover:bg-blue-200"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next courses"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#0b1528] text-white shadow-md shadow-brand-950/20 transition hover:bg-blue-600 active:scale-95 cursor-pointer"
          >
            <i className="ti ti-arrow-right text-sm" />
          </button>
        </div>

        {/* Explore All Courses Button */}
        <Link
          to="/courses"
          className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0b1528] px-6 text-xs font-bold text-white shadow-sm transition hover:bg-blue-600"
        >
          <span>Explore All 20+ Courses</span>
          <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function ModernLearnerStories({ testimonials = [] }) {
  const curatedStories = useMemo(() => {
    const list = [
      {
        id: "curated-1",
        name: "Priya R.",
        role: "Junior Web Developer",
        track: "Full Stack",
        avatar: avatar1,
        quote: "Before Simatrix, my projects were mostly copied tutorial code. Mentors helped me build an e-commerce engine with Docker and live payments that impressed interviewers.",
        rating: 5,
      },
      {
        id: "curated-2",
        name: "Karthik S.",
        role: "AI & Data Science Associate",
        track: "Python & AI",
        avatar: avatar2,
        quote: "Moving from basic Python to fine-tuning LLM embeddings and FastAPI endpoints gave me a genuine portfolio. The 1-on-1 mentor guidance in the lab was invaluable.",
        rating: 5,
      },
      {
        id: "curated-3",
        name: "Divya M.",
        role: "Cloud Operations Associate",
        track: "Cloud & DevOps",
        avatar: avatar3,
        quote: "Physical lab access with real server equipment made all the difference. Configuring CI/CD pipelines and AWS VPCs matched exactly what recruiters tested.",
        rating: 5,
      },
      {
        id: "curated-4",
        name: "Sanjay Kumar",
        role: "Junior SOC Analyst",
        track: "Cybersecurity",
        avatar: avatar2,
        quote: "The practical Wireshark packet captures and vulnerability scanning gave me hands-on confidence. The mock interview rounds prepared me thoroughly.",
        rating: 5,
      },
      {
        id: "curated-5",
        name: "Anitha Balan",
        role: "Frontend Engineer Intern",
        track: "React & TypeScript",
        avatar: avatar1,
        quote: "Coming from a non-engineering degree, the step-by-step mentoring removed all self-doubt. The trainers took me from basics to shipping full React web apps.",
        rating: 5,
      },
      {
        id: "curated-6",
        name: "Harish Roshan",
        role: "Software Intern @ Startup",
        track: "Full Stack Track",
        avatar: avatar3,
        quote: "Most internships are certificate rubber-stamps. At Simatrix, we had daily standups, Git branch reviews, and sprint deadlines that recruiters loved.",
        rating: 5,
      },
    ];

    if (testimonials?.length && testimonials !== STORIES) {
      const dynamicList = testimonials
        .filter((t) => t?.quote || t?.content)
        .map((t, idx) => {
          const avatars = [avatar1, avatar2, avatar3];
          return {
            id: `dyn-${t.id || idx}`,
            name: t.name || "Student",
            role: t.designation || "Simatrix Graduate",
            track: t.course || "Technical Track",
            avatar: t.avatar || avatars[idx % avatars.length],
            quote: t.quote || t.content,
            rating: t.rating || 5,
          };
        });
      if (dynamicList.length >= 3) {
        return dynamicList;
      }
    }
    return list;
  }, [testimonials]);

  return (
    <div className="relative">
      {/* 1. Minimal Header (Clean, Monochromatic, Elegant) */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold tracking-wider text-slate-700 shadow-2xs">
          <i className="ti ti-star-filled text-amber-500 text-xs" />
          <span>Student Stories</span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
          Confidence built through practice.
        </h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
          Real feedback from graduates who built practical portfolio projects and launched their tech careers.
        </p>
      </div>

      {/* 2. Infinite Marquee Stream (Edge fade, pause on hover) */}
      <div className="reviews-marquee mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="reviews-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-5 pr-5" aria-hidden={copy === 1 ? "true" : undefined}>
              {curatedStories.map((item) => (
                <figure
                  key={`${copy}-${item.id}`}
                  className="group flex h-[230px] w-[310px] sm:w-[350px] shrink-0 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_24px_-6px_rgba(15,23,42,0.08)]"
                >
                  <div>
                    {/* Stars + Clean Quote Mark (Single-color gold stars, no rainbow) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                        {Array.from({ length: item.rating || 5 }).map((_, s) => (
                          <i key={s} className="ti ti-star-filled" />
                        ))}
                      </div>
                      <i className="ti ti-quote text-2xl text-slate-200" />
                    </div>

                    {/* Concise Quote */}
                    <blockquote className="mt-3 text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal line-clamp-4">
                      “{item.quote}”
                    </blockquote>
                  </div>

                  {/* Author Strip */}
                  <figcaption className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <strong className="truncate text-xs sm:text-[13px] font-semibold text-slate-950">{item.name}</strong>
                          <i className="ti ti-circle-check-filled text-emerald-500 text-xs shrink-0" title="Verified Student" />
                        </div>
                        <p className="truncate text-[11px] text-slate-500">{item.role}</p>
                      </div>
                    </div>
                    <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100 shrink-0">
                      {item.track}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Subtle Bottom Trust Strip */}
      <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-500">
        <span className="flex text-amber-400 text-xs">
          <i className="ti ti-star-filled" />
        </span>
        <span className="font-semibold text-slate-800">4.9 / 5.0 rating</span>
        <span className="text-slate-300">•</span>
        <span>Verified graduates across Madurai &amp; Virudhunagar</span>
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
          animation: reviews-scroll 35s linear infinite;
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

function CommunitySection({ data, courses, testimonials }) {
  const people = [avatar1, avatar2, avatar3];

  return (
    <section className="bg-white pb-12 pt-2 sm:pb-16 sm:pt-3" aria-labelledby="community-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header - Kept clean and authoritative */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">Why Simatrix</p>
          <h2 id="community-title" className="mt-3 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">
            You don’t have to learn alone.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Connect practical learning with 1-on-1 mentor guidance, production-style projects and verified career preparation.
          </p>
          <div className="mt-8 flex justify-center -space-x-3" aria-label="Simatrix learner community">
            {people.map((src) => (
              <img key={src} src={src} alt="" className="h-14 w-14 rounded-full border-4 border-white object-cover shadow-md" />
            ))}
            {["AK", "RS", "MP", "VK", "SN"].map((name, index) => (
              <span
                key={name}
                className={`grid h-14 w-14 place-items-center rounded-full border-4 border-white text-xs font-bold text-white shadow-md ${
                  ["bg-brand-700", "bg-amber-600", "bg-emerald-700", "bg-violet-700", "bg-slate-800"][index]
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* 1. Four Specific Differentiator Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 01: Industry-Aligned Curriculum */}
          <Link
            to="/courses"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-xl"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-school" />
                </span>
                <span className="font-mono text-sm font-semibold text-blue-400">01</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Industry-Aligned Curriculum
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Learn modern tech stacks, Git workflows, and CI/CD pipelines used by engineering teams.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                Explore Curriculum
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>

          {/* 02: Real-World Projects */}
          <Link
            to="/courses"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/80 hover:shadow-xl"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-code" />
                </span>
                <span className="font-mono text-sm font-semibold text-emerald-400">02</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Build a Real Portfolio
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Graduate with 3+ live GitHub applications you can demo and explain during technical interviews.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700">
                View Project Tracks
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>

          {/* 03: 1-on-1 Mentor Guidance */}
          <Link
            to="/career-guidance"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/80 hover:shadow-xl"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-users" />
                </span>
                <span className="font-mono text-sm font-semibold text-purple-400">03</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                1-on-1 Mentor Guidance
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Direct code reviews, live bug-fixing sessions and personalized learning roadmaps without passive watching.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 transition-colors group-hover:text-purple-700">
                Meet Our Mentors
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-purple-50 text-purple-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>

          {/* 04: Career & Placement Support */}
          <Link
            to="/placement"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/80 hover:shadow-xl"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-briefcase" />
                </span>
                <span className="font-mono text-sm font-semibold text-amber-500">04</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Placement &amp; Interview Support
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                ATS tech resume optimization, technical mock interview drill-downs, and verified employer connections.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition-colors group-hover:text-amber-700">
                Placement Support
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-50 text-amber-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>
        </div>

        {/* 2. Four Stats Cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
              <i className="ti ti-users" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">500+</strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Learners guided</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-50 text-2xl text-purple-600">
              <i className="ti ti-folders" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">50+</strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Real-world projects</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
              <i className="ti ti-stack-2" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">10+</strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Technology domains</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-2xl text-amber-600">
              <i className="ti ti-certificate" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">100%</strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Practical lab training</p>
            </div>
          </div>
        </div>

        {/* 3. Two Big Bento Cards: Support (with Lottie) & Tech Stacks */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Support Card with Lottie */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] sm:p-8">
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Always-on learning support
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-slate-950 sm:text-3xl">
                  Questions become progress when you can discuss them.
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Learn through mentor feedback, peer conversations, project reviews and structured career preparation.
                </p>
                <div className="mt-6">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0b1528] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-900"
                  >
                    <span>Get Started</span>
                    <i className="ti ti-arrow-right text-xs" />
                  </Link>
                </div>
              </div>

              {/* Lottie Animation (Share.lottie) */}
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-full max-w-[280px] sm:h-56">
                  <DotLottieReact
                    src="/Lottie/Share.lottie"
                    loop
                    autoplay
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2.5 text-xs font-bold text-slate-800">Connect with our community</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://discord.gg"
                    target="_blank"
                    rel="noreferrer"
                    title="Discord"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#5865F2] shadow-xs transition hover:border-[#5865F2] hover:bg-[#5865F2]/10"
                  >
                    <i className="ti ti-brand-discord text-lg" />
                  </a>
                  <a
                    href="https://wa.me/919363793954"
                    target="_blank"
                    rel="noreferrer"
                    title="WhatsApp"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#25D366] shadow-xs transition hover:border-[#25D366] hover:bg-[#25D366]/10"
                  >
                    <i className="ti ti-brand-whatsapp text-lg" />
                  </a>
                  <a
                    href="https://instagram.com/simatrixacademy"
                    target="_blank"
                    rel="noreferrer"
                    title="Instagram"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#E4405F] shadow-xs transition hover:border-[#E4405F] hover:bg-[#E4405F]/10"
                  >
                    <i className="ti ti-brand-instagram text-lg" />
                  </a>
                  <a
                    href="https://linkedin.com/company/simatrixacademy"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#0A66C2] shadow-xs transition hover:border-[#0A66C2] hover:bg-[#0A66C2]/10"
                  >
                    <i className="ti ti-brand-linkedin text-lg" />
                  </a>
                  <a
                    href="https://youtube.com/@simatrixacademy"
                    target="_blank"
                    rel="noreferrer"
                    title="YouTube"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#FF0000] shadow-xs transition hover:border-[#FF0000] hover:bg-[#FF0000]/10"
                  >
                    <i className="ti ti-brand-youtube text-lg" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <i className="ti ti-shield-check text-lg" />
                </span>
                <div className="text-[11px] leading-tight">
                  <p className="font-semibold text-slate-700">Mentor-guided • Peer-driven • Project-focused</p>
                  <p className="mt-0.5 font-bold text-blue-700">Career-ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Tech Stack Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#050b18] p-7 text-white shadow-2xl sm:p-8">
            {/* Ambient Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl"
            />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 sm:text-[11px]">
                Build with relevant tools
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">
                From foundations to modern technology stacks.
              </h3>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                Explore technologies through guided courses and combine them into portfolio-ready projects.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {/* Row 1: 7 technologies */}
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                {TECH_ROW_1.map((item) => (
                  <div
                    key={item.name}
                    title={`${item.name} — ${item.detail}`}
                    className="group/tech flex h-16 cursor-default flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-1 transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.09] sm:h-18"
                  >
                    <span className="flex h-7 w-7 items-center justify-center text-xl sm:text-2xl">
                      {item.icon}
                    </span>
                    <span className="mt-1 text-[10px] font-medium tracking-tight text-slate-300 group-hover/tech:text-white">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 2: 7 technologies */}
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                {TECH_ROW_2.map((item) => (
                  <div
                    key={item.name}
                    title={`${item.name} — ${item.detail}`}
                    className="group/tech flex h-16 cursor-default flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-1 transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.09] sm:h-18"
                  >
                    <span className="flex h-7 w-7 items-center justify-center text-xl sm:text-2xl">
                      {item.icon}
                    </span>
                    <span className="mt-1 text-[10px] font-medium tracking-tight text-slate-300 group-hover/tech:text-white">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
              >
                <span>Explore All Technologies</span>
                <i className="ti ti-arrow-right text-xs" />
              </Link>

              {/* Handwritten "Learn Build Belong ↗" watermark */}
              <div className="select-none text-right font-caveat text-sm leading-tight text-slate-300 sm:text-base -rotate-3">
                <p className="tracking-wide">Learn</p>
                <p className="tracking-wide pl-1">Build</p>
                <p className="flex items-center justify-end gap-1 font-bold tracking-wide text-white">
                  <span>Belong</span>
                  <span className="text-base sm:text-lg">↗</span>
                </p>
              </div>
            </div>
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

  // Autoplay (only when multiple slides exist)
  useEffect(() => {
    if (isSingle || paused || tabHidden || isDragging || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      setWithTransition(true);
      setCurrent((val) => val + 1);
    }, 6000);
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
    } catch (_) {}
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
    } catch (_) {}

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
      <div
        ref={containerRef}
        tabIndex={isSingle ? -1 : 0}
        className={`group relative w-full overflow-hidden bg-white outline-none select-none ${
          isSingle ? "" : isDragging ? "cursor-grabbing touch-pan-y" : "cursor-grab touch-pan-y"
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
                className="relative w-full shrink-0 aspect-square sm:aspect-auto h-auto sm:h-[220px] md:h-[300px] lg:h-[400px] max-h-[85vh]"
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
                    widths={isMobile ? [360, 480, 640, 768, 1080, 1254] : [480, 768, 1080, 1440, 1920, 2120]}
                    sizes="100vw"
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
                  className={`block rounded-full transition-all duration-300 ${
                    idx === realCurrent
                      ? "h-1 w-3.5 sm:h-1.5 sm:w-4.5 bg-white shadow-xs"
                      : "h-1 w-1 sm:h-1.5 sm:w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FaqSection({ toEnquiry }) {
  const [openId, setOpenId] = useState("faq-1");
  const [activeCategory, setActiveCategory] = useState("All Questions");

  const filteredFaqs = useMemo(() => {
    if (activeCategory === "All Questions") return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="scroll-mt-32 border-t border-slate-200/80 bg-slate-50/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          {/* Left Column: Heading & Enhanced Quick Help Desk */}
          <div>
            <SectionTitle
              left
              eyebrow="Before you decide"
              title="Frequently asked questions"
              description="Clear expectations make it easier to choose your learning path with confidence."
            />

            {/* Quick Contact Card for unresolved questions */}
            <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-xl text-brand-700 shadow-2xs">
                  <i className="ti ti-help" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Counsellors Active
                </span>
              </div>

              <h4 className="mt-4 font-display text-lg font-bold text-slate-950">Have a different question?</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Our counsellors are available to answer fee queries, batch timings, or syllabus details directly.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href="https://wa.me/919363793954?text=Hi%20Simatrix%20Academy%2C%20I%20have%20a%20question%20about%20your%20courses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                >
                  <i className="ti ti-brand-whatsapp text-sm" />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href="tel:+919363793954"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-100"
                >
                  <i className="ti ti-phone text-sm text-brand-700" />
                  <span>+91 93637 93954</span>
                </a>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3.5 space-y-2">
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <i className="ti ti-clock text-xs text-amber-600 shrink-0" />
                  <span>Avg response: &lt;20 mins (9:00 AM – 7:30 PM IST)</span>
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <i className="ti ti-map-pin text-xs text-blue-600 shrink-0" />
                  <span>Walk-in lab tour at Virudhunagar &amp; Madurai centers.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Category Tabs + Accordion */}
          <div>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-5">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const count = cat === "All Questions" ? FAQ_ITEMS.length : FAQ_ITEMS.filter((i) => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-brand-900 text-white shadow-xs"
                        : "border border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Accordion Items */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 ${
                      isOpen
                        ? "border-brand-500/50 bg-white shadow-md shadow-brand-900/5 ring-1 ring-brand-500/15"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 font-mono text-xs font-bold text-slate-400 group-hover:text-brand-600 transition">
                          {faq.num}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                              {faq.tag}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 sm:text-base leading-snug group-hover:text-brand-800 transition">
                            {faq.question}
                          </h4>
                        </div>
                      </div>
                      <span
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? "bg-brand-700 text-white rotate-180 shadow-xs"
                            : "bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-700"
                        }`}
                      >
                        <i className="ti ti-chevron-down text-sm" />
                      </span>
                    </button>

                    {/* Smooth Animated Accordion Body */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 ml-8">
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                            {faq.answer}
                          </p>

                          {/* Contextual Action Pill if provided */}
                          {faq.actionText && (
                            <div className="mt-3.5 pt-2 flex items-center">
                              {faq.actionTo ? (
                                <Link
                                  to={faq.actionTo}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
                                >
                                  <span>{faq.actionText}</span>
                                  <i className="ti ti-arrow-right text-xs" />
                                </Link>
                              ) : faq.actionEnquiry ? (
                                <button
                                  type="button"
                                  onClick={() => toEnquiry?.(faq.actionEnquiry)}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                                >
                                  <span>{faq.actionText}</span>
                                  <i className="ti ti-arrow-right text-xs" />
                                </button>
                              ) : faq.actionHref ? (
                                <a
                                  href={faq.actionHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
                                >
                                  <span>{faq.actionText}</span>
                                  <i className="ti ti-arrow-up-right text-xs" />
                                </a>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
    title: "Simatrix Academy | Build Skills That Lead to Tech Careers",
    description: "Learn practical technology skills through mentor-led training, projects, career guidance and placement assistance at Simatrix Academy.",
    canonical: "/",
    jsonLd: { "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Simatrix Academy", url: typeof window !== "undefined" ? window.location.origin : "" },
  });

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
  const toEnquiry = (intent = "guidance") => {
    setEnquiryIntent(typeof intent === "string" ? intent : "guidance");
    window.requestAnimationFrame(() => enquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main ref={mainRef} id="main-content" className="overflow-hidden bg-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-transparent" aria-hidden="true">
        <span
          className="block h-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-brand-600 shadow-[0_0_12px_rgba(245,158,11,.45)]"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>
      <HeroCarousel onEnquiry={toEnquiry} />
      <CommunitySection data={data} courses={courses} testimonials={testimonials} />

      {error && !data ? (
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-slate-600">We couldn’t load the latest courses right now.</p>
          <Link to="/courses" className="mt-4 inline-flex font-bold text-brand-700">
            Browse courses
          </Link>
        </section>
      ) : (
        <>
          <section id="learning-paths" className="scroll-mt-32 mx-auto max-w-7xl px-6 py-20 sm:py-28">
            <SectionTitle
              eyebrow="Find your path"
              title="Choose the skill you want to build"
              description="Start with a field that matches your goals. Each path takes you from essential concepts to practical application."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {!data ? (
                Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
              ) : (
                data.categories?.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    to={`/courses?category=${category.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl text-brand-700">
                      <i className={icon(category.icon)} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-slate-950">{category.name}</strong>
                      <span className="mt-1 block text-sm text-slate-500">
                        {(category.courses || []).length} courses
                      </span>
                    </span>
                    <i className="ti ti-chevron-right text-slate-400 transition group-hover:translate-x-1" />
                  </Link>
                ))
              )}
            </div>
          </section>

          {(!data || featured.length > 0) && (
            <section id="popular-programs" className="scroll-mt-32 bg-slate-50 py-20 sm:py-28">
              <div className="mx-auto max-w-7xl px-6">
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
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
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

      {/* Free Full-Stack Internship Section */}
      <section id="internship" className="scroll-mt-32 bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[.18em] text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Free Full-Stack Internship Program
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Bridge the gap between college theory and your first tech job.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Designed specifically for pre-final, final-year college students and freshers. Gain real industry exposure, build deployable software, and master technical interview defense without paying course fees.
            </p>

            {/* Quick highlight metrics */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                <i className="ti ti-clock text-amber-600 text-sm" /> 4–8 Weeks Duration
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                <i className="ti ti-device-laptop text-blue-600 text-sm" /> Classroom Lab or Live Online
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                <i className="ti ti-coin-off text-emerald-600 text-sm" /> 100% Free • Selection Based
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => toEnquiry("internship")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 py-3 font-bold text-white shadow-md shadow-brand-950/20 transition hover:bg-brand-800 active:scale-[0.99]"
              >
                <span>Apply for Free Internship</span>
                <i className="ti ti-arrow-right" />
              </button>
              <button
                type="button"
                onClick={() => toEnquiry("internship")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800 shadow-xs transition hover:bg-slate-50"
              >
                <i className="ti ti-checklist text-brand-700" />
                <span>Check Eligibility</span>
              </button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <i className="ti ti-shield-check text-emerald-600" />
              Zero fee • Batches are limited per campus to ensure 1-on-1 mentor guidance.
            </p>
          </div>

          {/* Right card: What you actually take away */}
          <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-slate-50 p-6 shadow-xl shadow-amber-900/5 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-amber-200/60">
              <h3 className="font-display text-xl font-bold text-slate-950 sm:text-2xl">
                What you actually take away:
              </h3>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-800">
                Verified Outcomes
              </span>
            </div>

            <ul className="mt-6 space-y-4">
              {[
                {
                  icon: "ti-folders",
                  title: "2–3 Completed Industry Projects",
                  desc: "Build real frontend & backend workflows rather than tutorial clones.",
                },
                {
                  icon: "ti-brand-github",
                  title: "Active GitHub Repo with Deployments",
                  desc: "Live URLs on Vercel / Render with proper commit messages & documentation.",
                },
                {
                  icon: "ti-messages",
                  title: "Mock Interview Project Defense",
                  desc: "Learn how to explain your database schema, API design, and bugs to recruiters.",
                },
                {
                  icon: "ti-certificate",
                  title: "Internship Certificate & Performance Letter",
                  desc: "Official Simatrix Academy verifiable credential to validate your practical training.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-lg text-amber-700 shadow-xs border border-amber-100">
                    <i className={`ti ${item.icon}`} />
                  </span>
                  <div>
                    <strong className="block text-sm font-bold text-slate-950">{item.title}</strong>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-amber-100/60 p-4 text-xs leading-relaxed text-amber-900 border border-amber-200/50">
              <strong>Ideal For:</strong> BE / B.Tech / BCA / MCA / B.Sc CS final-year students and fresh graduates wanting real software experience before campus or off-campus drives.
            </div>
          </div>
        </div>
      </section>

      {/* Where Learning Leads / Tangible Outcomes */}
      <section id="outcomes" className="scroll-mt-32 border-y border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Where learning leads</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Build real capability, not just another completion certificate.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Freshers in today&apos;s market are judged by what they have built and how fluently they defend their code. Every program at Simatrix is structured around tangible career readiness.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-xl text-blue-700">
                    <i className="ti ti-brand-github" />
                  </span>
                  <h4 className="mt-3 font-bold text-slate-950">Production GitHub Portfolios</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Ship 3+ full-stack applications to live URLs with clean git commit histories that tech interviewers respect.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-xl text-purple-700">
                    <i className="ti ti-messages" />
                  </span>
                  <h4 className="mt-3 font-bold text-slate-950">Technical Mock Interviews</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Rigorous 1-on-1 code defense, Data Structures drills, and system design basics to eliminate interview anxiety.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
                    <i className="ti ti-user-check" />
                  </span>
                  <h4 className="mt-3 font-bold text-slate-950">Working Tech Mentors</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Trained directly by software engineers from active tech companies, not academic theory readers.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-xl text-amber-700">
                    <i className="ti ti-briefcase" />
                  </span>
                  <h4 className="mt-3 font-bold text-slate-950">Placement Pipeline</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Resume optimization, ATS matching, and local + regional company connection drives across Tamil Nadu.
                  </p>
                </div>
              </div>
            </div>

            {/* Graduate Takeaway Checklist Card */}
            <div className="rounded-3xl border border-brand-200/70 bg-gradient-to-br from-brand-900 to-[#0b1528] p-7 text-white shadow-2xl sm:p-9">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                <i className="ti ti-certificate" />
                Graduate Readiness Standard
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                What every Simatrix graduate leaves with:
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                We measure our success not by enrollments, but by the tangible assets in your career portfolio:
              </p>

              <ul className="mt-6 space-y-3.5 text-xs sm:text-sm">
                {[
                  "3+ Live, deployed full-stack or domain applications",
                  "Active GitHub profile with clear documentation & READMEs",
                  "ATS-tailored technical resume reviewed by hiring leads",
                  "Technical interview problem-solving muscle & code defense",
                  "Simatrix Course Completion Certificate & Performance Endorsement",
                  "Direct entry to our alumni hiring network & partner job drives",
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
                  <span>Discuss Your Learning Plan</span>
                  <i className="ti ti-arrow-right text-xs" />
                </button>
                <Link
                  to="/placement"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <span>Explore Placement Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Learning Journey with Visual Progression Connectors */}
      <section id="learning-journey" className="scroll-mt-32 bg-[#0d1b32] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
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
      </section>

      {/* Real Campus & Lab Environment (Madurai & Virudhunagar) + Parent Trust */}
      <section id="learning-environment" className="scroll-mt-32 bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
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
                <i className="ti ti-map-pin" /> Madurai &amp; Virudhunagar
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

            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs">
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

          {/* Parent & Student Trust Box */}
          <div className="mt-8 rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-900 to-[#0b1528] p-6 text-white sm:p-8">
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-slate-950 transition hover:bg-blue-50"
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

      {/* Learner Stories / Testimonials */}
      <section id="learner-stories" className="scroll-mt-32 relative bg-slate-50/40 py-16 sm:py-20 overflow-hidden border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ModernLearnerStories testimonials={testimonials} />
        </div>
      </section>

      {/* Enquiry Form Section - Modern Elegant Lounge */}
      <section
        ref={enquiryRef}
        id="enquiry"
        className="scroll-mt-32 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-slate-100/80 py-24 sm:py-32"
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-brand-100/40 via-amber-100/30 to-indigo-100/30 blur-3xl opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-sky-100/30 via-brand-100/20 to-purple-100/20 blur-3xl opacity-60"
        />

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1.15fr]">
            {/* Left Column: Authoritative Value Proposition & Direct Contact */}
            <div className="lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[.18em] text-amber-900 shadow-2xs">
                <i className="ti ti-headset text-amber-600" />
                {enquiryIntent === "internship" ? "Free Internship Admissions" : "1-on-1 Career Guidance Desk"}
              </div>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
                {enquiryIntent === "internship"
                  ? "Take the first step toward practical software experience."
                  : "Not sure which tech path matches your goal?"}
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-600 max-w-xl">
                {enquiryIntent === "internship"
                  ? "Share your details so our academic leads can verify eligibility, walk you through the live project roadmap, and reserve your batch seat."
                  : "Speak directly with an experienced tech trainer, not a sales representative. We analyze your background, answer syllabus and fee questions, and help you chart a realistic career roadmap—completely pressure-free."}
              </p>

              {/* 3 Value Pillars */}
              <div className="mt-8 space-y-3.5">
                {[
                  {
                    icon: "ti-compass",
                    title: enquiryIntent === "internship" ? "Verified Eligibility & Batch Options" : "Personalized Skills Assessment",
                    desc: enquiryIntent === "internship"
                      ? "Pre-final, final-year, or fresher status confirmed with flexible campus lab slots."
                      : "Honest advice based on whether you are CS, non-CS, a fresher, or switching from another field.",
                  },
                  {
                    icon: "ti-device-desktop",
                    title: "Campus Lab & Syllabus Walkthrough",
                    desc: "Inspect our computer labs in Madurai & Virudhunagar, project deliverables, and class schedule.",
                  },
                  {
                    icon: "ti-bolt",
                    title: "Fast Mentor Callback (Under 24 Hours)",
                    desc: "Our technical mentors reach out by phone or WhatsApp to answer all questions before you decide.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-2xs backdrop-blur-xs transition hover:border-slate-300 hover:bg-white"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl text-brand-700">
                      <i className={`ti ${item.icon}`} />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-950">{item.title}</h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mentor Presence & Direct Hotline Strip */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img src={avatar1} alt="Mentor" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                    <img src={avatar2} alt="Mentor" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                    <img src={avatar3} alt="Mentor" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Mentors Active
                    </div>
                    <p className="text-[11px] text-slate-500">Madurai &amp; Virudhunagar</p>
                  </div>
                </div>

                <a
                  href="tel:+919363793954"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100/90 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-200"
                >
                  <i className="ti ti-phone text-brand-700" />
                  <span>+91 93637 93954</span>
                </a>
              </div>
            </div>

            {/* Right Column: High-Converting Card */}
            <div className="relative rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)]">
              {/* Subtle top accent highlight */}
              <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-brand-600 to-indigo-600" />

              <div className="mb-6 pb-5 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-950">
                    {enquiryIntent === "internship" ? "Register Your Interest" : "Request a Callback"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {enquiryIntent === "internship"
                      ? "Complete the quick form below to check eligibility for the free batch."
                      : "Complete the form and our mentors will contact you within 24 hours."}
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 text-lg">
                  <i className="ti ti-pencil" />
                </span>
              </div>

              <EnquiryForm courses={courses} compact type={enquiryIntent} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section with Single-Open Accordion & Category Filters */}
      <FaqSection toEnquiry={toEnquiry} />
      <style>{`
        #main-content > section[class*="py-20"] { padding-top: 3.5rem; padding-bottom: 3.5rem; }
        #main-content > section:last-of-type { padding-bottom: 2rem; }
        @media (max-width: 640px) { #main-content > section[class*="py-20"] { padding-top: 2.5rem; padding-bottom: 2.5rem; } }
      `}</style>
    </main>
  );
}
