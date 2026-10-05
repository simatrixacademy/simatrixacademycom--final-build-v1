const TIE_UPS = [
  {
    name: "Naan Mudhalvan",
    role: "Govt. of Tamil Nadu Skill Initiative",
    logo: "/tie-ups/naan mudhalvan.png",
    height: "h-8 sm:h-9",
  },
  {
    name: "TNSkill",
    role: "Tamil Nadu Skill Development Corp.",
    logo: "/tie-ups/tnskill-logo.png",
    height: "h-7 sm:h-8",
  },
  {
    name: "National Engineering College",
    role: "Academic Partner (Autonomous)",
    logo: "/tie-ups/national college.webp",
    height: "h-7 sm:h-8",
  },
  {
    name: "Vinsys",
    role: "Global IT & Certification Partner",
    logo: "/tie-ups/vinsys.jpg",
    height: "h-7 sm:h-8",
  },
  {
    name: "Orange Systems",
    role: "Technology Solutions Partner",
    logo: "/tie-ups/Orange Systems Logo.png",
    height: "h-7 sm:h-8",
  },
  {
    name: "Hari Chakra Computers",
    role: "IT & Systems Partner",
    logo: "/tie-ups/hari chakra computers.png",
    height: "h-6 sm:h-7",
  },
];

export default function TieUpsMarquee() {
  const renderLogos = () =>
    TIE_UPS.map((item, index) => (
      <div
        key={`${item.name}-${index}`}
        className="flex items-center justify-center h-14 sm:h-16 px-6 sm:px-8 rounded-xl bg-white border border-slate-200/80 shadow-2xs transition-all duration-300 hover:border-slate-300 hover:shadow-xs shrink-0 group select-none"
        title={`${item.name} - ${item.role}`}
      >
        <img
          src={item.logo}
          alt={`${item.name} logo`}
          className={`${item.height} w-auto max-w-[150px] sm:max-w-[170px] object-contain transition-transform duration-300 group-hover:scale-105`}
          loading="lazy"
          draggable="false"
        />
      </div>
    ));

  return (
    <section
      id="tie-ups"
      aria-label="Academic and Industry Tie-Ups"
      className="relative overflow-hidden bg-slate-50/60 py-3.5 sm:py-4 border-b border-slate-200/80"
    >
      {/* Seamless Marquee with edge fade masks */}
      <div className="marquee relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track flex items-center py-1">
          <div className="flex shrink-0 items-center gap-5 sm:gap-7 pr-5 sm:pr-7">
            {renderLogos()}
          </div>
          <div className="flex shrink-0 items-center gap-5 sm:gap-7 pr-5 sm:pr-7" aria-hidden="true">
            {renderLogos()}
          </div>
        </div>
      </div>
    </section>
  );
}
