import React from 'react';

/**
 * Footer component for Chaiva:
 * - Solid dark forest-green background: #203F2D
 * - Left: Chaiva white logo + "Good Chai. Good Mood."
 * - Center: Home, Menu, About, Orders
 * - Right: Social icons (Instagram, Twitter/X, Facebook, YouTube)
 * - Divider line
 * - Bottom: Copyright 2026 & Legal links
 */
export default function Footer({ onNavigate }) {
  const handleLink = (path, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <footer className="bg-[#203F2D] text-white pt-14 pb-10 border-t border-[#203F2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top / Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 text-center md:text-left">
          
          {/* LEFT: Brand Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <a
              href="/"
              onClick={(e) => handleLink('/', e)}
              className="flex items-center gap-2.5 group"
              aria-label="Chaiva Home"
            >
              {/* White Minimal Chai Cup */}
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 11h13a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V11z" />
                  <path d="M17 11v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2" />
                  <path d="M2 19h17" />
                  <path d="M8 4c0 2 1.5 3 1.5 5" strokeWidth="1.6" />
                  <path d="M12 3c0 2 1.5 3 1.5 6" strokeWidth="1.6" />
                </svg>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                Chaiva
              </span>
            </a>
            <p className="mt-2 text-xs sm:text-sm text-white/80 font-normal tracking-wide">
              Good Chai. Good Mood.
            </p>
          </div>

          {/* CENTER: Navigation Links */}
          <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-8" aria-label="Footer navigation">
            <a
              href="/"
              onClick={(e) => handleLink('/', e)}
              className="text-sm text-white/90 hover:text-white transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="/menu"
              onClick={(e) => handleLink('/menu', e)}
              className="text-sm text-white/90 hover:text-white transition-colors duration-200"
            >
              Menu
            </a>
            <a
              href="/about"
              onClick={(e) => handleLink('/about', e)}
              className="text-sm text-white/90 hover:text-white transition-colors duration-200"
            >
              About
            </a>
            <a
              href="/orders"
              onClick={(e) => handleLink('/orders', e)}
              className="text-sm text-white/90 hover:text-white transition-colors duration-200"
            >
              Orders
            </a>
          </nav>

          {/* RIGHT: Social Media Links */}
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/15 my-8" />

        {/* BOTTOM: Legal & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/70">
          <p>© 2026 Chaiva. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/30" aria-hidden="true">|</span>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
