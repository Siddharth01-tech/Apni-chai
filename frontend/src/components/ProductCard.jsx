import React from 'react';

/**
 * Reusable ProductCard component for Chaiva:
 * - High quality product photograph with rounded corners
 * - Product title & short description
 * - Price in INR (e.g. ₹40)
 * - Dark forest green "Order Now" button
 */
export default function ProductCard({
  product,
  onOrderClick,
}) {
  const { name, description, formattedPrice, price, image } = product;

  return (
    <div className="bg-white rounded-2xl border border-[#E8EAE6] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(32,63,45,0.08)] transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#EAF0EA]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle decorative steam ray icon for Adrak chai if matching reference */}
        {name.toLowerCase().includes('adrak') && (
          <div className="absolute top-2.5 right-2.5 pointer-events-none opacity-80" title="Freshly brewed steam">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
              <path d="M12 4v4M8 6l2.5 3M16 6l-2.5 3" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-3.5 pb-2">
        <h3 className="text-base sm:text-lg font-bold text-[#20251F] tracking-tight">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-[#666B65] mt-1 leading-snug">
          {description}
        </p>
      </div>

      {/* Price & Action Button */}
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-transparent">
        <span className="text-base sm:text-lg font-bold text-[#20251F]">
          {formattedPrice || `₹${price}`}
        </span>
        <button
          type="button"
          onClick={() => onOrderClick ? onOrderClick(product) : (window.location.href = '/menu')}
          className="bg-[#203F2D] hover:bg-[#294B36] active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
