import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { Section, Reveal, SectionHeading } from "../components/ui";
import EnquiryForm from "../components/EnquiryForm";
import { useSeo } from "../lib/useSeo";

/* ═══════════════════════════════════════════════════════════════
   CITY CONFIGURATION — each entry has unique SEO-heavy content.
   Every piece of text is a keyword target from keyword.md.
   ═══════════════════════════════════════════════════════════════ */
const CITIES = {
  virudhunagar: {
    name: "Virudhunagar",
    slug: "virudhunagar",
    heroTitle: "No.1 Software Training Institute in Virudhunagar",
    heroSub: "Join Simatrix Academy — the best IT training institute in Virudhunagar for freshers, graduates and working professionals. Get 100% placement support with hands-on projects.",
    distance: null,
    branch: "Main Branch — 1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar 626001",
    phone: "+91 93637 93954",
    mapQuery: "Simatrix+Academy+Virudhunagar+AA+Road",
    nearbyLabel: null,
    whyTitle: "Why Simatrix Academy is the Best Software Training Institute in Virudhunagar",
    whyText: "Virudhunagar is rapidly becoming a hub for IT education in southern Tamil Nadu. Simatrix Academy is at the forefront — offering industry-aligned software courses with real-world projects, expert trainers with MNC experience, and a dedicated placement cell. Whether you're searching for a software training institute in Virudhunagar, IT courses in Virudhunagar, or computer training in Virudhunagar — Simatrix Academy delivers practical, career-focused training that gets results.",
    aboutCity: "Virudhunagar, known as the 'Granite City' of Tamil Nadu, is home to a growing number of graduates seeking IT careers. With its proximity to major cities like Madurai and Tirunelveli, students in Virudhunagar no longer need to relocate for quality software training. Simatrix Academy brings world-class IT training right to the heart of Virudhunagar.",
    placementText: "Our placement training in Virudhunagar goes beyond just teaching code. We prepare you with resume building, mock interviews, aptitude training, soft skills development and direct referrals to hiring companies. Every student at Simatrix Academy receives IT training with placement in Virudhunagar — from day one until you get placed.",
  },
  sivakasi: {
    name: "Sivakasi",
    slug: "sivakasi",
    heroTitle: "Best Software Training for Sivakasi Students",
    heroSub: "Sivakasi students — learn Python, Java, Full Stack, Data Analytics & AI at Simatrix Academy. Just 25 km away in Virudhunagar, with online and offline batches.",
    distance: "25 km",
    branch: null,
    phone: "+91 93637 93954",
    mapQuery: "Simatrix+Academy+Virudhunagar",
    nearbyLabel: "Nearest centre: Virudhunagar Main Branch (25 km from Sivakasi)",
    whyTitle: "Why Sivakasi Students Choose Simatrix Academy for Software Training",
    whyText: "Sivakasi, the fireworks and printing capital of India, is home to thousands of ambitious students and graduates looking for IT training with placement. While Sivakasi has basic computer centres, Simatrix Academy in nearby Virudhunagar offers advanced software training courses — Python, Java, MERN Stack, Data Analytics, Cloud & AI — with industry-level projects and guaranteed placement support. Just 25 km away, with flexible online and weekend batches for Sivakasi students.",
    aboutCity: "Sivakasi is famous for its match, fireworks and printing industries, but today's Sivakasi graduates are looking beyond traditional careers. The IT industry offers higher salaries, global opportunities and long-term growth. Simatrix Academy bridges that gap — bringing software training near Sivakasi with courses designed for real-world employment.",
    placementText: "For Sivakasi students seeking job oriented software courses, Simatrix Academy provides complete career support — from technical training to placement assistance. Our placement cell works with hiring partners across Tamil Nadu, Bangalore, Chennai and remote companies to place our students in meaningful IT roles.",
  },
  rajapalayam: {
    name: "Rajapalayam",
    slug: "rajapalayam",
    heroTitle: "Software Training for Rajapalayam Students | Simatrix Academy",
    heroSub: "From Rajapalayam to the IT industry — learn job-ready software skills with placement support at Simatrix Academy. Online classes available.",
    distance: "40 km",
    branch: null,
    phone: "+91 93637 93954",
    mapQuery: "Simatrix+Academy+Virudhunagar",
    nearbyLabel: "Nearest centre: Virudhunagar Main Branch (40 km from Rajapalayam)",
    whyTitle: "Best Software Training Near Rajapalayam — At Simatrix Academy",
    whyText: "Rajapalayam students no longer need to travel to Chennai or Bangalore for quality IT training. Simatrix Academy, located in Virudhunagar (just 40 km away), offers professional software courses in Python Full Stack, Java Full Stack, MERN Stack, Data Analytics, Cloud Computing and AI. With live online classes, Rajapalayam students can attend from home — same curriculum, same mentors, same placement support.",
    aboutCity: "Rajapalayam, known for its textile mills and Rajapalayam dog breed, is a growing town with many engineering and arts colleges. Graduates from Mohamed Sathak Engineering College, Government Arts College and other institutions in Rajapalayam are increasingly choosing IT careers. Simatrix Academy is the nearest advanced software training institute for Rajapalayam students.",
    placementText: "We've helped students from Rajapalayam transition into IT careers through structured placement training — resume workshops, technical mock interviews, HR preparation and company referrals. Our job oriented courses are designed to make you industry-ready within months.",
  },
  srivilliputhur: {
    name: "Srivilliputhur",
    slug: "srivilliputhur",
    heroTitle: "Software Training Institute Near Srivilliputhur | Simatrix Academy",
    heroSub: "Srivilliputhur students — get industry-level IT training at Simatrix Academy. Python, Java, Full Stack, Data Analytics, AI courses with 100% placement support.",
    distance: "35 km",
    branch: null,
    phone: "+91 93637 93954",
    mapQuery: "Simatrix+Academy+Virudhunagar",
    nearbyLabel: "Nearest centre: Virudhunagar Main Branch (35 km from Srivilliputhur)",
    whyTitle: "Why Srivilliputhur Students Should Choose Simatrix Academy Over Other Institutes",
    whyText: "While Srivilliputhur has basic computer education centres like Apollo and Dolphin, Simatrix Academy offers advanced, industry-aligned software training that goes far beyond basic courses. Our curriculum covers Python Full Stack, Java Full Stack, MERN Stack, Data Analytics with Power BI & SQL, Cloud & DevOps, and AI & Machine Learning — all with real projects, expert trainers and guaranteed placement assistance. Unlike basic computer centres, we prepare you for actual IT jobs.",
    aboutCity: "Srivilliputhur, home to the famous Andal Temple and known for its palkova, is a town rich in culture. Today, students from Srivilliputhur are looking at IT careers for better prospects. With limited advanced software training options in Srivilliputhur, students often travel to Madurai or Chennai. Simatrix Academy in Virudhunagar (just 35 km) changes that — with live online classes also available.",
    placementText: "Don't settle for basic computer courses in Srivilliputhur. Get career-oriented software training with placement at Simatrix Academy. Our students from nearby towns have been placed in companies across India — and we'll work with you until you get your first IT role.",
  },
  aruppukottai: {
    name: "Aruppukottai",
    slug: "aruppukottai",
    heroTitle: "Software Training for Aruppukottai Students | Simatrix Academy",
    heroSub: "Aruppukottai students — unlock your tech potential with job-oriented software courses at Simatrix Academy. Online + offline batches available.",
    distance: "30 km",
    branch: null,
    phone: "+91 93637 93954",
    mapQuery: "Simatrix+Academy+Virudhunagar",
    nearbyLabel: "Nearest centre: Virudhunagar Main Branch (30 km from Aruppukottai)",
    whyTitle: "Best Software Training Institute Near Aruppukottai",
    whyText: "Aruppukottai students can now access top-quality IT training without relocating. Simatrix Academy in Virudhunagar (30 km away) offers professional software courses in Python, Java, Full Stack Development, Data Analytics, Cloud and AI — with 100% placement support. Our live online batches mean you can learn from home in Aruppukottai with the same quality of training.",
    aboutCity: "Aruppukottai, a historic town in Virudhunagar district, has a strong educational tradition. With several colleges producing fresh graduates each year, the demand for software training and IT courses near Aruppukottai is growing. Simatrix Academy fills this gap with industry-ready programs.",
    placementText: "Every Aruppukottai student at Simatrix Academy receives dedicated placement support — from building your tech resume to preparing for coding interviews and connecting with employers. We focus on job oriented courses that lead to real employment.",
  },
  sattur: {
    name: "Sattur",
    slug: "sattur",
    heroTitle: "Software Training Near Sattur | Simatrix Academy Virudhunagar",
    heroSub: "Sattur students — build career-ready software skills at Simatrix Academy. Just 20 km away, with flexible online and offline batches.",
    distance: "20 km",
    branch: null,
    phone: "+91 93637 93954",
    mapQuery: "Simatrix+Academy+Virudhunagar",
    nearbyLabel: "Nearest centre: Virudhunagar Main Branch (20 km from Sattur)",
    whyTitle: "The Best IT Training Institute Near Sattur",
    whyText: "Sattur is just 20 km from Virudhunagar — making Simatrix Academy the closest advanced software training institute for Sattur students. We offer comprehensive IT courses in Python Full Stack, Java Full Stack, MERN Stack, Data Analytics, Cloud DevOps and AI with hands-on projects and placement support. No need to travel to Madurai or Chennai — get the same quality of training right next door.",
    aboutCity: "Sattur, a bustling taluk headquarters in Virudhunagar district, produces a large number of graduates each year from its engineering colleges and arts colleges. With the IT industry booming, Sattur students are increasingly looking for quality software training courses nearby. Simatrix Academy is the answer.",
    placementText: "Our career-oriented courses are designed with placement in mind. Sattur students get full placement assistance — resume building, mock interviews, aptitude preparation, and referrals to hiring partners. From Sattur to the IT industry, the journey starts here.",
  },
};

