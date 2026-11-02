import React from 'react';
import { Cpu, ShieldCheck, Wrench, Sparkles, PhoneCall, Mail, Compass, Layers, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const AboutSection: React.FC = () => {
  const machinerySpecs = [
    {
      title: '5-Axis Simultaneous Machining Center',
      desc: '3000 x 1500 x 400 mm volumetric working envelope equipped with 24,000 RPM HSD spindle and high-pressure MQL mist cooling.',
      tag: 'HEAVY CNC MILL',
    },
    {
      title: 'Industrial High-Flow Vacuum Platen',
      desc: 'Multi-zone zoned vacuum clamping table generating 98.4 kPa of hold-down force, allowing zero-clamp perimeter machining on delicate thin sheets.',
      tag: 'FIXTURING',
    },
    {
      title: 'Sub-Micrograin Solid Carbide Tooling',
      desc: 'Diamond-Like Carbon (DLC) and TiAlN coated endmills, tapered ballnose carvers, and mirror-polished single O-flutes for optical plastics.',
      tag: 'TOOLING',
    },
    {
      title: 'Digital Metrology & Laser Inspection',
      desc: 'Every completed workpiece is scanned against initial CAM CAD models using digital optical calipers ensuring ±0.025 mm dimensional compliance.',
      tag: 'QUALITY ASSURANCE',
    },
  ];

  const materialCompetencies = [
    {
      name: 'Structural Hardwoods',
      species: 'Black Walnut, White Oak, Ash, Maple',
      notes: 'Kiln-dried to 8% moisture content. Finished with organic hardwax oils to preserve natural wood breathing without grain warping.',
    },
    {
      name: 'Optical Cast Acrylics',
      species: 'Cell Cast PMMA, Frosted, Smoked, Fluorescent',
      notes: 'Diamond fly-cut face milling and flame-polished edge profiles designed for maximum internal photon reflection in edge-lit signs.',
    },
    {
      name: 'Non-Ferrous Billets',
      species: '6061-T6 Aluminum, C360 Free-Machining Brass, Titanium',
      notes: 'Milled from solid aerospace plates. Surface finished via ceramic bead blasting, directional grain brushing, and Type III hard anodizing.',
    },
  ];

  return (
    <section id="about" className="pt-24 md:pt-32 pb-20 md:pb-28 border-b border-white/10 bg-[#09090b] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header with Scroll Reveal */}
        <ScrollReveal variant="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-white/15 text-xs font-mono text-zinc-300">
                <Compass className="w-3.5 h-3.5 text-white" />
                <span>THE CRE8 MANIFESTO</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-sans">
                Micron Precision Meets Natural Substance.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                Founded by master maker Nimeth Siir, <strong className="text-white">CRE8</strong> was established on a radical principle: subtractive computer-numerical manufacturing shouldn't be reserved for sterile aerospace parts alone. 
              </p>
              <p>
                We merge the speed of modern CAD/CAM algorithms with the tactile warmth of American hardwoods and the crisp specular highlights of machined metals. Whether crafting a single architectural boardroom centerpiece or a serialized run of custom dimensional signs, we obsess over every chip clearance pass, tool lead angle, and surface scallop height.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="mailto:nimethsiir@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/40 text-xs font-mono text-white shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span className="text-white">nimethsiir@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/9828351409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/40 text-xs font-mono text-white shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-white" />
                  <span className="text-white">+9828351409</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CNC Precision Laser Hairline */}
        <ScrollReveal variant="laser-line" className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Machinery Capabilities Matrix with Staggered Scroll-down Entrance */}
        <div className="space-y-6">
          <ScrollReveal variant="fade-up">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold font-mono uppercase tracking-wide text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-white" />
                <span>Studio Machinery & Tolerances</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">ISO 2768-m COMPLIANT</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {machinerySpecs.map((item, index) => (
              <ScrollReveal key={item.title} variant="fade-up" delay={index * 90}>
                <div
                  className="p-5 rounded-xl bg-zinc-950 border border-white/10 space-y-3 hover:border-white/30 transition-colors h-full"
                >
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/10">
                    {item.tag}
                  </span>
                  <h4 className="text-sm font-bold text-white font-sans uppercase">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Material Disciplines with Scroll Reveal */}
        <ScrollReveal variant="fade-up" delay={150}>
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/15 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-sans uppercase text-white">
                Raw Material Disciplines
              </h3>
              <p className="text-xs text-zinc-400">
                Every raw billet and slab that enters CRE8 is certified for dimensional stability and grain orientation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {materialCompetencies.map((mat) => (
                <div key={mat.name} className="space-y-2 p-4 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-colors">
                  <div className="text-sm font-bold font-mono text-white uppercase">
                    {mat.name}
                  </div>
                  <div className="text-xs font-mono text-zinc-300">
                    {mat.species}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {mat.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
