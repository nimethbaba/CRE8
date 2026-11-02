import React, { useState } from 'react';
import { Mail, PhoneCall, Send, Clock, ShieldCheck, MapPin, Check, Copy } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [materialInterest, setMaterialInterest] = useState('American Black Walnut');
  const [projectBrief, setProjectBrief] = useState('');
  const [formSent, setFormSent] = useState(false);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:nimethsiir@gmail.com?subject=${encodeURIComponent(
      `CRE8 Project RFQ from ${name || 'Client'}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMaterial Interest: ${materialInterest}\n\nProject Brief:\n${projectBrief}`
    )}`;
    window.location.href = mailtoUrl;
    setFormSent(true);
  };

  return (
    <section id="contact" className="pt-24 md:pt-32 pb-20 md:pb-28 border-b border-white/10 bg-[#09090b] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Scroll Reveal */}
        <ScrollReveal variant="fade-up">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-white/15 text-xs font-mono text-zinc-300">
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>DIRECT FABRICATION INQUIRIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-sans">
              Initiate Your Commission.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Send your CAD files, sketches, or project dimensions. Studio founder Nimeth Siir provides direct DFM (Design for Machining) feasibility feedback and quotation within 2 hours.
            </p>
          </div>
        </ScrollReveal>

        {/* CNC Precision Laser Hairline */}
        <ScrollReveal variant="laser-line" className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Channels & Studio Location */}
          <div className="lg:col-span-5 space-y-4">
            <ScrollReveal variant="fade-up" delay={80}>
            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/30 text-white flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <button
                  onClick={() => copyToClipboard('nimethsiir@gmail.com', 'email')}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 p-1.5 rounded bg-zinc-900 border border-white/10"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Direct Studio Email</span>
                <a
                  href="mailto:nimethsiir@gmail.com"
                  className="text-lg font-bold font-mono text-white hover:text-white/80 transition-colors block"
                >
                  nimethsiir@gmail.com
                </a>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Preferred for DXF, STEP, STL, and vector blueprint attachments.
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/30 text-white flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <button
                  onClick={() => copyToClipboard('9828351409', 'phone')}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 p-1.5 rounded bg-zinc-900 border border-white/10"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'Copied' : 'Copy Number'}</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">WhatsApp Instant Desk</span>
                <a
                  href="https://wa.me/9828351409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold font-mono text-white hover:text-white/80 transition-colors block"
                >
                  +9828351409
                </a>
              </div>

              <a
                href="https://wa.me/9828351409?text=Hi%20CRE8%20Studio,%20I'd%20like%20to%20inquire%20about%20a%20custom%20CNC%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded bg-white/10 hover:bg-white/20 border border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Turnaround Guarantee Badge */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center gap-3 text-xs font-mono text-zinc-300">
              <Clock className="w-5 h-5 text-white shrink-0" />
              <span>Studio Response Time: Under 2 Hours on business days.</span>
            </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Project Inquiry (RFQ) Form with ScrollReveal */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="fade-up" delay={160}>
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/15 space-y-6 shadow-2xl">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-sans uppercase text-white">
                    Request Machining Estimate
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Fill in your project requirements for an itemized CAM and material quote.
                  </p>
                </div>

                {!formSent ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                          Your Name:
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Elena Rostova"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-white focus:outline-none text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                          Email Address:
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="elena@company.com"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-white focus:outline-none text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                          WhatsApp / Phone:
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9828351409"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-white focus:outline-none text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                          Primary Material Stock:
                        </label>
                        <select
                          value={materialInterest}
                          onChange={(e) => setMaterialInterest(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-white focus:outline-none text-xs text-white font-mono"
                        >
                          <option value="American Black Walnut">American Black Walnut</option>
                          <option value="Scandinavian White Oak">Scandinavian White Oak</option>
                          <option value="Baltic Birch Plywood">Baltic Birch Plywood</option>
                          <option value="6061-T6 Aircraft Aluminum">6061-T6 Aircraft Aluminum</option>
                          <option value="C360 Architectural Brass">C360 Architectural Brass</option>
                          <option value="Cast Frosted / Neon Acrylic">Cast Frosted / Neon Acrylic</option>
                          <option value="Hybrid Wood + Metal Inlay">Hybrid Wood + Metal Inlay</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">
                        Project Dimensions, Quantities & Scope:
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={projectBrief}
                        onChange={(e) => setProjectBrief(e.target.value)}
                        placeholder="Provide desired dimensions (e.g. 600x300x20mm), mounting conditions, and any vector CAD details..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-white focus:outline-none text-xs text-white font-mono resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] transition-all"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span className="text-white">Transmit Inquiry to nimethsiir@gmail.com</span>
                    </button>
                  </form>
                ) : (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                      <Check className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-bold text-white uppercase font-sans">
                      Inquiry Dispatched!
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Thank you! Your project specs were compiled and sent to nimethsiir@gmail.com. We will respond promptly.
                    </p>
                    <button
                      onClick={() => setFormSent(false)}
                      className="mt-4 px-4 py-2 rounded bg-zinc-900 border border-white/15 text-xs font-mono text-zinc-300"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
