import React, { useState, useMemo, useEffect } from 'react';
import { allChaiProducts, getProductBySlugOrId } from '../data/products';
import { useAuth } from '../context/useAuth';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * ProductDetail Page Component for Chaiva:
 * - Matches the exact layout and typography of Image 2 reference
 * - Breadcrumb navigation: Home / Chai Menu / [Product Name]
 * - Left column: High-res photography, spice badges, decoction strength indicator
 * - Right column: Signature tag, large serif heading, dynamic size selector,
 *   sugar preference, milk preference, spice level, quantity stepper & "Add to Cart • ₹[price]"
 * - Artisanal Pairings ("You May Also Like") with quick "Add +" action
 * - Seamless integration with backend Cart API (/api/v1/cart) & parent toast
 */
export default function ProductDetail({ slug, onNavigate, onAddToCart }) {
  const { token, isAuthenticated } = useAuth();

  // Find product from local rich dataset
  const baseProduct = useMemo(() => {
    return getProductBySlugOrId(slug);
  }, [slug]);

  // Active product state (enhanced with backend data if online)
  const [product, setProduct] = useState(baseProduct);
  const [loading, setLoading] = useState(false);

  // Customization selection state
  const [selectedSize, setSelectedSize] = useState('small'); // 'small', 'medium', 'large'
  const [selectedSugar, setSelectedSugar] = useState('Regular Sugar');
  const [selectedMilk, setSelectedMilk] = useState('Dairy Milk');
  const [selectedSpice, setSelectedSpice] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Sync if slug changes
  useEffect(() => {
    setProduct(getProductBySlugOrId(slug));
    setSelectedSize('small');
    setSelectedSugar('Regular Sugar');
    setSelectedMilk('Dairy Milk');
    setSelectedSpice('Medium');
    setQuantity(1);
  }, [slug]);

  // Fetch live backend product data if available
  useEffect(() => {
    let isMounted = true;
    const fetchBackendDetail = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/products/slug/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.product && isMounted) {
          setProduct((prev) => ({
            ...prev,
            backendId: data.product._id,
            isAvailable: data.product.isAvailable ?? true,
          }));
        }
      } catch {
        // Continue with local rich product representation
      }
    };

    fetchBackendDetail();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Calculate dynamic price based on size
  const currentSizeObj = useMemo(() => {
    const matched = product.sizes?.find((s) => s.name === selectedSize);
    return matched || product.sizes?.[0] || { price: product.startingPrice, label: 'Small', volume: '150ml' };
  }, [product, selectedSize]);

  // Calculate total price based on size and quantity
  const unitPrice = currentSizeObj.price;
  const totalPrice = unitPrice * quantity;

  // Pairings list (choose 2 other chais for the bottom section)
  const pairings = useMemo(() => {
    return allChaiProducts
      .filter((p) => p.slug !== product.slug)
      .slice(0, 2);
  }, [product.slug]);

  // Add to cart handler
  const handleAddToCart = async () => {
    setIsAdding(true);
    const cartItemPayload = {
      product: {
        id: product.id,
        _id: product.backendId || product.id,
        name: product.name,
        image: product.image,
        price: unitPrice,
      },
      name: product.name,
      size: selectedSize,
      sizeLabel: currentSizeObj.label,
      volume: currentSizeObj.volume,
      quantity,
      unitPrice,
      totalPrice,
      customization: {
        sugar: selectedSugar,
        milk: selectedMilk,
        spiceLevel: selectedSpice,
      },
    };

    // If authenticated, sync with backend Cart API
    if (isAuthenticated && token && product.backendId) {
      try {
        await fetch(`${API_BASE}/api/v1/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.backendId,
            size: selectedSize,
            quantity,
            customization: {
              sugar: selectedSugar,
              milk: selectedMilk,
              spiceLevel: selectedSpice,
            },
          }),
        });
      } catch (err) {
        console.warn('Backend cart sync non-fatal warning:', err);
      }
    }

    // Call parent handler to update badge & trigger toast
    if (onAddToCart) {
      onAddToCart(cartItemPayload);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  // Quick add for pairing items
  const handleQuickAddPairing = (pairingItem) => {
    if (onAddToCart) {
      onAddToCart({
        product: pairingItem,
        name: pairingItem.name,
        size: 'small',
        quantity: 1,
        unitPrice: pairingItem.startingPrice,
        totalPrice: pairingItem.startingPrice,
        customization: {
          sugar: 'Regular Sugar',
          milk: 'Dairy Milk',
          spiceLevel: 'Medium',
        },
      });
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16 pt-6 sm:pt-8 text-[#20251F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* BREADCRUMB NAVIGATION */}
        {/* ============================================================ */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 text-xs text-[#666B65] flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
            className="hover:text-[#203F2D] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/menu') : (window.location.href = '/menu')}
            className="hover:text-[#203F2D] transition-colors cursor-pointer"
          >
            Chai Menu
          </button>
          <span>/</span>
          <span className="text-[#20251F] font-semibold">
            {product.name}
          </span>
        </nav>

        {/* ============================================================ */}
        {/* TWO-COLUMN PRODUCT HERO */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* ---------------------------------------------------------- */}
          {/* LEFT COLUMN: PHOTOGRAPHY & DECOCTION STRENGTH */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Product Image Card */}
            <div className="relative aspect-[4/3] sm:aspect-[1.15/1] w-full rounded-2xl overflow-hidden bg-[#EAF0EA] border border-[#E8EAE6] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Badges on Bottom Left of Image */}
              <div className="absolute bottom-3.5 left-3.5 flex flex-wrap gap-2">
                {product.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="bg-white/95 backdrop-blur-xs text-[#203F2D] text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs border border-[#E8EAE6]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Decoction Strength Card */}
            <div className="bg-white rounded-2xl border border-[#E8EAE6] p-4 sm:p-5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF0EA] text-[#203F2D] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2c1.5 2.5 3 4.5 3 7a6 6 0 1 1-12 0c0-2.5 1.5-4.5 3-7 1 1.5 2 2.5 3 3 1-.5 2-1.5 3-3Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#20251F] uppercase tracking-wider">
                    Decoction Strength
                  </h4>
                  <p className="text-xs text-[#666B65] mt-0.5 font-medium">
                    {product.decoctionName || 'Signature Kadak Assam Leaf Base'}
                  </p>
                </div>
              </div>

              {/* 3-Dot Decoction Indicator */}
              <div className="flex items-center gap-1.5" aria-label={`Decoction strength ${product.decoctionStrength || 3} of 3`}>
                {[1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={`w-2.5 h-2.5 rounded-full ${
                      dot <= (product.decoctionStrength || 3)
                        ? 'bg-[#8B6532]'
                        : 'bg-[#D9DFD7]'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT COLUMN: PRODUCT INFO & CUSTOMIZATIONS */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-6 bg-transparent">
            
            {/* Tagline & Freshly Simmered Status */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#666B65] tracking-widest uppercase">
                {product.tagline || 'SIGNATURE CHAI'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#203F2D] bg-[#EAF0EA] px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#203F2D] animate-pulse" />
                <span>Freshly Simmered</span>
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1C2A1E] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Dynamic Price Display */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A1E]">
                  ₹{unitPrice}
                </span>
                <span className="text-xs text-[#666B65] font-normal">
                  onwards
                </span>
              </div>

              {/* Long / Short Description */}
              <p className="mt-3 text-sm text-[#666B65] leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {/* 1. Cup Size Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#20251F] uppercase tracking-wider">
                  Cup Size
                </span>
                <span className="text-xs text-[#666B65] font-medium">
                  {currentSizeObj.label} ({currentSizeObj.volume})
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes?.map((sizeItem) => {
                  const isSelected = selectedSize === sizeItem.name;
                  return (
                    <button
                      key={sizeItem.name}
                      type="button"
                      onClick={() => setSelectedSize(sizeItem.name)}
                      className={`py-3 px-3 rounded-xl text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#203F2D] text-white border-[#203F2D] shadow-sm font-semibold'
                          : 'bg-[#F2F4F0] text-[#20251F] border-transparent hover:bg-[#EAF0EA]'
                      }`}
                    >
                      <div className="text-xs font-semibold">
                        {sizeItem.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#666B65]'}`}>
                        ₹{sizeItem.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Sugar Preference */}
            <div>
              <span className="block text-xs font-bold text-[#20251F] uppercase tracking-wider mb-2">
                Sugar Preference
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {['No Sugar', 'Less Sugar', 'Regular Sugar'].map((opt) => {
                  const isSelected = selectedSugar === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedSugar(opt)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                        isSelected
                          ? 'bg-[#203F2D] text-white border-[#203F2D] font-semibold'
                          : 'bg-[#F2F4F0] text-[#20251F] border-transparent hover:bg-[#EAF0EA]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Milk Preference */}
            <div>
              <span className="block text-xs font-bold text-[#20251F] uppercase tracking-wider mb-2">
                Milk Preference
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {['Dairy Milk', 'Oat Milk', 'Almond Milk'].map((opt) => {
                  const isSelected = selectedMilk === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedMilk(opt)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                        isSelected
                          ? 'bg-[#203F2D] text-white border-[#203F2D] font-semibold'
                          : 'bg-[#F2F4F0] text-[#20251F] border-transparent hover:bg-[#EAF0EA]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Spice Level */}
            <div>
              <span className="block text-xs font-bold text-[#20251F] uppercase tracking-wider mb-2">
                Spice Level
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {['Mild', 'Medium', 'Strong'].map((opt) => {
                  const isSelected = selectedSpice === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedSpice(opt)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer border ${
                        isSelected
                          ? 'bg-[#203F2D] text-white border-[#203F2D] font-semibold'
                          : 'bg-[#F2F4F0] text-[#20251F] border-transparent hover:bg-[#EAF0EA]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Quantity & Add to Cart Button Row */}
            <div className="pt-2 flex items-center gap-3">
              {/* Quantity Counter Pill */}
              <div className="flex items-center border border-[#D9DFD7] rounded-xl bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#20251F] hover:bg-[#F2F4F0] rounded-lg transition-colors font-bold cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#20251F]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-[#20251F] hover:bg-[#F2F4F0] rounded-lg transition-colors font-bold cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-[#203F2D] hover:bg-[#294B36] active:scale-[0.99] text-white text-sm font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <span>Adding to Cart...</span>
                ) : (
                  <span>Add to Cart • ₹{totalPrice}</span>
                )}
              </button>
            </div>

            {/* Subtext Note */}
            <div className="flex items-center gap-2 text-xs text-[#666B65]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              </svg>
              <span>Freshly prepared after you order.</span>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* ARTISANAL PAIRINGS: "You May Also Like" */}
        {/* ============================================================ */}
        <section className="pt-10 border-t border-[#E8EAE6]">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold text-[#666B65] tracking-widest uppercase block mb-1">
                ARTISANAL PAIRINGS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2A1E]">
                You May Also Like
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/menu') : (window.location.href = '/menu')}
              className="text-xs font-semibold text-[#203F2D] hover:text-[#294B36] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all brews</span>
              <span>→</span>
            </button>
          </div>

          {/* Pairings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pairings.map((pairingItem) => (
              <div
                key={pairingItem.id}
                className="bg-white rounded-2xl border border-[#E8EAE6] p-4 flex items-center justify-between gap-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all group"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    onClick={() => onNavigate ? onNavigate(`/menu/${pairingItem.slug}`) : (window.location.href = `/menu/${pairingItem.slug}`)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-[#EAF0EA] flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={pairingItem.image}
                      alt={pairingItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3
                      onClick={() => onNavigate ? onNavigate(`/menu/${pairingItem.slug}`) : (window.location.href = `/menu/${pairingItem.slug}`)}
                      className="font-serif text-base font-bold text-[#20251F] group-hover:text-[#203F2D] transition-colors truncate cursor-pointer"
                    >
                      {pairingItem.name}
                    </h3>
                    <p className="text-xs text-[#666B65] line-clamp-1 mt-0.5">
                      {pairingItem.description}
                    </p>
                    <div className="mt-2 text-[11px] font-medium text-[#8B6532] bg-[#FAF5EB] inline-block px-2 py-0.5 rounded">
                      {pairingItem.pairingTag || 'Spiced Decoction'}
                    </div>
                  </div>
                </div>

                {/* Price & Add Button */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0 pl-2">
                  <span className="text-sm font-bold text-[#20251F]">
                    ₹{pairingItem.startingPrice}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAddPairing(pairingItem)}
                    className="bg-[#F2F4F0] hover:bg-[#203F2D] hover:text-white text-[#20251F] text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                  >
                    Add +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
