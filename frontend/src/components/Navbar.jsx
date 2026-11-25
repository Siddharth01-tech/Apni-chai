import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';

/**
 * Navbar component for Apni Chai:
 * - Brand logo with minimalist Indian chai cup icon
 * - Center links: Home, Menu, About, Orders (Home with active indicator)
 * - Right utility actions: Search, Login pill button / Profile, Shopping Cart (badge count)
 * - Mobile responsive drawer with toggle
 */
export default function Navbar({ cartCount = 0, onNavigate, currentPath: propCurrentPath }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Active route helper
  const currentPath = propCurrentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');

  const handleLink = (path, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8EAE6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Brand Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              onClick={(e) => handleLink('/', e)}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#203F2D] rounded-lg"
              aria-label="Apni Chai Home"
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
                  <path d="M4 11h13a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V11z" />
                  <path d="M17 11v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2" />
                  <path d="M2 19h17" />
                  <path d="M8 4c0 2 1.5 3 1.5 5" strokeWidth="1.7" />
                  <path d="M12 3c0 2 1.5 3 1.5 6" strokeWidth="1.7" />
                </svg>
              </div>

              {/* Brand Name */}
              <span className="font-serif font-bold text-2xl text-[#20251F] tracking-tight group-hover:text-[#203F2D] transition-colors">
                Apni Chai
              </span>
            </a>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main navigation">
            <a
              href="/"
              onClick={(e) => handleLink('/', e)}
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
              onClick={(e) => handleLink('/menu', e)}
              className={`relative py-1 text-sm font-medium transition-colors ${
                currentPath === '/menu' || currentPath.startsWith('/menu/')
                  ? 'text-[#20251F] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#20251F] after:rounded-full'
                  : 'text-[#20251F]/80 hover:text-[#203F2D]'
              }`}
            >
              Chai Menu
            </a>
            <a
              href="/about"
              onClick={(e) => handleLink('/about', e)}
              className={`relative py-1 text-sm font-medium transition-colors ${
                currentPath === '/about'
                  ? 'text-[#20251F] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#20251F] after:rounded-full'
                  : 'text-[#20251F]/80 hover:text-[#203F2D]'
              }`}
            >
              Discover
            </a>
            <a
              href="/orders"
              onClick={(e) => handleLink('/orders', e)}
              className={`relative py-1 text-sm font-medium transition-colors ${
                currentPath === '/orders'
                  ? 'text-[#20251F] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#20251F] after:rounded-full'
                  : 'text-[#20251F]/80 hover:text-[#203F2D]'
              }`}
            >
              My Orders
            </a>
          </nav>

          {/* RIGHT: Actions (Search, Login Pill / Account, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon / Toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#20251F] hover:text-[#203F2D] hover:bg-[#EAF0EA]/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#203F2D] cursor-pointer"
              aria-label="Search chai"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Shopping Cart with Badge */}
            <a
              href="/cart"
              onClick={(e) => handleLink('/cart', e)}
              className="relative p-2 text-[#20251F] hover:text-[#203F2D] hover:bg-[#EAF0EA]/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#203F2D]"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#203F2D] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                {cartCount}
              </span>
            </a>

            {/* Auth State: Login Pill Button or User Profile Pill & Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-[#EAF0EA] border border-[#E8EAE6] transition-all cursor-pointer group"
                  aria-label="Account Menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-[#203F2D] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium text-[#20251F] max-w-[100px] truncate">
                    {user?.name ? user.name.split(' ')[0] : 'Account'}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-[#666B65] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8EAE6] py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-[#E8EAE6]">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#20251F] truncate">{user?.name || 'Chai Lover'}</p>
                        {user?.role === 'admin' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#8B6532]/10 text-[#8B6532] border border-[#8B6532]/30">
                            Admin
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#EAF0EA] text-[#203F2D]">
                            Customer
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#666B65] truncate mt-0.5">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {user?.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLink('/admin');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-[#8B6532] font-semibold hover:bg-[#8B6532]/10 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLink('/orders');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#20251F] hover:bg-[#EAF0EA] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <span>My Orders</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLink('/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#20251F] hover:bg-[#EAF0EA] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Profile & Addresses</span>
                      </button>
                    </div>

                    <div className="border-t border-[#E8EAE6] pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#B42318] hover:bg-[#FEECEB] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                onClick={(e) => handleLink('/login', e)}
                className="hidden sm:inline-flex items-center justify-center bg-[#203F2D] hover:bg-[#294B36] text-white text-xs sm:text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
              >
                Login
              </a>
            )}

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
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleLink('/', e);
              }}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/' ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              Home
            </a>
            <a
              href="/menu"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleLink('/menu', e);
              }}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/menu' || currentPath.startsWith('/menu/') ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              Chai Menu
            </a>
            <a
              href="/about"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleLink('/about', e);
              }}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/about' ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              Discover
            </a>
            <a
              href="/orders"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleLink('/orders', e);
              }}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                currentPath === '/orders' ? 'bg-[#EAF0EA] text-[#203F2D] font-semibold' : 'text-[#20251F] hover:bg-[#EAF0EA]/50'
              }`}
            >
              My Orders
            </a>
            <div className="pt-2 border-t border-[#E8EAE6] space-y-2 px-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="w-8 h-8 rounded-full bg-[#203F2D] text-white flex items-center justify-center text-xs font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#20251F] truncate">{user?.name}</p>
                      <p className="text-[10px] text-[#666B65] truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#8B6532]/10 text-[#8B6532]">
                        Admin
                      </span>
                    )}
                  </div>
                  {user?.role === 'admin' && (
                    <a
                      href="/admin"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleLink('/admin', e);
                      }}
                      className="block text-xs font-semibold text-[#8B6532] hover:underline"
                    >
                      Admin Dashboard
                    </a>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <a
                      href="/profile"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleLink('/profile', e);
                      }}
                      className="text-xs text-[#20251F] hover:underline"
                    >
                      Profile & Addresses
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-xs font-medium text-[#B42318]"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <a
                  href="/login"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleLink('/login', e);
                  }}
                  className="text-sm font-medium text-[#203F2D] hover:underline block"
                >
                  Sign In / Create Account
                </a>
              )}
              <div className="pt-1 border-t border-[#E8EAE6]/60 flex items-center justify-between">
                <a
                  href="/cart"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleLink('/cart', e);
                  }}
                  className="text-xs font-medium text-[#20251F] hover:text-[#203F2D] flex items-center gap-1.5"
                >
                  <span>Shopping Cart</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#203F2D] text-white text-[10px] font-bold">
                    {cartCount}
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