/* ── Courses: each card's h3 targets "{keyword} Training in {City}" ── */
const FEATURED_COURSES = [
  { keyword: "Python Full Stack", slug: "python-fullstack", icon: "ti-brand-python", desc: "Django, FastAPI, React + AI integration. Build full-stack web applications from scratch to deployment.", bullets: ["Django & FastAPI backends", "React frontend", "Database design", "REST APIs & deployment"] },
  { keyword: "Java Full Stack", slug: "java-fullstack", icon: "ti-coffee", desc: "Core Java, Spring Boot & React. The enterprise-grade developer stack trusted by top companies.", bullets: ["Core Java & OOP", "Spring Boot", "React & frontend", "Enterprise architecture"] },
  { keyword: "MERN Stack", slug: "mern-stack", icon: "ti-brand-javascript", desc: "MongoDB, Express, React & Node.js. The modern web developer toolkit for startups and products.", bullets: ["MongoDB & NoSQL", "Express & Node.js", "React with hooks", "Real-time apps"] },
  { keyword: "Data Analytics", slug: "data-analytics", icon: "ti-chart-bar", desc: "SQL, Power BI, Excel & Python for data-driven careers. Turn raw data into business decisions.", bullets: ["SQL & databases", "Power BI dashboards", "Advanced Excel", "Python for data"] },
  { keyword: "Cloud & DevOps", slug: "cloud-devops", icon: "ti-cloud", desc: "AWS, Docker, Kubernetes, CI/CD pipelines. Build and deploy at cloud scale.", bullets: ["AWS services", "Docker & Kubernetes", "CI/CD automation", "Infrastructure as code"] },
  { keyword: "AI & Machine Learning", slug: "ai-ml", icon: "ti-robot", desc: "Python, TensorFlow, LLMs, NLP. The future of software is AI — and it starts here.", bullets: ["Python for ML", "TensorFlow & PyTorch", "LLMs & GenAI", "Model deployment"] },
];

