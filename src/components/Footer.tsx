import React, { useState } from 'react';
import { Crosshair, Mail, PhoneCall, Shield, FileText, X, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenRemix: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRemix, onOpenAdmin }) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Behance', href: 'https://behance.net' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'X (Twitter)', href: 'https://x.com' },
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-white/10 pt-16 pb-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <span className="font-black text-2xl tracking-widest text-white font-mono">
                CRE8
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              CRE8 is an independent computer-numerical subtractive design and fabrication laboratory specializing in luxury architectural signage, parametric acoustic relief facades, and solid billet metal artifacts.
            </p>

            <div className="text-[11px] text-zinc-500 space-y-1">
              <div>MACHINING ACCURACY: ±0.025 mm (ISO 2768-m)</div>
              <div>SPINDLE ENVELOPE: 3000 x 1500 x 400 mm</div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">
              Studio Index
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#work" className="hover:text-white transition-colors">
                  Selected Work
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Machinery & Capabilities
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Engineering Journal
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenRemix}
                  className="text-white hover:text-white/80 font-semibold flex items-center gap-1 transition-colors group"
                >
                  <span className="underline underline-offset-4 decoration-white/40 group-hover:decoration-white">3D Remix Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-white" />
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-zinc-500 hover:text-zinc-300">
                  Admin Backend Access
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">
              Direct Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="mailto:nimethsiir@gmail.com"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-white/80 shrink-0" />
                  <span className="truncate">nimethsiir@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/9828351409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+9828351409 (WhatsApp)</span>
                </a>
              </li>
              <li className="text-zinc-500 pt-1">
                Hours: Mon - Sat 08:00 - 19:00 UTC
              </li>
            </ul>
          </div>

          {/* Col 5: Social Channels */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider">
              Follow Laboratory
            </h4>
            <div className="flex flex-col space-y-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Privacy Policy */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} CRE8. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Privacy & Policy
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy & CAD Protection Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto text-zinc-300 text-xs font-sans">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="font-mono text-zinc-400 text-xs uppercase block">Legal Notice & Data Security</span>
              <h3 className="text-xl font-bold uppercase text-white font-sans">
                Privacy & Policy
              </h3>
            </div>

            <div className="space-y-4 leading-relaxed text-zinc-400 text-xs">
              <p>
                <strong>1. Client CAD / Vector Confidentiality:</strong> All files uploaded via the 3D Remix Studio or transmitted to nimethsiir@gmail.com remain the exclusive intellectual property of the submitting client. We treat all STEP, DXF, IGES, and SVG files as strictly confidential and never share or open-source client geometries without explicit written consent.
              </p>
              <p>
                <strong>2. Data Retention & G-Code Archives:</strong> Machining toolpaths generated for custom orders are archived for a period of 24 months solely for re-ordering and warranty servicing, stored in encrypted offline studio servers.
              </p>
              <p>
                <strong>3. Contact Information Usage:</strong> Your phone number (+9828351409 channel) and email (nimethsiir@gmail.com channel) are used solely for direct fabrication updates, CAM clearance proofs, and freight tracking notifications. We do not sell or lease customer communications to any third-party brokers.
              </p>
              <p>
                <strong>4. Material Certification:</strong> Timber and metal stock utilized at CRE8 adhere to sustainable harvesting (FSC certification for hardwoods) and ASTM B16 / AMS-QQ-A-250 aerospace alloy standards.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2.5 rounded bg-amber-400 text-black font-mono font-bold text-xs uppercase"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
