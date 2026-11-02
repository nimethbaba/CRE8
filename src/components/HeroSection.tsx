import React, { useState } from 'react';
import { ThreeCncViewer } from './ThreeCncViewer';
import { CustomSignConfig } from '../types';
import { ArrowRight, Sparkles, Activity, ShieldCheck, Box, Gauge, Layers } from 'lucide-react';

interface HeroSectionProps {
  onOpenRemix: () => void;
  onExploreWork: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenRemix, onExploreWork }) => {
  // Hero 3D demo model configuration
  const [heroConfig, setHeroConfig] = useState<CustomSignConfig>({
    text: 'CRE8 STUDIO',
    subtext: 'SUBTRACTIVE PRECISION',
    font: 'montserrat',
    shape: 'rect-chamfer',
    materialId: 'mat-walnut',
    reliefType: 'emboss-raised',
    reliefDepthMm: 3,
    edgeFinish: 'chamfer-45',
    standoff: 'brass-milled',
    backlight: 'warm',
    widthMm: 480,
    heightMm: 240,
    thicknessMm: 22,
    uploadedImageUri: null,
  });

  const heroMaterials = [
    { id: 'mat-walnut', label: 'Black Walnut', color: '#3e2723' },
    { id: 'mat-aluminum', label: '6061 Aluminum', color: '#d4d8de' },
    { id: 'mat-acrylic-neon', label: 'Edge-Lit Acrylic', color: '#00e5ff' },
    { id: 'mat-brass', label: 'C360 Brass', color: '#e5b85a' },
  ];

  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 overflow-hidden border-b border-white/10 cnc-grid-bg">
      {/* Precision ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Ticker: CNC Machine Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>SPINDLE IDLE // 24,000 RPM READY</span>
            </span>
            <span className="hidden sm:inline text-zinc-500">|</span>
            <span className="hidden sm:flex items-center gap-1 text-zinc-400">
              <Activity className="w-3.5 h-3.5 text-zinc-500" />
              <span>VACUUM HOLD: 98.4 kPa</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>FEED: 8,400 MM/MIN</span>
            <span className="hidden md:inline">CHORDAL TOL: 0.005 MM</span>
            <span className="text-emerald-400">STATUS: CALIBRATED</span>
          </div>
        </div>

        {/* Hero Grid: Typography & 3D Interactive Model */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 animate-fade-in-up">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/15 text-xs font-mono text-zinc-300">
              <Gauge className="w-3.5 h-3.5 text-white" />
              <span>BESPOKE CNC FABRICATION & ARCHITECTURAL LAB</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase font-sans">
                Subtractive <br />
                <span className="text-white">
                  Precision.
                </span>
              </h1>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">
                CRE8 crafts high-tolerance signage, dimensional relief wall panels, and bespoke industrial fixtures. 
                Carved from structural hardwoods, optical cast acrylic, and aerospace alloys with micron accuracy.
              </p>
            </div>

            {/* Quick Material Switcher */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-white" />
                  <span>3D Workpiece Stock Material:</span>
                </span>
                <span className="text-zinc-500 text-[11px]">360° Rotatable</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {heroMaterials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setHeroConfig((prev) => ({ ...prev, materialId: mat.id }))}
                    className={`px-2.5 py-1.5 rounded text-xs font-mono border text-left transition-all duration-200 flex items-center gap-1.5 ${
                      heroConfig.materialId === mat.id
                        ? 'bg-white/15 text-white border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                        : 'bg-zinc-900 text-zinc-400 border-white/10 hover:border-white/20 hover:text-zinc-200'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                      style={{ backgroundColor: mat.color }}
                    />
                    <span className="truncate">{mat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Group: Styled with White Font and White Glow */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenRemix}
                className="px-6 py-3.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white">Launch 3D Remix Studio</span>
                <ArrowRight className="w-4 h-4 ml-1 text-white" />
              </button>

              <button
                onClick={onExploreWork}
                className="px-6 py-3.5 rounded bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/20 hover:border-white/40 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>View Machined Work</span>
              </button>
            </div>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-0.5">
                <div className="text-xl font-bold font-mono text-white">±0.025<span className="text-amber-400 text-sm">mm</span></div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Machining Tolerance</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-bold font-mono text-white">5-Axis<span className="text-amber-400 text-sm">Simul</span></div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Kinematic Freedom</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-bold font-mono text-white">3000<span className="text-amber-400 text-sm">mm</span></div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Max Bed Envelope</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Performance 3D Interactive Turntable (Lazy Loaded) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-xl border border-white/15 bg-zinc-950 p-2 shadow-2xl">
              {/* Corner Registration Crosshairs */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-400/60 pointer-events-none z-10" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-400/60 pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-400/60 pointer-events-none z-10" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-400/60 pointer-events-none z-10" />

              <ThreeCncViewer
                config={heroConfig}
                autoRotate={true}
                lazy={false}
                heightClass="h-[420px] sm:h-[480px] lg:h-[520px]"
                onMaterialChange={(matId) => setHeroConfig((prev) => ({ ...prev, materialId: matId }))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