const USP_ITEMS = [
  { icon: "ti-certificate", title: "100% Placement Support", text: "Dedicated placement cell with hiring partner network. We work with you until you get placed — no time limit." },
  { icon: "ti-users-group", title: "Industry Expert Trainers", text: "Learn from professionals with 5–15 years of hands-on MNC experience — not textbook instructors." },
  { icon: "ti-code", title: "Live Projects from Week One", text: "Work on real-world projects that go into your portfolio — not dummy assignments or copied tutorials." },
  { icon: "ti-clock", title: "Flexible Batches", text: "Morning, evening and weekend batches. Online and offline options so your schedule never holds you back." },
  { icon: "ti-building", title: "Modern Infrastructure", text: "Air-conditioned classrooms, dedicated computer labs with high-speed internet and the latest software." },
  { icon: "ti-trophy", title: "Industry Certifications", text: "Prepare for globally recognised certifications alongside your training — Microsoft, AWS, Google and more." },
  { icon: "ti-heart-handshake", title: "Career Guidance", text: "Free career counselling sessions every week. Discover the right path before you invest time and money." },
  { icon: "ti-wallet", title: "Affordable Fees", text: "Premium training at accessible fees. EMI options and discounts for early enrolment available." },
];

/* Per-city FAQ — HEAVY keyword targeting */
const FAQ_ITEMS = (city) => [
  [`What is the best software training institute in ${city}?`,
    `Simatrix Academy is widely regarded as the best software training institute for ${city} students. We offer industry-aligned courses in Python Full Stack, Java Full Stack, MERN Stack, Data Analytics, Cloud & DevOps, and AI with 100% placement support. Our expert trainers, live projects and dedicated placement cell set us apart from basic computer centres in ${city}.`],
  [`What software courses are available for ${city} students?`,
    `Simatrix Academy offers the following software courses for ${city} students: Python Full Stack Development, Java Full Stack Development, MERN Stack Development, Data Analytics (SQL, Power BI, Excel & Python), Cloud & DevOps (AWS, Docker, CI/CD), AI & Machine Learning, Web Development, and more. All courses include hands-on projects and placement assistance.`],
  [`Is there IT training with placement near ${city}?`,
    `Yes! Simatrix Academy provides IT training with placement for ${city} students. Our placement cell works with hiring partners across Tamil Nadu, Bangalore, Chennai, Hyderabad and remote companies. Every course includes resume building, mock interviews, aptitude training and direct referrals. We offer both online classes and in-person training at our Virudhunagar branch.`],
  [`What is the fee for software training courses?`,
    `Course fees at Simatrix Academy vary by program and duration. Contact us at +91 93637 93954 for detailed fee information, available discounts and EMI options. We offer the best value for software training in the ${city} region — premium training at accessible fees.`],
  [`Can I attend online classes from ${city}?`,
    `Absolutely! All our software courses are available as live online classes. ${city} students can attend the same instructor-led training, work on the same projects, and receive the same placement support — all from home. Our online batches include morning, evening and weekend options.`],
  [`What is the duration of software courses?`,
    `Course durations at Simatrix Academy range from 2 months to 6 months depending on the program. Full Stack courses (Python, Java, MERN) are typically 4-6 months. Data Analytics is 3-4 months. All courses include project work and placement preparation time.`],
  [`Do you provide certificates after completing the course?`,
    `Yes. Upon successful course completion, you receive a Simatrix Academy course completion certificate. Additionally, we prepare you for globally recognised industry certifications from Microsoft, AWS, Google and other providers — giving your resume extra credibility.`],
  [`How is Simatrix Academy different from other computer training institutes near ${city}?`,
    `Unlike basic computer training centres that teach only fundamentals, Simatrix Academy focuses on job-oriented software training with real projects, industry-expert trainers and 100% placement assistance. We teach advanced technologies like Full Stack Development, Data Analytics, Cloud Computing and AI — the skills companies are actually hiring for.`],
  [`What job roles can I get after training?`,
    `After completing training at Simatrix Academy, ${city} students can apply for roles like Junior Software Developer, Full Stack Developer, Data Analyst, Python Developer, Java Developer, Web Developer, Cloud Engineer, DevOps Engineer, and AI/ML Associate. Our placement team actively refers students to companies hiring for these roles.`],
  [`Is there a free demo class available?`,
    `Yes! We offer free demo sessions for all our courses. ${city} students can attend a demo class online or visit our Virudhunagar branch to experience our teaching methodology before enrolling. Contact us at +91 93637 93954 to book your free demo.`],
];

