import React, { useState } from 'react';
import { INITIAL_BLOG_POSTS } from '../data/mockData';
import { BlogArticle } from '../types';
import { BookOpen, Calendar, Clock, Eye, ThumbsUp, ArrowRight, Tag } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const BlogSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});

  const categories = ['all', 'CAM & Toolpaths', 'Materials Engineering', 'Precision Craft', 'CNC Optimization'];

  const filteredPosts = activeCategory === 'all'
    ? INITIAL_BLOG_POSTS
    : INITIAL_BLOG_POSTS.filter((post) => post.category === activeCategory);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedArticles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle escape key to close reader modal and lock background scroll
  React.useEffect(() => {
    if (!selectedArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  return (
    <section id="blog" className="pt-28 md:pt-36 pb-20 md:pb-28 border-b border-white/10 bg-[#09090b] relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-white/15 text-xs font-mono text-zinc-300">
                <BookOpen className="w-3.5 h-3.5 text-white" />
                <span>CRE8 TECHNICAL JOURNAL & INSIGHTS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-sans">
                Subtractive Insights.
              </h2>
              <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
                Technical field notes, feeds & speeds formulas, tooling benchmarks, and design-for-machining whitepapers from our studio floor.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-zinc-950 border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-white/15 text-white border border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.25)] font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {cat === 'all' ? 'All Articles' : cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CNC Precision Laser Hairline */}
        <ScrollReveal variant="laser-line" className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Blog Posts Grid with Staggered Scroll-down Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((article, index) => {
            const isLiked = likedArticles[article.id];
            const currentLikes = article.stats.likes + (isLiked ? 1 : 0);

            return (
              <ScrollReveal key={article.id} variant="fade-up" delay={index * 120} duration={650}>
                <article
                  onClick={() => setSelectedArticle(article)}
                  className="group p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-full"
                >
                  <div className="space-y-3">
                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/10">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{article.stats.views}</span>
                      </span>
                      <button
                        onClick={(e) => toggleLike(article.id, e)}
                        className={`flex items-center gap-1 transition-colors ${
                          isLiked ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{currentLikes}</span>
                      </button>
                    </div>

                    <span className="text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                      <span>Read Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Reader Modal: Spaced below navbar, no top close button, clean bottom close */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-28 pb-8 px-4 sm:px-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-white/20 shadow-2xl flex flex-col max-h-[calc(100vh-9.5rem)] overflow-hidden my-auto sm:my-2"
          >
            {/* Modal Header: Clean Category & Read Time, NO top close button */}
            <div className="shrink-0 p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-950/95">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                  {selectedArticle.category}
                </span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                Press ESC or click outside to close
              </span>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-mono text-zinc-500">{selectedArticle.date}</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-sans">
                  {selectedArticle.title}
                </h2>
                <div className="text-xs font-mono text-zinc-400">
                  By <span className="text-zinc-200">{selectedArticle.author}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/10 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-white" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              {/* Article Content Paragraphs */}
              <div className="space-y-4 text-zinc-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                {selectedArticle.content.map((paragraph, index) => (
                  <p key={index} className="leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Pinned Modal Footer with clear white close button */}
            <div className="shrink-0 p-4 sm:p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-zinc-950">
              <a
                href={`mailto:nimethsiir@gmail.com?subject=Regarding Article: ${encodeURIComponent(
                  selectedArticle.title
                )}`}
                className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-xs font-mono uppercase border border-white/30 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                Discuss with Studio
              </a>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)]"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
