import React, { useState } from 'react';
import { Menu, X, Sparkles, Lock, ArrowUpRight, Crosshair, PhoneCall, Mail } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'remix' | 'admin';
  setCurrentView: (view: 'home' | 'remix' | 'admin') => void;
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeSection,
  setActiveSection,
  onNavigateSection,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        onNavigateSection(sectionId);
      }, 50);
    } else {
      onNavigateSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo - Pure CRE8 Text without icon or extra text */}
        <div className="flex items-center">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center text-left py-1 group focus:outline-none"
          >
            <span className="font-black text-2xl sm:text-3xl tracking-widest text-white font-mono transition-opacity hover:opacity-85">
              CRE8
            </span>
          </button>
        </div>

        {/* Center Navlinks (Desktop) - Smooth non-shifting box transition */}
        <nav className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-white/10">
          {navItems.map((item) => {
            const isActive = currentView === 'home' && activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-colors duration-200 border ${
                  isActive
                    ? 'text-white bg-zinc-800 border-white/20 shadow-none'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Corner: Admin Shortcut + (Desktop Only) Remix Button + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin shortcut button */}
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? 'Admin Panel Active' : 'Admin Login'}
            className={`p-2 rounded text-xs transition-colors border ${
              isAdminLoggedIn
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-zinc-200 hover:border-white/20'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Quick Contact Icons (Desktop) */}
          <a
            href="https://wa.me/9828351409"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp (+9828351409)"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono text-zinc-400 hover:text-white border border-transparent hover:border-white/20 hover:bg-white/5 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>9828351409</span>
          </a>

          {/* REMIX Button: Desktop only. No persistent glow after entering or idling */}
          <button
            onClick={() => {
              setCurrentView('remix');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hidden md:flex relative group overflow-hidden px-5 py-2 rounded text-xs font-mono uppercase tracking-wider font-semibold border transition-all duration-200 ${
              currentView === 'remix'
                ? 'bg-white text-black border-white shadow-none'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/30 shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] active:scale-95'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Remix</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/98 border-b border-white/15 px-5 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase border-b border-white/10 pb-2">
            Navigation Menu
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left px-3 py-2.5 rounded bg-zinc-900 border border-white/10 text-sm font-medium text-zinc-300 hover:text-white hover:border-white/30"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setCurrentView('remix');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open 3D Remix Studio</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded bg-zinc-900 border border-white/10 text-zinc-300 text-xs font-mono flex items-center justify-center gap-2 hover:border-white/30"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isAdminLoggedIn ? 'Open Admin Portal' : 'Admin Login'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
              <a
                href="mailto:nimethsiir@gmail.com"
                className="p-2 rounded bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-300" />
                <span className="truncate">Email Studio</span>
              </a>
              <a
                href="https://wa.me/9828351409"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-zinc-300" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