/* ── Per-city keyword-dense content blocks ── */
const KEYWORD_SECTIONS = (city) => [
  {
    heading: `Software Training in ${city}`,
    text: `Looking for the best software training in ${city}? Simatrix Academy offers comprehensive, industry-aligned software training courses designed to transform beginners into job-ready professionals. Our software courses in ${city} cover everything from programming fundamentals to advanced full-stack development, data analytics, cloud computing and artificial intelligence. Whether you're a fresh graduate, a college student or a working professional looking to switch careers — our software training classes in ${city} will equip you with the practical skills employers demand.`,
  },
  {
    heading: `IT Training Institute for ${city} Students`,
    text: `As the leading IT training institute serving ${city} and surrounding areas, Simatrix Academy goes beyond basic computer education. Our IT courses in ${city} are designed around what the industry needs right now — not outdated syllabi from five years ago. Every IT course includes live projects, code reviews, and deployment practice on real servers. Our IT training in ${city} prepares you for the actual daily work of a software professional — not just to pass an exam.`,
  },
  {
    heading: `Computer Training with Job Placement in ${city}`,
    text: `Finding a good computer training institute near ${city} with genuine placement support is challenging. Simatrix Academy solves this by combining practical computer courses with a dedicated placement cell. Our placement training institute serves ${city} students with complete career preparation — from resume writing and LinkedIn optimisation to technical mock interviews and HR round preparation. We provide job oriented courses in ${city} that lead to real employment, not just certificates that collect dust.`,
  },
];


