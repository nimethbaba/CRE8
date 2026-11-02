import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Subscriber } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface NewsletterSectionProps {
  onSubscribe: (subscriber: Subscriber) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: email.trim(),
      subscribedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      source: 'Website Footer Bar',
    };

    onSubscribe(newSub);
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-16 border-b border-white/10 bg-zinc-950 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-white/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="rounded-2xl p-8 sm:p-12 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/15 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>THE SUBTRACTIVE DISPATCH</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-sans tracking-tight">
              Get CNC Feeds, Speeds & Vector Drops.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              Receive quarterly technical briefs: cutting tool endurance test results, material grain tearout solutions, and limited 3D sign releases from CRE8.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter engineering / studio email..."
                    className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-white/20 focus:border-white focus:outline-none text-xs text-white font-mono placeholder:text-zinc-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] transition-all shrink-0 active:scale-95"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Zero spam. No third-party tracking. Unsubscribe anytime.</span>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs font-mono animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Subscribed! Welcome to the CRE8 Subtractive Dispatch. Check your inbox for our initial Feeds & Speeds reference card.</span>
              </div>
            )}
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
