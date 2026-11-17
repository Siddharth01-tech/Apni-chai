import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

/**
 * Chaiva Frontend Application:
 * - Clean white background layout
 * - Sticky navigation bar with interactive cart badge (default 0)
 * - Complete Homepage matching the Chaiva design system
 * - Dark forest-green footer
 */
export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    setToastMessage(`Added ${product.name} to your order!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-white text-[#20251F] flex flex-col justify-between selection:bg-[#EAF0EA] selection:text-[#203F2D]">
      {/* Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#203F2D] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium transition-all animate-bounce"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* SECTION 1: Navigation Bar */}
      <Navbar cartCount={cartCount} />

      {/* SECTIONS 2 to 5: Homepage Content */}
      <main className="flex-grow">
        <Home onAddToCart={handleAddToCart} />
      </main>

      {/* SECTION 6: Dark Forest Green Footer */}
      <Footer />
    </div>
  );
}
