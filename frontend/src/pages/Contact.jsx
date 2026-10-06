import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Section, Reveal } from "../components/ui";
import EnquiryForm from "../components/EnquiryForm";
import MapEmbed from "../components/MapEmbed";
import { useSeo } from "../lib/useSeo";

const location = {
  name: "Simatrix Academy, Virudhunagar",
  address: "1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001",
  phone: "+91 93637 93954",
  phoneOne: "+91 93637 93954",
  email: "info@simatrixacademy.com",
  map: "https://www.google.com/maps?q=1%2F2A%201st%20Floor%2C%20AA%20Road%2C%20Near%20Head%20Post%20Office%2C%20Virudhunagar%2C%20Tamil%20Nadu%20626001&output=embed",
  directions: "https://www.google.com/maps/search/?api=1&query=1%2F2A+1st+Floor%2C+AA+Road%2C+Near+Head+Post+Office%2C+Virudhunagar%2C+Tamil+Nadu+626001",
};

export default function Contact() {
  const [courses, setCourses] = useState([]);

  useSeo({
    title: "Contact Simatrix Academy — Software Training in Virudhunagar",
    description: "Contact or visit Simatrix Academy — the best software training institute in Virudhunagar. Get course details, batch schedules, fee structure and career guidance.",
    canonical: "/contact",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: location.name,
      email: location.email,

      address: { "@type": "PostalAddress", streetAddress: "1/2A, 1st Floor, AA Road, Near Head Post Office", addressLocality: "Virudhunagar", addressRegion: "Tamil Nadu", postalCode: "626001", addressCountry: "IN" },
    },
  });

  useEffect(() => { api.getCourses().then((res) => setCourses(res.data)).catch(() => {}); }, []);

  return <>
    <section className="relative overflow-hidden bg-brand-950 pb-28 pt-20 text-white sm:pb-32 sm:pt-24">
      <div className="bg-dotgrid absolute inset-0 opacity-40" />
      <div className="aurora pointer-events-none absolute inset-0 opacity-60" />
      <Section className="relative">
        <div className="max-w-3xl">
          <div className="reveal flex items-center gap-3"><span className="h-px w-10 bg-accent-300" /><span className="text-xs font-bold uppercase tracking-[.24em] text-accent-300">Virudhunagar campus</span></div>
          <h1 className="reveal mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl" style={{ "--d": "80ms" }}>Let’s talk about your next step.</h1>
          <p className="reveal mt-5 max-w-2xl text-base leading-7 text-brand-100 sm:text-lg" style={{ "--d": "150ms" }}>Connect with our Virudhunagar team for course guidance, batch schedules and answers tailored to your learning goals.</p>
          <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--d": "220ms" }}>
            <a href="tel:+919363793954" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-400 px-6 font-bold text-brand-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-accent-300"><i className="ti ti-phone-call" /> Call our team</a>
            <a href="https://wa.me/919363793954" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 font-bold text-white backdrop-blur transition hover:bg-white/15"><i className="ti ti-brand-whatsapp text-lg text-emerald-300" /> Chat on WhatsApp</a>
          </div>
        </div>
      </Section>
    </section>

    <Section className="relative -mt-16 pb-20">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <Reveal className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
            <div className="grid sm:grid-cols-[1fr_1.15fr]">
              <div className="p-7 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Our only campus</span>
                <h2 className="mt-5 font-display text-3xl font-semibold text-slate-950">Visit us in Virudhunagar</h2>
                <address className="mt-4 not-italic text-sm leading-7 text-slate-600">{location.address}</address>
                <a href={location.directions} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:text-accent-600">Get directions <i className="ti ti-arrow-up-right" /></a>
              </div>
              <div className="min-h-72 overflow-hidden bg-slate-100"><MapEmbed src={location.map} title="Simatrix Academy Virudhunagar location" /></div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard icon="ti-phone" title="Call us" delay={60}><a href="tel:+919363793954">{location.phone}</a></InfoCard>
            <InfoCard icon="ti-mail" title="Email us" delay={120}><a className="break-all" href={`mailto:${location.email}`}>{location.email}</a></InfoCard>
            <InfoCard icon="ti-clock" title="Opening hours" delay={180}>Mon – Sat: 9 AM – 7 PM<br />Sunday: 10 AM – 3 PM</InfoCard>
          </div>

          <Reveal delay={220} className="rounded-3xl border border-brand-100 bg-brand-50 p-6 sm:p-7">
            <div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-xl text-brand-700 shadow-sm"><i className="ti ti-bulb" /></span><div><h3 className="font-display text-xl font-semibold text-slate-900">Planning a campus visit?</h3><p className="mt-1 text-sm leading-6 text-slate-600">Call ahead and our counsellors can reserve time to discuss the right course, learning format and upcoming batch with you.</p></div></div>
          </Reveal>
        </div>

        <Reveal delay={100} className="scroll-mt-24 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
            <div className="border-b border-slate-100 p-6 sm:p-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                Quick Enquiry
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-slate-950">
                Leave your details — we’ll help you
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500">
                Takes 10 seconds. Our Virudhunagar mentors will reach out to guide you and answer your questions.
              </p>
            </div>
            <div className="p-6 sm:p-7">
              <EnquiryForm courses={courses} compact type="contact" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  </>;
}

function InfoCard({ icon, title, children, delay }) {
  return <Reveal delay={delay} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-lg text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white"><i className={`ti ${icon}`} /></span>
    <h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3><div className="mt-1.5 text-xs leading-6 text-slate-600">{children}</div>
  </Reveal>;
}
