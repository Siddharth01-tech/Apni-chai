import React from 'react';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import { signatureChaiProducts } from '../data/products';
import heroChaiImg from '../assets/hero-chai.jpg';
import ourStoryImg from '../assets/our-story.jpg';

/**
 * Chaiva Homepage:
 * - Hero Section (two-column: editorial typography + premium ceramic chai photograph)
 * - Signature Chai (three product cards in 1 row on desktop)
 * - Our Story (two-column: authentic chai image + brand story)
 * - Why Chaiva? (two-column: value proposition + 3 feature icons)
 */
export default function Home({ onAddToCart, onNavigate }) {
  const handleOrderClick = (product) => {
    if (onNavigate) {
      onNavigate(`/menu/${product.slug || product.id}`);
    } else if (onAddToCart) {
      onAddToCart(product);
    } else {
      window.location.href = `/menu/${product.slug || product.id}`;
    }
  };

  const handleLink = (path, e) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="bg-white">
      {/* =========================================================================
          SECTION 2: HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: Hero Copy & CTA */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow */}
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#203F2D] mb-4">
                FRESHLY BREWED. JUST FOR YOU.
              </p>

              {/* Main Heading */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-semibold text-[#203F2D] leading-[1.14] tracking-tight">
                Good Chai Makes <br className="hidden sm:inline" />
                Every Day Better.
              </h1>

              {/* Supporting Subtext */}
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#666B65] max-w-lg leading-relaxed">
                Sip happiness in every cup, delivered fresh to your door.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/menu"
                  onClick={(e) => handleLink('/menu', e)}
                  className="inline-flex items-center justify-center gap-2 bg-[#203F2D] hover:bg-[#294B36] active:scale-95 text-white text-sm sm:text-base font-medium px-7 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow group"
                >
                  <span>Order Now</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>

                <a
                  href="/menu"
                  onClick={(e) => handleLink('/menu', e)}
                  className="inline-flex items-center justify-center bg-transparent hover:bg-[#EAF0EA]/60 active:scale-95 text-[#203F2D] border border-[#203F2D] text-sm sm:text-base font-medium px-7 py-3.5 rounded-full transition-all duration-200"
                >
                  Explore Menu
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Hero Photograph with decorative aroma accent */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px]">
                {/* Visual aroma rays accent matching the reference graphic */}
                <div
                  className="absolute -top-3.5 right-6 sm:right-10 pointer-events-none text-[#203F2D]/60 select-none"
                  aria-hidden="true"
                >
                  <svg width="34" height="26" viewBox="0 0 34 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="6" y1="22" x2="2" y2="12" />
                    <line x1="17" y1="20" x2="17" y2="6" />
                    <line x1="28" y1="22" x2="32" y2="12" />
                  </svg>
                </div>

                {/* Hero Image Container */}
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(32,63,45,0.09)] aspect-[4/3] sm:aspect-[5/4] bg-[#EAF0EA]">
                  <img
                    src={heroChaiImg}
                    alt="Freshly prepared Indian masala chai in a ceramic cup with spices"
                    className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: OUR SIGNATURE CHAI
          ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-20 border-t border-[#E8EAE6]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <SectionHeading
            label="OUR SIGNATURE CHAI"
            title="Our Signature Chai"
            centered={true}
            withOrnament={true}
            className="mb-10 sm:mb-12"
          />

          {/* Product Cards Grid: Exactly 3 cards in 1 row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {signatureChaiProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrderClick={handleOrderClick}
              />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OUR STORY
          ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* LEFT: Authentic Chai Image */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_35px_rgba(32,63,45,0.07)] aspect-[4/3] sm:aspect-[16/11] bg-[#EAF0EA]">
                <img
                  src={ourStoryImg}
                  alt="Chaiva handcrafted Indian tea experience"
                  className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>

            {/* RIGHT: Our Story Content */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
              <SectionHeading
                label="OUR STORY"
                title="A Little Chai. A Lot of Comfort."
                description="Chaiva brings the warmth of freshly brewed chai to your home. Made with love, for every chai lover."
                centered={false}
              />

              <div className="mt-8">
                <a
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-[#203F2D] hover:bg-[#294B36] active:scale-95 text-white text-sm sm:text-base font-medium px-7 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow group"
                >
                  <span>Learn More</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHY CHAIVA?
          ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-20 border-t border-[#E8EAE6]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT: Why Chaiva Pitch */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <SectionHeading
                label="WHY CHAIVA?"
                title="Your Chai, At Your Doorstep."
                description="Freshly brewed, customized and delivered with care."
                centered={false}
              />

              <div className="mt-7">
                <a
                  href="/menu"
                  onClick={(e) => handleLink('/menu', e)}
                  className="inline-flex items-center justify-center bg-[#203F2D] hover:bg-[#294B36] active:scale-95 text-white text-sm sm:text-base font-medium px-7 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow"
                >
                  Order Now
                </a>
              </div>
            </div>

            {/* RIGHT: Exactly THREE simple feature items with green outline icons */}
            <div className="lg:col-span-7">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-2 sm:px-4 py-4">
                
                {/* Feature 1: Fresh & Hot */}
                <div className="flex flex-col items-center text-center flex-1 w-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#203F2D] mb-3">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#203F2D"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Cup with hot steam */}
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                      <line x1="6" y1="1" x2="6" y2="4" />
                      <line x1="10" y1="1" x2="10" y2="4" />
                      <line x1="14" y1="1" x2="14" y2="4" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-[#20251F]">
                    Fresh & Hot
                  </span>
                </div>

                {/* Vertical Divider 1 */}
                <div className="hidden sm:block w-[1px] h-14 bg-[#E8EAE6]" aria-hidden="true" />

                {/* Feature 2: Fast Delivery */}
                <div className="flex flex-col items-center text-center flex-1 w-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#203F2D] mb-3">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#203F2D"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Delivery Scooter */}
                      <circle cx="5.5" cy="17.5" r="2.5" />
                      <circle cx="18.5" cy="17.5" r="2.5" />
                      <path d="M15 6h4l2 5-2 2h-4" />
                      <path d="M9 17h7" />
                      <path d="M12 13h-4l-2.5-4H2" />
                      <path d="M16 11l-2-5H9" />
                      {/* Cargo Box */}
                      <rect x="3" y="7" width="5" height="5" rx="1" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-[#20251F]">
                    Fast Delivery
                  </span>
                </div>

                {/* Vertical Divider 2 */}
                <div className="hidden sm:block w-[1px] h-14 bg-[#E8EAE6]" aria-hidden="true" />

                {/* Feature 3: Secure Payment */}
                <div className="flex flex-col items-center text-center flex-1 w-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#203F2D] mb-3">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#203F2D"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Shield with check */}
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11.5 14.5 15.5 9.5" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-[#20251F]">
                    Secure Payment
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