export default function CityTraining() {
  const { citySlug } = useParams();
  const city = CITIES[citySlug] || CITIES.virudhunagar;
  const [courses, setCourses] = useState(null);

  /* ── SEO: keyword-dense title, description and structured data ── */
  const metaTitle = `Software Training in ${city.name} | Best IT Training Institute | Simatrix Academy`;
  const metaDesc = `Best software training institute for ${city.name} students. Learn Python, Java, Full Stack, Data Analytics, Cloud & AI with hands-on projects, expert trainers and 100% placement support. IT courses in ${city.name} with job placement at Simatrix Academy.`;

  useSeo({
    title: metaTitle,
    description: metaDesc,
    canonical: `/software-training-in-${city.slug}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `Simatrix Academy — Software Training Institute for ${city.name}`,
      description: `Best software training institute near ${city.name} with 100% placement. IT courses, computer training and job oriented software courses for ${city.name} students.`,
      url: `https://www.simatrixacademy.com/software-training-in-${city.slug}`,
      telephone: "+91-93637-93954",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1/2A, 1st Floor, AA Road, Near Head Post Office",
        addressLocality: "Virudhunagar",
        addressRegion: "Tamil Nadu",
        postalCode: "626001",
        addressCountry: "IN",
      },
      areaServed: { "@type": "City", name: city.name },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
  });

  useEffect(() => {
    api.getCourses().then((res) => setCourses(res.data)).catch(() => setCourses([]));
  }, []);

  const faqs = FAQ_ITEMS(city.name);
  const keywordSections = KEYWORD_SECTIONS(city.name);

  /* ── JSON-LD for FAQPage schema (separate from main schema) ── */
  useEffect(() => {
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "city-faq");
    script.text = JSON.stringify(faqLd);
    document.head.appendChild(script);
    return () => script.remove();
  }, [citySlug]);

  return (
    <main id="main-content" className="overflow-hidden bg-white">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative isolate overflow-hidden bg-[#0d1b32] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_25%,rgba(202,138,4,.18),transparent_28%),radial-gradient(circle_at_8%_90%,rgba(30,143,224,.15),transparent_30%),linear-gradient(135deg,#0a1020,#172642)]" />
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <nav className="flex items-center gap-2 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            <i className="ti ti-chevron-right text-xs" />
            <Link to="/branches" className="hover:text-white">Branches</Link>
            <i className="ti ti-chevron-right text-xs" />
            <span className="text-slate-200">Software Training in {city.name}</span>
          </nav>

          <h1 className="mt-8 max-w-4xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            {city.heroTitle.includes(city.name)
              ? <>{city.heroTitle.split(city.name)[0]}<span className="text-amber-300">{city.name}</span>{city.heroTitle.split(city.name).slice(1).join(city.name)}</>
              : city.heroTitle
            }
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{city.heroSub}</p>

          {city.nearbyLabel && (
            <p className="mt-4 flex items-center gap-2 rounded-lg border border-amber-300/20 bg-amber-300/5 px-4 py-2 text-sm font-medium text-amber-300">
              <i className="ti ti-map-pin" /> {city.nearbyLabel}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="tel:+919363793954" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300">
              <i className="ti ti-phone" /> Call {city.phone}
            </a>
            <a href="https://wa.me/919363793954" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.05] px-6 py-3 font-bold transition hover:bg-white/10">
              <i className="ti ti-brand-whatsapp" /> WhatsApp Us
            </a>
            <Link to="/courses" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.05] px-6 py-3 font-bold transition hover:bg-white/10">
              Explore All Courses <i className="ti ti-arrow-right" />
            </Link>
          </div>

          {/* Trust signals strip */}
          <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> 100% Placement Support</span>
            <span className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> Expert MNC Trainers</span>
            <span className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> Live Projects</span>
            <span className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> Online & Offline Classes</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ KEYWORD-DENSE ABOUT SECTION ═══════════════ */}
      <section className="py-16 sm:py-20">
        <Section>
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{city.whyTitle}</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">{city.whyText}</p>
            <p className="mt-4 text-base leading-8 text-slate-600">{city.aboutCity}</p>
          </div>
        </Section>
      </section>

      {/* ═══════════════ COURSE CARDS (keyword: "{Course} Training in {City}") ═══════════════ */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <Section>
          <SectionHeading
            eyebrow={`Software Courses in ${city.name}`}
            title={`Job-Oriented IT Courses for ${city.name} Students`}
            subtitle={`Industry-oriented, placement-focused software training programs. Every course targets real job roles in the IT industry.`}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_COURSES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link
                  to={`/courses/${c.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
                    <i className={`ti ${c.icon}`} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-slate-900">
                    {c.keyword} Training in {city.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{c.desc}</p>
                  <ul className="mt-3 space-y-1">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-slate-500">
                        <i className="ti ti-check text-brand-600" /> {b}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition group-hover:gap-2">
                    View course details <i className="ti ti-arrow-right text-xs" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/courses" className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-8 py-3 font-semibold text-white transition hover:bg-brand-800">
              View All Software Courses <i className="ti ti-arrow-right" />
            </Link>
          </div>
        </Section>
      </section>

      {/* ═══════════════ PLACEMENT SECTION (keyword: "placement training in {City}") ═══════════════ */}
      <section className="bg-[#0d1b32] py-16 text-white sm:py-20">
        <Section>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Placement Assistance</p>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              IT Training with 100% Placement in {city.name}
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-300">{city.placementText}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "ti-file-cv", label: "Resume Building", desc: "Professional tech resumes that pass ATS filters" },
              { icon: "ti-message-chatbot", label: "Mock Interviews", desc: "Technical + HR rounds with real interview questions" },
              { icon: "ti-brain", label: "Aptitude Training", desc: "Quantitative, logical and verbal preparation" },
              { icon: "ti-building-skyscraper", label: "Company Referrals", desc: "Direct referrals to hiring partners across India" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-6 text-center">
                  <i className={`ti ${item.icon} text-3xl text-amber-300`} />
                  <h3 className="mt-3 font-display text-lg font-bold">{item.label}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/placement" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-3 font-bold text-slate-950 transition hover:bg-amber-300">
              Learn About Placement Support <i className="ti ti-arrow-right" />
            </Link>
          </div>
        </Section>
      </section>

      {/* ═══════════════ WHY SIMATRIX USPs ═══════════════ */}
      <section className="py-16 sm:py-20">
        <Section>
          <SectionHeading
            eyebrow="Why Simatrix Academy"
            title={`Why ${city.name} Students Choose Simatrix Academy`}
            subtitle="Real skills, real projects, real placements — here's what sets us apart from other institutes."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {USP_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-2xl text-amber-600">
                    <i className={`ti ${item.icon}`} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* ═══════════════ KEYWORD-DENSE SEO CONTENT SECTIONS ═══════════════ */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <Section>
          <div className="mx-auto max-w-4xl space-y-10">
            {keywordSections.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{s.heading}</h2>
                  <p className="mt-4 text-base leading-8 text-slate-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* ═══════════════ ENQUIRY FORM ═══════════════ */}
      <section className="bg-[#0d1b32] py-16 text-white sm:py-20">
        <Section>
          <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Get Started Today</p>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Start Your Software Training Journey from {city.name}
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Ready to begin your IT career? Fill out the enquiry form and our counsellor will contact you within 24 hours
                with course details, batch schedules and fee information. Free guidance, no pressure.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> Free career counselling session</li>
                <li className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> Flexible morning, evening & weekend batches</li>
                <li className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> 100% placement assistance guaranteed</li>
                <li className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> Live online classes from {city.name}</li>
                <li className="flex items-center gap-2"><i className="ti ti-check text-amber-300" /> Free demo class available</li>
              </ul>
              {city.branch && (
                <div className="mt-8 rounded-xl border border-white/10 bg-white/[.05] p-5">
                  <p className="flex items-start gap-2 text-sm"><i className="ti ti-map-pin mt-0.5 text-amber-300" /><span>{city.branch}</span></p>
                  <p className="mt-2 flex items-center gap-2 text-sm"><i className="ti ti-phone text-amber-300" /><a href={`tel:${city.phone.replace(/\s/g, "")}`} className="hover:text-amber-300">{city.phone}</a></p>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.04] p-6 backdrop-blur">
              <EnquiryForm source={`city-${city.slug}`} />
            </div>
          </div>
        </Section>
      </section>

      {/* ═══════════════ FAQ (with FAQPage Schema) ═══════════════ */}
      <section className="py-16 sm:py-20">
        <Section>
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title={`Software Training in ${city.name} — FAQ`}
            subtitle={`Everything ${city.name} students need to know before enrolling.`}
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200">
            {faqs.map(([q, a], i) => (
              <Reveal key={i} delay={i * 40}>
                <details className="group py-5" {...(i === 0 ? { open: true } : {})}>
                  <summary className="flex cursor-pointer items-start gap-3 text-left font-display text-base font-semibold text-slate-900 sm:text-lg">
                    <i className="ti ti-plus mt-1 shrink-0 text-brand-600 transition group-open:hidden" />
                    <i className="ti ti-minus mt-1 hidden shrink-0 text-brand-600 transition group-open:inline-block" />
                    {q}
                  </summary>
                  <p className="mt-3 pl-8 text-sm leading-7 text-slate-600">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* ═══════════════ CITY LINK NETWORK (Internal linking) ═══════════════ */}
      <section className="border-t border-slate-200 bg-slate-50 py-10">
        <Section>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Software Training Locations Near {city.name}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Object.values(CITIES).map((c) => (
              <Link
                key={c.slug}
                to={`/software-training-in-${c.slug}`}
                className={`rounded-full border px-4 py-1.5 text-sm transition hover:border-brand-300 hover:text-brand-700 ${
                  c.slug === city.slug
                    ? "border-brand-300 bg-brand-50 font-semibold text-brand-700"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Software Training in {c.name}
              </Link>
            ))}
          </div>
          {/* Extra keyword-rich links */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
            <Link to="/courses" className="hover:text-brand-700">Software Courses {city.name}</Link>
            <span>·</span>
            <Link to="/placement" className="hover:text-brand-700">Placement Training {city.name}</Link>
            <span>·</span>
            <Link to="/career-guidance" className="hover:text-brand-700">Job Oriented Courses {city.name}</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-brand-700">IT Institute {city.name}</Link>
            <span>·</span>
            <Link to="/reviews" className="hover:text-brand-700">Student Reviews</Link>
          </div>
        </Section>
      </section>
    </main>
  );
}
