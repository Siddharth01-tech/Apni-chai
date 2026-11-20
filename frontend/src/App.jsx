import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';

/**
 * Chaiva Frontend Application:
 * - AuthProvider state management for user login/signup
 * - Routing between Home and the dedicated Sign In / Sign Up page
 * - Dynamic URL state synchronization (popstate support)
 * - Cart count and toast feedback
 */
function MainApp() {
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentPath, setCurrentPath] = useState(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  // Sync state on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    setToastMessage(`Added ${product.name} to your order!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Auth pages route matching
  if (currentPath === '/login' || currentPath === '/signin') {
    return <Auth initialMode="login" onNavigate={navigate} />;
  }

  if (currentPath === '/register' || currentPath === '/signup') {
    return <Auth initialMode="register" onNavigate={navigate} />;
  }

  // Default: Homepage
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
      <Navbar cartCount={cartCount} onNavigate={navigate} />

      {/* SECTIONS 2 to 5: Homepage Content */}
      <main className="flex-grow">
        <Home onAddToCart={handleAddToCart} />
      </main>

      {/* SECTION 6: Dark Forest Green Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
