/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WorkSection } from './components/WorkSection';
import { AboutSection } from './components/AboutSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { RemixStudio } from './components/RemixStudio';
import { AdminPortal } from './components/AdminPortal';
import { CustomSignConfig, CustomOrder, InventoryItem, Subscriber, OrderStatus } from './types';
import { INITIAL_ORDERS, INITIAL_INVENTORY } from './data/mockData';
import { ScrollProgressBar } from './components/ScrollReveal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'remix' | 'admin'>('home');
  const [activeSection, setActiveSection] = useState<string>('work');
  const [remixPreset, setRemixPreset] = useState<Partial<CustomSignConfig> | undefined>(undefined);
  const [isAdminLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Persistent Orders
  const [orders, setOrders] = useState<CustomOrder[]>(() => {
    try {
      const saved = localStorage.getItem('cre8_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Persistent Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cre8_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Persistent Newsletter Subscribers / Leads
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const saved = localStorage.getItem('cre8_subscribers');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'sub-1',
              email: 'marcus@vancedesign.ch',
              subscribedAt: '2026-10-28 11:20',
              source: 'Website Footer Bar',
            },
            {
              id: 'sub-2',
              email: 'elena@solaris-tech.io',
              subscribedAt: '2026-10-30 15:45',
              source: '3D Remix Studio',
            },
          ];
    } catch {
      return [];
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('cre8_orders', JSON.stringify(orders));
    } catch {
      // Ignored
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('cre8_inventory', JSON.stringify(inventory));
    } catch {
      // Ignored
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('cre8_subscribers', JSON.stringify(subscribers));
    } catch {
      // Ignored
    }
  }, [subscribers]);

  // Section observer to update active navlink
  const isNavigatingRef = React.useRef(false);
  const navTimeoutRef = React.useRef<number | null>(null);

  useEffect(() => {
    if (currentView !== 'home') return;

    const sections = ['work', 'about', 'blog', 'contact'];
    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      const scrollPos = window.scrollY + 200;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    isNavigatingRef.current = true;
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 700);

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenRemixWithPreset = (preset: Partial<CustomSignConfig>) => {
    setRemixPreset(preset);
    setCurrentView('remix');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitOrder = (newOrder: CustomOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  const handleUpdateStock = (itemId: string, newQty: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stockQuantity: newQty,
              status: newQty === 0 ? 'Reorder' : newQty <= item.minThreshold ? 'Low Stock' : 'In Stock',
            }
          : item
      )
    );
  };

  const handleAddInventoryItem = (newItem: InventoryItem) => {
    setInventory((prev) => [newItem, ...prev]);
  };

  const handleSubscribe = (subscriber: Subscriber) => {
    setSubscribers((prev) => [subscriber, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
      {/* CNC Precision Laser Scroll Hairline Indicator */}
      <ScrollProgressBar />

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setShowAdminModal(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main View Router with Smooth Transitions */}
      <main className="flex-1 transition-all duration-300 ease-out">
        {currentView === 'home' && (
          <div key="view-home" className="animate-fade-in">
            <HeroSection
              onOpenRemix={() => {
                setRemixPreset(undefined);
                setCurrentView('remix');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreWork={() => handleNavigateSection('work')}
            />

            <WorkSection onRemixProject={handleOpenRemixWithPreset} />

            <AboutSection />

            <BlogSection />

            <NewsletterSection onSubscribe={handleSubscribe} />

            <ContactSection />
          </div>
        )}

        {currentView === 'remix' && (
          <div key="view-remix" className="animate-fade-in">
            <RemixStudio
              initialConfig={remixPreset}
              onBackToHome={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSubmitOrder={handleSubmitOrder}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenRemix={() => {
          setRemixPreset(undefined);
          setCurrentView('remix');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

      {/* Admin Portal Modal (Orders, Inventory Tracking, Newsletter Leads) */}
      {showAdminModal && (
        <AdminPortal
          orders={orders}
          inventory={inventory}
          subscribers={subscribers}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onUpdateStock={handleUpdateStock}
          onAddInventoryItem={handleAddInventoryItem}
          onClose={() => setShowAdminModal(false)}
          isLoggedIn={isAdminLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </div>
  );
}
