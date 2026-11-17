import React, { useState } from 'react';

/**
 * Navbar component for Chaiva:
 * - Brand logo with minimalist Indian chai cup icon
 * - Center links: Home, Menu, About, Orders (Home with active indicator)
 * - Right utility actions: Search, Account/Profile, Shopping Cart (badge count 0)
 * - Mobile responsive drawer with toggle
 */
export default function Navbar({ cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Active route helper
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8EAE6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Brand Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#203F2D] rounded-lg"
              aria-label="Chaiva Home"
            >
              {/* Minimal Indian Chai Cup Icon */}
              <div className="w-9 h-9 rounded-full bg-[#EAF0EA] flex items-center justify-center text-[#203F2D] group-hover:bg-[#203F2D] group-hover:text-white transition-colors duration-200">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:scale-105"
                >
                  {/* Cup body & handle */}
                  <path d="M4 11h13a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V11z" />
                  <path d="M17 11v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2" />
                  {/* Saucer */}
                  <path d="M2 19h17" />
                  {/* Steam / Leaf curl */}
                  <path d="M8 4c0 2 1.5 3 1.5 5" strokeWidth="1.7" />
                  <path d="M12 3c0 2 1.5 3 1.5 6" strokeWidth="1.7" />
                </svg>
              </div>

              {/* Brand Name */}
              <span className="font-serif font-bold text-2xl text-[#20251F] tracking-tight group-hover:text-[#203F2D] transition-colors">
                Chaiva
              </span>
            </a>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main navigation">
            <a
              href="/"
              className={`relative py-1 text-sm font-medium transition-colors ${
                currentPath === '/'
                  ? 'text-[#20251F] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#20251F] after:rounded-full'
                  : 'text-[#20251F]/80 hover:text-[#203F2D]'
              }`}
            >
              Home
            </a>
            <a
              href="/menu"
              className={`relative py-1 text-sm font-medium transition-colors ${
                currentPath === '/menu'
                  ? 'text-[#20251F] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#20251F] after:rounded-full'
                  : 'text-[#20251F]/80 hover:text-[#203F2D]'
              }`}
            >
              Menu
            </a>
            <a
              href="/about"
              className={`relative py-1 text-sm font-medium transition-colors ${
                currentPath === '/about'
                  ? 'text-[#20251F] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#20251F] after:rounded-full'
                  : 'text-[#20251F]/80 hover:text-[#203F2D]'
              }`}
            >
              About
            </a>
            <a
              href="/orders"
              className={`relative py-1 text-sm font-medium transition-colors ${
                currentPath === '/orders'
                  ? 'text-[#20251F] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#20251F] after:rounded-full'
                  : 'text-[#20251F]/80 hover:text-[#203F2D]'
              }`}
            >
              Orders
            </a>
          </nav>

          {/* RIGHT: Actions (Search, Account, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search Icon / Toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#20251F] hover:text-[#203F2D] hover:bg-[#EAF0EA]/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#203F2D]"
              aria-label="Search chai"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Profile / Account Icon */}
            <a
              href="/login"
              className="p-2 text-[#20251F] hover:text-[#203F2D] hover:bg-[#EAF0EA]/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#203F2D]"
              aria-label="Customer Account"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </a>

            {/* Shopping Cart with Badge */}
            <a
              href="/cart"
              className="relative p-2 text-[#20251F] hover:text-[#203F2D] hover:bg-[#EAF0EA]/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#203F2D]"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {/* Badge */}
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#203F2D] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                {cartCount}
              </span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#20251F] hover:text-[#203F2D] hover:bg-[#EAF0EA] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#203F2D]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Drawer (Expandable) */}
        {searchOpen && (
          <div className="py-3 pb-4 border-t border-[#E8EAE6] animate-fadeIn">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for Masala, Adrak, Elaichi Chai..."
                className="w-full bg-[#EAF0EA]/60 border border-[#E8EAE6] rounded-full px-4 py-2 pl-10 text-sm text-[#20251F] placeholder:text-[#666B65] focus:outline-none focus:border-[#203F2D] focus:bg-white"
                autoFocus
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3.5 top-3 text-[#666B65]"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        )}

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8EAE6] space-y-2 animate-fadeIn bg-white">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/' ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              Home
            </a>
            <a
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/menu' ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              Menu
            </a>
            <a
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/about' ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              About
            </a>
            <a
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/orders' ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              Orders
            </a>
            <div className="pt-2 border-t border-[#E8EAE6] flex items-center justify-between px-3">
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#203F2D] hover:underline"
              >
                Sign In / Account
              </a>
              <a
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#203F2D] hover:underline flex items-center gap-1"
              >
                Cart ({cartCount})
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
