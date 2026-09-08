import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";

export const STORIES = [
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
    campus: "Virudhunagar Center",
    rating: 5,
  },
  {
    id: "story-2",
    name: "Karthik S.",
    course: "Python & AI Engineering",
    category: "ai",
    avatar: avatar2,
    college: "Thiagarajar College of Engg",
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
    campus: "Virudhunagar Center",
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
    campus: "Virudhunagar Center",
    rating: 5,
  },
  {
    id: "story-5",
    name: "Anitha Balan",
    course: "Full Stack JavaScript / React",
    category: "full-stack",
    avatar: avatar1,
    college: "Fatima College",
    batch: "BCA Fresher",
    role: "Frontend Engineer Intern",
    headline: "As a non-engineering student, the step-by-step guidance removed all self-doubt.",
    quote: "Coming from a non-engineering degree, I was intimidated by modern frameworks. The mentors at Simatrix took me from HTML fundamentals to building full-scale Next.js web applications with TypeScript. The 1-on-1 lab support is unmatched.",
    highlight: "Next.js & Tailwind SaaS App",
    campus: "Virudhunagar Center",
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
    campus: "Virudhunagar Center",
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
    quote: "Even after course completion, the placement desk arranged direct interviews with partner IT firms in Chennai and Bangalore. Their resume optimization helped my profile pass ATS screening, and the mock HR rounds helped me negotiate my offer with confidence.",
    highlight: "Placed at Chennai IT Hub",
    campus: "Virudhunagar Center",
    rating: 5,
  },
];

export function initials(name = "Student") {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function mergeReviewsWithStories(backendReviews = []) {
  const list = [...STORIES];
  if (!backendReviews?.length) return list;

  const avatars = [avatar1, avatar2, avatar3];

  backendReviews.forEach((item, idx) => {
    const found = list.find((s) => s.name.toLowerCase() === (item.name || "").toLowerCase());
    if (found) {
      if (item.quote || item.content) found.quote = item.quote || item.content;
      if (item.rating) found.rating = item.rating;
    } else if (item.name && (item.quote || item.content)) {
      list.push({
        id: `backend-${item.id || idx}`,
        name: item.name,
        course: item.course || item.designation || "Full Stack Development",
        category: "full-stack",
        avatar: avatars[idx % avatars.length],
        college: "Simatrix Academy Alum",
        batch: "Verified Student",
        role: item.designation || "Software Engineer",
        headline: "“Hands-on projects and direct mentor support made all the difference.”",
        quote: item.quote || item.content,
        highlight: "Verified Placement Support",
        campus: "Virudhunagar Center",
        rating: item.rating || 5,
      });
    }
  });

  return list;
}
