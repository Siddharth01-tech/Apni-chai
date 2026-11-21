import React, { useState, useMemo, useEffect } from 'react';
import { allChaiProducts } from '../data/products';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Menu Page Component for Chaiva:
 * - Layout matches "Explore Our Chai" reference design (Image 1)
 * - Artisanal Brew Selection header badge & serif title
 * - Left sidebar with interactive filters (Chai type, Price range, Size, Customization)
 * - Search bar and Sort by dropdown
 * - Responsive 3-column product cards grid with badge tags & "View Details"
 * - Bottom artisanal promise banner: "Every cup is poured fresh"
 */
export default function Menu({ onNavigate, onAddToCart: _onAddToCart }) {
  // Products state (starts with rich curated products, syncs with backend if reachable)
  const [products, setProducts] = useState(allChaiProducts);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(80);
  const [selectedSize, setSelectedSize] = useState('all'); // 'all', 'small', 'medium', 'large'
  const [sweetness, setSweetness] = useState('Regular Sugar');
  const [milkBase, setMilkBase] = useState('Dairy Milk');
  const [spiceStrength, setSpiceStrength] = useState('Medium Spice');
  const [sortBy, setSortBy] = useState('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync products from backend API if available
  useEffect(() => {
    let isMounted = true;
    const fetchBackendProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/products?isAvailable=true`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          if (!isMounted) return;
          // Merge backend IDs and live prices with rich local asset data
          const merged = allChaiProducts.map((localProd) => {
            const matchedBackend = data.products.find(
              (bp) =>
                bp.slug === localProd.slug ||
                bp.chaiType === localProd.chaiType ||
                bp.name.toLowerCase() === localProd.name.toLowerCase()
            );
            if (matchedBackend) {
              return {
                ...localProd,
                backendId: matchedBackend._id,
                isAvailable: matchedBackend.isAvailable ?? true,
                startingPrice: matchedBackend.sizes?.[0]?.price || localProd.startingPrice,
              };
            }
            return localProd;
          });
          setProducts(merged);
        }
      } catch {
        // Fall back gracefully to static products
      }
    };

    fetchBackendProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Chai Types List for checkboxes
  const chaiTypeOptions = [
    { id: 'masala', label: 'Masala Chai' },
    { id: 'ginger', label: 'Ginger Chai' },
    { id: 'elaichi', label: 'Elaichi Chai' },
    { id: 'kesar', label: 'Kesar Chai' },
    { id: 'kulhad', label: 'Kulhad Chai' },
    { id: 'cutting', label: 'Cutting Chai' },
  ];

  // Toggle chai type checkbox
  const toggleChaiType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // Clear all filters
  const handleClearAll = () => {
    setSelectedTypes([]);
    setMaxPrice(80);
    setSelectedSize('all');
    setSweetness('Regular Sugar');
    setMilkBase('Dairy Milk');
    setSpiceStrength('Medium Spice');
    setSearchQuery('');
    setSortBy('recommended');
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesBadge = item.badge?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesBadge) return false;
        }

        // Chai type filter
        if (selectedTypes.length > 0) {
          if (!selectedTypes.includes(item.chaiType)) {
            return false;
          }
        }

        // Price range filter
        if (item.startingPrice > maxPrice) {
          return false;
        }

        // Size filter
        if (selectedSize !== 'all') {
          const hasSize = item.sizes?.some((s) => s.name === selectedSize);
          if (!hasSize) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price_desc') return b.startingPrice - a.startingPrice;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        return 0; // 'recommended' preserves curated order
      });
  }, [products, searchQuery, selectedTypes, maxPrice, selectedSize, sortBy]);

  // Navigate to product detail
  const handleViewDetails = (product) => {
    if (onNavigate) {
      onNavigate(`/menu/${product.slug}`);
    } else {
      window.location.href = `/menu/${product.slug}`;
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16 pt-8 sm:pt-12 text-[#20251F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* HEADER SECTION: Badge, Title & Subtitle */}
        {/* ============================================================ */}
        <div className="mb-8 sm:mb-10 text-left">
          {/* Artisanal Brew Selection Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#D9DFD7] bg-white text-[#203F2D] text-[11px] font-semibold tracking-wider uppercase mb-3.5 shadow-2xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
            <span>Artisanal Brew Selection</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1C2A1E] tracking-tight leading-tight">
            Explore Our Chai
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm sm:text-base text-[#666B65] max-w-2xl font-normal leading-relaxed">
            Find the chai that feels just right. Slow-simmered decoctions, fragrant crushed botanicals, and warm clay traditions.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E8EAE6] rounded-xl text-sm font-medium text-[#20251F] shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </span>
            <span className="text-xs text-[#203F2D] font-semibold">
              {filteredProducts.length} brews
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TWO-COLUMN LAYOUT: Sidebar Filters + Products Grid */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ---------------------------------------------------------- */}
          {/* LEFT SIDEBAR: FILTERS CARD */}
          {/* ---------------------------------------------------------- */}
          <aside
            className={`lg:col-span-3 bg-white border border-[#E8EAE6] rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8EAE6]">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20251F" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <h2 className="font-serif text-lg font-semibold text-[#20251F]">
                  Filters
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-[#203F2D] hover:text-[#294B36] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* 1. Chai Type Filter */}
            <div className="py-5 border-b border-[#E8EAE6]">
              <h3 className="text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-3">
                Chai Type
              </h3>
              <div className="space-y-2.5">
                {chaiTypeOptions.map((opt) => {
                  const isChecked = selectedTypes.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className="flex items-center gap-3 text-xs sm:text-sm text-[#20251F] cursor-pointer select-none group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChaiType(opt.id)}
                        className="w-4 h-4 rounded border-[#C8CEC6] text-[#203F2D] focus:ring-[#203F2D] focus:ring-offset-0 cursor-pointer accent-[#203F2D]"
                      />
                      <span className={`group-hover:text-[#203F2D] transition-colors ${isChecked ? 'font-semibold text-[#203F2D]' : 'font-normal'}`}>
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Range Slider */}
            <div className="py-5 border-b border-[#E8EAE6]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-[#20251F] uppercase tracking-wider">
                  Price Range
                </h3>
                <span className="text-xs font-semibold text-[#203F2D] bg-[#EAF0EA] px-2 py-0.5 rounded">
                  ₹20 - ₹{maxPrice}
                </span>
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#E8EAE6] rounded-lg appearance-none cursor-pointer accent-[#203F2D]"
                  aria-label="Filter by maximum price"
                />
                <div className="flex justify-between text-[11px] text-[#666B65] mt-1.5 font-medium">
                  <span>₹20</span>
                  <span>₹50</span>
                  <span>₹80</span>
                </div>
              </div>
            </div>

            {/* 3. Cup Size Pills */}
            <div className="py-5 border-b border-[#E8EAE6]">
              <h3 className="text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-3">
                Size
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Small' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'large', label: 'Large' },
                ].map((s) => {
                  const isActive = selectedSize === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === s.id ? 'all' : s.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                        isActive
                          ? 'bg-[#203F2D] text-white shadow-2xs font-semibold'
                          : 'bg-[#F2F4F0] text-[#20251F] hover:bg-[#EAF0EA]'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Customization Options (Sweetness, Milk Base, Spice Strength) */}
            <div className="pt-5">
              <h3 className="text-xs font-semibold text-[#20251F] uppercase tracking-wider mb-3">
                Customization
              </h3>

              {/* Sweetness */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-[#666B65] uppercase tracking-wider mb-2">
                  Sweetness
                </p>
                <div className="space-y-1.5">
                  {['Regular Sugar', 'Less Sugar', 'No Sugar'].map((item) => (
                    <label key={item} className="flex items-center gap-2.5 text-xs text-[#20251F] cursor-pointer">
                      <input
                        type="radio"
                        name="sweetness_pref"
                        value={item}
                        checked={sweetness === item}
                        onChange={(e) => setSweetness(e.target.value)}
                        className="w-3.5 h-3.5 text-[#203F2D] focus:ring-[#203F2D] accent-[#203F2D] cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Milk Base */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-[#666B65] uppercase tracking-wider mb-2">
                  Milk Base
                </p>
                <div className="space-y-1.5">
                  {['Dairy Milk', 'Plant-based Milk'].map((item) => (
                    <label key={item} className="flex items-center gap-2.5 text-xs text-[#20251F] cursor-pointer">
                      <input
                        type="radio"
                        name="milk_pref"
                        value={item}
                        checked={milkBase === item}
                        onChange={(e) => setMilkBase(e.target.value)}
                        className="w-3.5 h-3.5 text-[#203F2D] focus:ring-[#203F2D] accent-[#203F2D] cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Spice Strength */}
              <div>
                <p className="text-[11px] font-semibold text-[#666B65] uppercase tracking-wider mb-2">
                  Spice Strength
                </p>
                <div className="space-y-1.5">
                  {['Mild Spice', 'Medium Spice', 'Strong Spice'].map((item) => (
                    <label key={item} className="flex items-center gap-2.5 text-xs text-[#20251F] cursor-pointer">
                      <input
                        type="radio"
                        name="spice_pref"
                        value={item}
                        checked={spiceStrength === item}
                        onChange={(e) => setSpiceStrength(e.target.value)}
                        className="w-3.5 h-3.5 text-[#203F2D] focus:ring-[#203F2D] accent-[#203F2D] cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT CONTENT AREA: Search, Sort & Product Grid */}
          {/* ---------------------------------------------------------- */}
          <section className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Top Search & Sort Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar with icon */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666B65]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your favourite chai..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8EAE6] rounded-xl text-sm text-[#20251F] placeholder-[#8A9088] focus:outline-none focus:ring-2 focus:ring-[#203F2D] focus:border-transparent transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#666B65] hover:text-[#20251F]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <span className="text-xs text-[#666B65] font-medium whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#E8EAE6] rounded-xl py-2 pl-3 pr-8 text-xs font-medium text-[#20251F] focus:outline-none focus:ring-2 focus:ring-[#203F2D] cursor-pointer shadow-2xs"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid (3 Columns on Desktop) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8EAE6] p-12 text-center my-6">
                <p className="font-serif text-xl font-semibold text-[#20251F] mb-2">
                  No chai found matching your filters
                </p>
                <p className="text-sm text-[#666B65] mb-6">
                  Try adjusting your price range, clearing selected chai types, or changing your search terms.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="bg-[#203F2D] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#294B36] transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((chai) => (
                  <div
                    key={chai.id}
                    className="bg-white rounded-2xl border border-[#E8EAE6] overflow-hidden flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(32,63,45,0.08)] transition-all duration-300 group"
                  >
                    {/* Chai Card Top: Photograph with Badge */}
                    <div className="relative aspect-[4/3] w-full bg-[#EAF0EA] overflow-hidden">
                      <img
                        src={chai.image}
                        alt={chai.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Floating Badge Tag (Matching Reference Image) */}
                      {chai.badge && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#203F2D] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs border border-[#E8EAE6]">
                          {chai.badge}
                        </div>
                      )}
                    </div>

                    {/* Chai Card Body: Title & Description */}
                    <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#20251F] tracking-tight group-hover:text-[#203F2D] transition-colors">
                          {chai.name}
                        </h3>
                        <p className="text-xs text-[#666B65] mt-1.5 leading-relaxed">
                          {chai.description}
                        </p>
                      </div>

                      {/* Card Footer: Starting Price & View Details CTA */}
                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F2F4F0]">
                        <div>
                          <span className="block text-[11px] text-[#8A9088] font-medium leading-none">
                            Starting from
                          </span>
                          <span className="text-base font-bold text-[#20251F] tracking-tight">
                            ₹{chai.startingPrice}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleViewDetails(chai)}
                          className="bg-[#203F2D] hover:bg-[#294B36] active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================ */}
            {/* BOTTOM PROMISE BANNER: "Every cup is poured fresh" */}
            {/* ============================================================ */}
            <div className="mt-4 bg-[#F5F2EB] border border-[#E8E5DC] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              {/* Left icon and message */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E8DCC8] text-[#8B6532] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" y1="2" x2="6" y2="4" />
                    <line x1="10" y1="2" x2="10" y2="4" />
                    <line x1="14" y1="2" x2="14" y2="4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#20251F]">
                    Every cup is poured fresh
                  </h4>
                  <p className="text-xs text-[#666B65] mt-0.5">
                    Prepared over simmering flame upon every order. Never pre-boiled or kept on warmers.
                  </p>
                </div>
              </div>

              {/* Right Guarantee Pill */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#203F2D] bg-white/80 px-3 py-1.5 rounded-full border border-[#D9DFD7] shadow-2xs whitespace-nowrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>100% Whole Spices</span>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
