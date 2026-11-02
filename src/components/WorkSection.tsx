import React, { useState } from 'react';
import { INITIAL_PROJECTS } from '../data/mockData';
import { PortfolioProject, MaterialCategory, CustomSignConfig } from '../types';
import { ThreeCncViewer } from './ThreeCncViewer';
import { Sparkles, Eye, X, Layers, Cpu, Compass, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface WorkSectionProps {
  onRemixProject: (preset: Partial<CustomSignConfig>) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ onRemixProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = selectedCategory === 'all'
    ? INITIAL_PROJECTS
    : INITIAL_PROJECTS.filter((p) => p.category === selectedCategory);

  const categories: { id: MaterialCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'wood', label: 'Hardwood' },
    { id: 'metal', label: 'Billet Metal' },
    { id: 'acrylic', label: 'Cast Acrylic' },
    { id: 'hybrid', label: 'Hybrids' },
  ];

  return (
    <section id="work" className="pt-24 md:pt-32 pb-20 md:pb-28 border-b border-white/10 bg-[#09090b] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-white/15 text-xs font-mono text-zinc-300">
                <Layers className="w-3.5 h-3.5 text-white" />
                <span>SELECTED CNC PORTFOLIO</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-sans">
                Subtractive Artifacts.
              </h2>
              <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
                Explore precision 3-axis and 5-axis milled creations. Click any design to inspect the live 3D toolpath geometry and adapt it directly in the Remix Studio.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-zinc-950 border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-white/15 text-white border border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.25)] font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CNC Precision Laser Hairline */}
        <ScrollReveal variant="laser-line" className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Project Grid with Staggered Scroll-down Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} variant="fade-up" delay={index * 90} duration={650}>
              <div
                className="group rounded-xl bg-zinc-950 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-full"
              >
              {/* Graphic Card Header with Stylized Gradient */}
              <div
                className="relative h-60 w-full overflow-hidden flex items-center justify-center p-6 border-b border-white/10"
                style={{ background: project.thumbnailBg }}
              >
                {/* Technical Grid Pattern */}
                <div className="absolute inset-0 opacity-20 cnc-grid-fine" />

                {/* 3D Representation Preview */}
                <div className="relative z-10 text-center space-y-2">
                  <div className="inline-block px-4 py-2 rounded bg-black/60 border border-white/20 backdrop-blur-none shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-sm font-bold font-mono tracking-wider text-white uppercase">
                      {project.title.split(' ')[0]} {project.title.split(' ')[1] || ''}
                    </span>
                    <div className="text-[10px] text-zinc-300 font-mono tracking-widest uppercase mt-0.5">
                      {project.material.split('&')[0]}
                    </div>
                  </div>
                </div>

                {/* Corner Coordinates */}
                <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-400 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                  {project.dimensions}
                </div>

                {/* Tolerance Badge */}
                <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-300 bg-black/70 px-2 py-0.5 rounded border border-white/20">
                  {project.tolerance}
                </div>

                {/* Hover overlay with 3D Inspect Trigger (White Font & White Glow) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="px-4 py-2 rounded bg-black/80 hover:bg-black text-white border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.35)] font-semibold text-xs font-mono uppercase flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Inspect 3D</span>
                  </button>
                  {project.preset3dConfig && (
                    <button
                      onClick={() => onRemixProject(project.preset3dConfig!)}
                      className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 text-white border border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.45)] font-semibold text-xs font-mono uppercase flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span className="text-white">Remix</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Technical Parameters Matrix */}
                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                  <div>
                    <span className="text-zinc-500 block">Tooling:</span>
                    <span className="text-zinc-300 truncate block">{project.tooling}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Run Time:</span>
                    <span className="text-zinc-300 block">{project.machineHours}</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Full Spec Sheet</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  {project.preset3dConfig && (
                    <button
                      onClick={() => onRemixProject(project.preset3dConfig!)}
                      className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 transition-colors font-medium"
                    >
                      <span>Customize in 3D</span>
                      <Sparkles className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* 3D Inspection Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl rounded-2xl bg-zinc-950 border border-white/20 shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[92vh]">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/90 text-zinc-400 hover:text-white border border-white/15"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left 3D Interactive Viewport */}
            <div className="lg:w-7/12 relative bg-[#09090b] flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/15 min-h-[350px] lg:min-h-[550px]">
              {activeModalProject.preset3dConfig ? (
                <ThreeCncViewer
                  config={{
                    text: activeModalProject.preset3dConfig.text || activeModalProject.title,
                    subtext: activeModalProject.preset3dConfig.subtext || 'CRE8 CNC SPEC',
                    font: activeModalProject.preset3dConfig.font || 'montserrat',
                    shape: activeModalProject.preset3dConfig.shape || 'rect-chamfer',
                    materialId: activeModalProject.preset3dConfig.materialId || 'mat-walnut',
                    reliefType: activeModalProject.preset3dConfig.reliefType || 'emboss-raised',
                    reliefDepthMm: activeModalProject.preset3dConfig.reliefDepthMm || 3,
                    edgeFinish: activeModalProject.preset3dConfig.edgeFinish || 'chamfer-45',
                    standoff: activeModalProject.preset3dConfig.standoff || 'brass-milled',
                    backlight: activeModalProject.preset3dConfig.backlight || 'warm',
                    widthMm: activeModalProject.preset3dConfig.widthMm || 450,
                    heightMm: activeModalProject.preset3dConfig.heightMm || 220,
                    thicknessMm: activeModalProject.preset3dConfig.thicknessMm || 20,
                    uploadedImageUri: null,
                  }}
                  autoRotate={true}
                  heightClass="h-full min-h-[380px] lg:min-h-[550px]"
                />
              ) : (
                <div className="p-8 text-center text-zinc-400 font-mono text-xs">
                  Model preview loading...
                </div>
              )}
            </div>

            {/* Right Information & CNC Spec Matrix */}
            <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px] font-mono">
                    <Cpu className="w-3 h-3" />
                    <span>{activeModalProject.category.toUpperCase()} FABRICATION</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-sans uppercase">
                    {activeModalProject.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {activeModalProject.description}
                  </p>
                </div>

                {/* Highlight Specs */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-zinc-500">Machining Specifications:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {activeModalProject.highlightSpecs.map((spec) => (
                      <div key={spec.label} className="p-2.5 rounded bg-zinc-900 border border-white/5 space-y-0.5">
                        <span className="text-[10px] text-zinc-500 block uppercase">{spec.label}</span>
                        <span className="text-zinc-200 font-medium block">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material & Finish */}
                <div className="p-3 rounded bg-zinc-900/60 border border-white/10 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Material Stock:</span>
                    <span className="text-zinc-300">{activeModalProject.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Surface Finish:</span>
                    <span className="text-zinc-300">{activeModalProject.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Spindle Speed:</span>
                    <span className="text-zinc-300">{activeModalProject.spindleRpm}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                {activeModalProject.preset3dConfig && (
                  <button
                    onClick={() => {
                      onRemixProject(activeModalProject.preset3dConfig!);
                      setActiveModalProject(null);
                    }}
                    className="w-full py-3 rounded bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Remix This Workpiece</span>
                  </button>
                )}

                <a
                  href={`mailto:nimethsiir@gmail.com?subject=${encodeURIComponent(
                    `Inquiry regarding ${activeModalProject.title}`
                  )}&body=${encodeURIComponent(
                    `Hello CRE8 Studio,\n\nI am interested in commissioning a project similar to "${activeModalProject.title}" (${activeModalProject.dimensions}).\n\nPlease let me know your lead time and CAM review process.`
                  )}`}
                  className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Request Quote For This Piece</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
