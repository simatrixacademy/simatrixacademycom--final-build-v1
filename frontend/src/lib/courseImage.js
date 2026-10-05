import { mediaUrl } from "../api/client";

/**
 * Resolves high-resolution, unwatermarked course thumbnails from /courses2/
 * for all Simatrix Academy programs and career tracks.
 */
export function getCourseImage(course) {
  if (!course) return "/courses2/mern-full-stack.jpeg";

  // If already pointing to /courses2/, return it
  if (course.image && (course.image.startsWith("/courses2/") || course.image.startsWith("courses2/"))) {
    return course.image.startsWith("/") ? course.image : `/${course.image}`;
  }

  // If a custom admin upload (e.g. /uploads/...) or external URL, use it
  if (course.image && (course.image.startsWith("http") || course.image.startsWith("/uploads/") || course.image.startsWith("uploads/"))) {
    return mediaUrl(course.image);
  }

  const slug = (course.slug || "").toLowerCase();
  const title = (course.title || "").toLowerCase();
  const cat = (course.category?.name || course.category?.slug || "").toLowerCase();
  const combined = `${slug} ${title} ${cat}`;

  // 1. MEAN Full Stack (MongoDB, Express, Angular, Node)
  if (combined.includes("mean")) {
    return "/courses2/mean-full-stack.jpeg";
  }

  // 2. MERN Full Stack & React Development
  if (combined.includes("mern") || combined.includes("react")) {
    return "/courses2/mern-full-stack.jpeg";
  }

  // 3. Python Full Stack & Python Programming
  if (combined.includes("python")) {
    // If it's pure data science with python, route to AI/Data Science below if explicitly data science
    if (combined.includes("data science") || combined.includes("data-science")) {
      return "/courses2/ai-machine-learning.jpeg";
    }
    return "/courses2/python-full-stack.jpeg";
  }

  // 4. Java Full Stack & Java Programming
  if (combined.includes("java") || combined.includes("spring")) {
    return "/courses2/java-full-stack.jpeg";
  }

  // 5. AI & Machine Learning, Data Science, Deep Learning
  if (
    combined.includes("ai") ||
    combined.includes("artificial") ||
    combined.includes("machine learning") ||
    combined.includes("machine-learning") ||
    combined.includes("data science") ||
    combined.includes("data-science") ||
    combined.includes("gen-ai") ||
    combined.includes("deep learning")
  ) {
    return "/courses2/ai-machine-learning.jpeg";
  }

  // 6. Data Analytics, Business Intelligence, Digital Marketing, SAP
  if (
    combined.includes("analytics") ||
    combined.includes("power bi") ||
    combined.includes("tableau") ||
    combined.includes("marketing") ||
    combined.includes("sap") ||
    combined.includes("business")
  ) {
    return "/courses2/data-analytics.jpeg";
  }

  // 7. Cloud Computing, AWS, Azure, GCP, DevOps
  if (
    combined.includes("cloud") ||
    combined.includes("aws") ||
    combined.includes("azure") ||
    combined.includes("gcp") ||
    combined.includes("devops") ||
    combined.includes("docker") ||
    combined.includes("kubernetes")
  ) {
    return "/courses2/cloud-devops.jpeg";
  }

  // 8. Cybersecurity, Networking, Ethical Hacking, CCNA, CCNP, CompTIA Security+
  if (
    combined.includes("cyber") ||
    combined.includes("security") ||
    combined.includes("ccna") ||
    combined.includes("ccnp") ||
    combined.includes("cisco") ||
    combined.includes("hacking") ||
    combined.includes("network")
  ) {
    return "/courses2/cyber-security.jpeg";
  }

  // 9. Full-Stack fallback
  if (combined.includes("full-stack") || combined.includes("full stack") || combined.includes("web")) {
    return "/courses2/mern-full-stack.jpeg";
  }

  // 10. Default clean fallback
  return "/courses2/mern-full-stack.jpeg";
}

export default getCourseImage;
