import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children?: React.ReactNode;
  variant?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'laser-line';
  delay?: number; // milliseconds
  duration?: number; // milliseconds
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  // Determine transform & opacity based on variant and visibility
  const getStyle = (): React.CSSProperties => {
    const baseTransition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    switch (variant) {
      case 'fade-up':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
          filter: isVisible ? 'blur(0px)' : 'blur(4px)',
          transition: baseTransition,
          willChange: 'opacity, transform, filter',
        };
      case 'fade-in':
        return {
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          willChange: 'opacity',
        };
      case 'slide-left':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-28px)',
          transition: baseTransition,
          willChange: 'opacity, transform',
        };
      case 'slide-right':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(28px)',
          transition: baseTransition,
          willChange: 'opacity, transform',
        };
      case 'scale-up':
        return {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.96)',
          transition: baseTransition,
          willChange: 'opacity, transform',
        };
      case 'laser-line':
        return {
          transformOrigin: 'left',
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          opacity: isVisible ? 1 : 0,
          transition: `transform ${duration + 200}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms ease ${delay}ms`,
          willChange: 'transform, opacity',
        };
      default:
        return {};
    }
  };

  return (
    <div ref={elementRef} style={getStyle()} className={className}>
      {children}
    </div>
  );
};

/**
 * Top Hairline Scroll Progress Bar for CNC precision aesthetic
 */
export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/5 z-[60] pointer-events-none">
      <div
        className="h-full bg-white transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,255,255,0.7)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
