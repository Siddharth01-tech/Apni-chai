import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';

/**
 * Chaiva Frontend Application:
 * - AuthProvider state management for user login/signup
 * - Routing between Home, Chai Menu (/menu), and Product Details (/menu/:slug)
 * - Dedicated Sign In / Sign Up page (/login, /signup) matching reference design
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

  const handleAddToCart = (productOrItem) => {
    const qty = productOrItem?.quantity || 1;
    setCartCount((prev) => prev + qty);
    const itemName = productOrItem?.name || productOrItem?.product?.name || 'Chai';
    const sizePart = productOrItem?.sizeLabel ? ` (${productOrItem.sizeLabel})` : '';
    setToastMessage(`Added ${itemName}${sizePart} to your order!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Auth pages route matching (Dedicated Sign In / Sign Up full view matching reference)
  if (currentPath === '/login' || currentPath === '/signin') {
    return <Auth initialMode="login" onNavigate={navigate} />;
  }

  if (currentPath === '/register' || currentPath === '/signup') {
    return <Auth initialMode="register" onNavigate={navigate} />;
  }

  // Determine main body view based on route
  const renderCurrentView = () => {
    // Product Detail: /menu/:slug
    if (currentPath.startsWith('/menu/') && currentPath.length > 6) {
      const slug = currentPath.replace(/^\/menu\//, '').split('?')[0].split('#')[0];
      return (
        <ProductDetail
          slug={slug}
          onNavigate={navigate}
          onAddToCart={handleAddToCart}
        />
      );
    }

    // Chai Menu Page: /menu
    if (currentPath === '/menu' || currentPath.startsWith('/menu')) {
      return (
        <Menu
          onNavigate={navigate}
          onAddToCart={handleAddToCart}
        />
      );
    }

    // Default: Home Page
    return (
      <Home
        onNavigate={navigate}
        onAddToCart={handleAddToCart}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#20251F] flex flex-col justify-between selection:bg-[#EAF0EA] selection:text-[#203F2D]">
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

      {/* Navigation Bar */}
      <Navbar cartCount={cartCount} onNavigate={navigate} currentPath={currentPath} />

      {/* Main Page Content */}
      <main className="flex-grow">
        {renderCurrentView()}
      </main>

      {/* Dark Forest Green Footer */}
      <Footer onNavigate={navigate} />
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
