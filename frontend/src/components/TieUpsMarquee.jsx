const TIE_UPS = [
  {
    name: "Naan Mudhalvan",
    role: "Govt. of Tamil Nadu Skill Initiative",
    logo: "/tie-ups/naan mudhalvan.png",
    height: "h-11 sm:h-13",
  },
  {
    name: "TNSkill",
    role: "Tamil Nadu Skill Development Corp.",
    logo: "/tie-ups/tnskill-logo.png",
    height: "h-11 sm:h-13",
  },
  {
    name: "National Engineering College",
    role: "Academic Partner (Autonomous)",
    logo: "/tie-ups/national college.webp",
    height: "h-10 sm:h-12",
  },
  {
    name: "Vinsys",
    role: "Global IT & Certification Partner",
    logo: "/tie-ups/vinsys.jpg",
    height: "h-10 sm:h-12",
  },
  {
    name: "Orange Systems",
    role: "Technology Solutions Partner",
    logo: "/tie-ups/Orange Systems Logo.png",
    height: "h-9 sm:h-11",
  },
  {
    name: "Hari Chakra Computers",
    role: "IT & Systems Partner",
    logo: "/tie-ups/hari chakra computers.png",
    height: "h-9 sm:h-11",
  },
];

export default function TieUpsMarquee() {
  const renderLogos = () =>
    TIE_UPS.map((item, index) => (
      <div
        key={`${item.name}-${index}`}
        className="flex items-center justify-center h-20 sm:h-24 px-8 sm:px-11 min-w-[190px] sm:min-w-[220px] rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-slate-300 hover:shadow-md shrink-0 group select-none"
        title={`${item.name} - ${item.role}`}
      >
        <img
          src={item.logo}
          alt={`${item.name} logo`}
          className={`${item.height} w-auto max-w-[180px] sm:max-w-[210px] object-contain transition-transform duration-300 group-hover:scale-105`}
          loading="lazy"
          draggable="false"
        />
      </div>
    ));

  return (
    <section
      id="tie-ups"
      aria-label="Academic and Industry Tie-Ups"
      className="relative overflow-hidden bg-slate-50/60 py-6 sm:py-8 border-b border-slate-200/80"
    >
      {/* Seamless Marquee with edge fade masks */}
      <div className="marquee relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track flex items-center py-2">
          <div className="flex shrink-0 items-center gap-6 sm:gap-8 pr-6 sm:pr-8">
            {renderLogos()}
          </div>
          <div className="flex shrink-0 items-center gap-6 sm:gap-8 pr-6 sm:pr-8" aria-hidden="true">
            {renderLogos()}
          </div>
        </div>
      </div>
    </section>
  );
}
