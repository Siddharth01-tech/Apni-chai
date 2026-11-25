import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import heroChaiImg from '../assets/hero-chai.jpg';

/**
 * Apni Chai Sign In & Sign Up Page:
 * Matched strictly to the reference design.
 * - Centered two-column card with warm photography & dark green editorial overlay
 * - Pill segmented toggle between Login and Create Account
 * - Warm inputs with right-aligned icons and show/hide password toggle
 * - Full backend API integration with error/success feedback
 */
export default function Auth({ initialMode = 'login', onNavigate }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const { login, register } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Please enter both email and password.');
        return;
      }

      setLoading(true);
      const res = await login(email.trim(), password);
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Welcome back! Login successful.');
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('/');
          } else {
            window.location.href = '/';
          }
        }, 1200);
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } else {
      // Register Mode
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      const res = await register(name.trim(), email.trim(), phone.trim(), password);
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Account created successfully! Welcome to Apni Chai.');
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('/');
          } else {
            window.location.href = '/';
          }
        }, 1200);
      } else {
        setError(res.message || 'Failed to create account.');
      }
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
  };

  const handleLinkClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#20251F] flex flex-col justify-between selection:bg-[#EAF0EA] selection:text-[#203F2D]">
      
      {/* =========================================================================
          TOP NAVBAR: Clean, Focused Header without customer navigation
          ========================================================================= */}
      <header className="w-full bg-white py-4 px-4 sm:px-8 border-b border-[#E8EAE6]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            aria-label="Apni Chai Home"
          >
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
              >
                <path d="M4 11h13a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V11z" />
                <path d="M17 11v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2" />
                <path d="M2 19h17" />
                <path d="M8 4c0 2 1.5 3 1.5 5" strokeWidth="1.7" />
                <path d="M12 3c0 2 1.5 3 1.5 6" strokeWidth="1.7" />
              </svg>
            </div>
            <span className="font-serif font-bold text-2xl text-[#20251F] tracking-tight group-hover:text-[#203F2D] transition-colors">
              Apni Chai
            </span>
          </button>

          {/* Focused Back Action */}
          <button
            type="button"
            onClick={() => handleLinkClick('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#666B65] hover:text-[#203F2D] transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#EAF0EA]/60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Store</span>
          </button>

        </div>
      </header>

      {/* =========================================================================
          CENTER AUTH CARD (Strictly matching reference layout)
          ========================================================================= */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(32,63,45,0.08)] border border-[#E8EAE6] grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          
          {/* -------------------------------------------------------------------
              LEFT COLUMN: Artisanal Visual Banner & Story
              ------------------------------------------------------------------- */}
          <div className="relative md:col-span-5 lg:col-span-6 bg-[#162D20] text-white flex flex-col justify-between p-7 sm:p-10 lg:p-12 overflow-hidden">
            {/* Background Photography with Warm Steam & Spices */}
            <img
              src={heroChaiImg}
              alt="Artisanal steeped Indian chai"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88]"
            />

            {/* Dark green gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#122419]/95 via-[#162E21]/75 to-[#162E21]/45" />

            {/* Top Logo inside Image */}
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                </svg>
              </div>
              <span className="font-serif font-semibold text-lg tracking-wide text-white">
                Apni Chai
              </span>
            </div>

            {/* Center Story & Editorial Heading */}
            <div className="relative z-10 my-auto py-8">
              {/* Translucent Artisanal Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/95 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase mb-5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11h13a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V11z" />
                  <path d="M17 11v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2" />
                  <path d="M2 19h17" />
                </svg>
                <span>ARTISANAL STEEPED TRADITIONS</span>
              </div>

              {/* Serif Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium leading-[1.18] tracking-tight mb-4">
                A Better Day Starts with <br />
                Chai.
              </h2>

              {/* Description Subtext */}
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-sm">
                {mode === 'login'
                  ? 'Sign in and get your favourite chai delivered fresh from slow-simmered brass pots to your cup.'
                  : 'Create an account and get your favourite chai delivered fresh from slow-simmered brass pots to your cup.'}
              </p>
            </div>

            {/* Bottom Badges */}
            <div className="relative z-10 pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90 font-medium">
              <div className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A7D1B5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Fresh Whole Spices</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A7D1B5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Slow Clay Brews</span>
              </div>
            </div>

          </div>

          {/* -------------------------------------------------------------------
              RIGHT COLUMN: Interactive Sign In / Sign Up Form
              ------------------------------------------------------------------- */}
          <div className="md:col-span-7 lg:col-span-6 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            {/* Top Segmented Pill Toggle */}
            <div className="bg-[#EAF0EA]/70 p-1 rounded-full flex max-w-xs mb-8 self-center sm:self-start border border-[#E8EAE6]">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`py-2 px-6 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#203F2D] text-white shadow-sm'
                    : 'text-[#20251F] hover:text-[#203F2D]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className={`py-2 px-5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#203F2D] text-white shadow-sm'
                    : 'text-[#20251F] hover:text-[#203F2D]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Heading & Subtitle */}
            <div className="mb-6">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C3829] tracking-tight">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-xs sm:text-sm text-[#70756E] mt-1.5">
                {mode === 'login'
                  ? 'Sign in to your Apni Chai account.'
                  : 'Join Apni Chai for fresh, slow-brewed chai delivered daily.'}
              </p>
            </div>

            {/* Error & Success Feedback Alerts */}
            {error && (
              <div className="mb-5 bg-[#FEECEB] border border-[#FECDCA] text-[#B42318] text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 bg-[#EDF7EE] border border-[#CDE9D0] text-[#1D6329] text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* FULL NAME (Sign Up only) */}
              {mode === 'register' && (
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#737871] tracking-[0.14em] uppercase block mb-1.5">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-[#F8FAF8] border border-[#E8EAE6] rounded-xl px-4 py-3.5 pr-10 text-sm text-[#20251F] placeholder:text-[#9A9890] focus:outline-none focus:bg-white focus:border-[#203F2D] focus:ring-1 focus:ring-[#203F2D] transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737871] pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M20 21a8 8 0 0 0-16 0" />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {/* EMAIL ADDRESS */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold text-[#737871] tracking-[0.14em] uppercase block mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#F8FAF8] border border-[#E8EAE6] rounded-xl px-4 py-3.5 pr-10 text-sm text-[#20251F] placeholder:text-[#9A9890] focus:outline-none focus:bg-white focus:border-[#203F2D] focus:ring-1 focus:ring-[#203F2D] transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737871] pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* PHONE NUMBER (Sign Up only) */}
              {mode === 'register' && (
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#737871] tracking-[0.14em] uppercase block mb-1.5">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#F8FAF8] border border-[#E8EAE6] rounded-xl px-4 py-3.5 pr-10 text-sm text-[#20251F] placeholder:text-[#9A9890] focus:outline-none focus:bg-white focus:border-[#203F2D] focus:ring-1 focus:ring-[#203F2D] transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737871] pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#737871] tracking-[0.14em] uppercase block">
                    {mode === 'register' ? 'PASSWORD (MIN. 8 CHARACTERS)' : 'PASSWORD'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setError('Password reset instructions will be sent to your email.')}
                      className="text-xs text-[#737871] hover:text-[#1C3829] font-medium transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8FAF8] border border-[#E8EAE6] rounded-xl px-4 py-3.5 pr-10 text-sm text-[#20251F] placeholder:text-[#9A9890] focus:outline-none focus:bg-white focus:border-[#203F2D] focus:ring-1 focus:ring-[#203F2D] transition-all tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737871] hover:text-[#1C3829] transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD (Sign Up only) */}
              {mode === 'register' && (
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#737871] tracking-[0.14em] uppercase block mb-1.5">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8FAF8] border border-[#E8EAE6] rounded-xl px-4 py-3.5 pr-10 text-sm text-[#20251F] placeholder:text-[#9A9890] focus:outline-none focus:bg-white focus:border-[#203F2D] focus:ring-1 focus:ring-[#203F2D] transition-all tracking-wider"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737871] pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#203F2D] hover:bg-[#294B36] active:scale-[0.99] disabled:opacity-70 text-white font-medium py-3.5 px-6 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200 shadow-sm cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Login' : 'Create Account'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Bottom Switch Link */}
            <div className="text-center mt-6 text-xs sm:text-sm text-[#70756E]">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-[#1C3829] hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="font-bold text-[#1C3829] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Legal Disclaimer */}
            <p className="text-center text-[11px] sm:text-xs text-[#90958E] mt-5 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="/terms" className="underline hover:text-[#1C3829]">Terms</a> and{' '}
              <a href="/privacy" className="underline hover:text-[#1C3829]">Privacy Policy</a>.
            </p>

          </div>

        </div>
      </main>

      {/* =========================================================================
          PAGE FOOTER: Clean, focused minimal footer
          ========================================================================= */}
      <footer className="w-full bg-white py-6 px-4 sm:px-8 border-t border-[#E8EAE6] text-xs text-[#70756E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          {/* Left Brand & Italic Tagline */}
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-[#203F2D]">Apni Chai</span>
            <span className="text-[#9A9890]">·</span>
            <p className="font-serif italic text-sm text-[#70756E]">
              Har Cup Mein Apnapan.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-[11px] text-[#9A9890]">
            © 2026 Apni Chai. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
