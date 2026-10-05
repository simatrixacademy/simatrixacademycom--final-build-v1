import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const welcome = { from: "bot", text: "Hi! I’m the Simatrix course assistant. How can I help you today?" };
const suggestions = ["Explore courses", "Fees & batches", "Career guidance", "Contact campus"];

function answerFor(input) {
  const text = input.toLowerCase();
  if (/course|learn|program|explore/.test(text)) return { text: "You can explore our practical technology programs and compare their duration, level and learning outcomes.", label: "View all courses", to: "/courses" };
  if (/fee|cost|price|batch|schedule|timing/.test(text)) return { text: "Fees and batch schedules vary by program. Send the Virudhunagar team an enquiry and they’ll share the latest details.", label: "Make an enquiry", to: "/contact" };
  if (/career|guidance|job|placement/.test(text)) return { text: "Our career guidance resources can help you choose a learning path and prepare for your next role.", label: "Career guidance", to: "/career-guidance" };
  if (/contact|phone|call|address|location|campus|virud/.test(text)) return { text: "We’re at 1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001. Call us on +91 93637 93954.", label: "Contact & directions", to: "/contact" };
  if (/review|student|experience/.test(text)) return { text: "Read first-hand experiences shared by learners from the Simatrix community.", label: "Student reviews", to: "/reviews" };
  if (/hello|hi|hey/.test(text)) return { text: "Hello! Ask me about courses, fees, career guidance or our Virudhunagar campus." };
  return { text: "I can help with courses, fees and batches, career guidance, or our Virudhunagar campus. Choose an option below or contact our team for a specific question.", label: "Talk to our team", to: "/contact" };
}

export default function AcademyChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(y > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = (value) => {
    const clean = value.trim();
    if (!clean) return;
    setMessages((current) => [...current, { from: "user", text: clean }, { from: "bot", ...answerFor(clean) }]);
    setInput("");
  };

  const isVisible = scrolled || open;

  return (
    <div
      className={`fixed bottom-20 right-5 z-[80] sm:right-6 lg:bottom-6 transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-8 scale-90 pointer-events-none invisible"
      }`}
    >
    {open && <section role="dialog" aria-label="Simatrix course assistant" className="mb-4 flex h-[min(520px,calc(100vh-110px))] w-[min(380px,calc(100vw-40px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25">
      <header className="flex items-center gap-3 bg-gradient-to-r from-brand-950 to-brand-700 p-4 text-white">
        <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-xl"><i className="ti ti-message-chatbot" /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-800 bg-emerald-400" /></span>
        <div className="min-w-0 flex-1"><h2 className="text-sm font-bold">Simatrix Assistant</h2><p className="text-xs text-brand-100">Online · Replies instantly</p></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-xl text-brand-100 transition hover:bg-white/10 hover:text-white"><i className="ti ti-x text-lg" /></button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Course support</p>
        {messages.map((message, index) => <div key={index} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.from === "user" ? "rounded-br-md bg-brand-700 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>
            <p>{message.text}</p>
            {message.to && <Link to={message.to} onClick={() => setOpen(false)} className="mt-2 inline-flex items-center gap-1 font-bold text-brand-700 hover:text-accent-600">{message.label}<i className="ti ti-arrow-right" /></Link>}
          </div>
        </div>)}
        {messages.length === 1 && <div className="flex flex-wrap gap-2">{suggestions.map((item) => <button key={item} type="button" onClick={() => send(item)} className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50">{item}</button>)}</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={(event) => { event.preventDefault(); send(input); }} className="border-t border-slate-200 bg-white p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
          <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={200} aria-label="Type your message" placeholder="Ask about courses..." className="min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
          <button type="submit" disabled={!input.trim()} aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-700 text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"><i className="ti ti-send" /></button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">For specific advice, please contact our campus team.</p>
      </form>
    </section>}

    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close chat" : "Open course assistant"} tabIndex={open ? -1 : 0} className={`group relative ml-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-950 text-2xl text-white shadow-xl shadow-brand-900/35 transition hover:-translate-y-1 hover:shadow-2xl ${open ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"}`}>
      <i className="ti ti-message-chatbot transition group-hover:scale-110" />
      <span className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
    </button>
  </div>
  );
}
