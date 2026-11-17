import React from 'react';

/**
 * Reusable SectionHeading component adhering strictly to the Chaiva design system:
 * - Label: small uppercase tracking-widest text in dark green
 * - Heading: elegant editorial serif (Playfair Display)
 * - Optional centered ornament lines for signature sections
 */
export default function SectionHeading({
  label,
  title,
  description,
  centered = false,
  withOrnament = false,
  className = '',
}) {
  return (
    <div className={`${centered ? 'text-center mx-auto' : 'text-left'} ${className}`}>
      {label && (
        <div className={`flex items-center gap-3 mb-2.5 ${centered ? 'justify-center' : 'justify-start'}`}>
          {withOrnament && <span className="w-9 h-[1px] bg-[#203F2D]/35" aria-hidden="true" />}
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#203F2D]/90">
            {label}
          </span>
          {withOrnament && <span className="w-9 h-[1px] bg-[#203F2D]/35" aria-hidden="true" />}
        </div>
      )}

      {title && (
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#203F2D] leading-[1.2] tracking-tight">
          {title}
        </h2>
      )}

      {description && (
        <p className="mt-3 text-sm sm:text-base text-[#666B65] leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
