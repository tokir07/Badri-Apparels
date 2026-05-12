import React from 'react';

const PriceTag = ({ price, mrp, className = "" }) => {
  const safePrice = price || 0;
  const safeMrp = mrp || 0;
  const discount = safeMrp > 0 ? Math.round(((safeMrp - safePrice) / safeMrp) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xl font-bold text-text-primary">₹{safePrice.toLocaleString()}</span>
      {safeMrp > safePrice && (
        <>
          <span className="text-sm text-text-secondary line-through opacity-40">₹{safeMrp.toLocaleString()}</span>
          <span className="text-xs font-bold text-accent-rust tracking-wider">({discount}% OFF)</span>
        </>
      )}
    </div>
  );
};

export default PriceTag;
