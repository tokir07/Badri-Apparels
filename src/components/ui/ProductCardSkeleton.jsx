import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden">
      <div className="aspect-[4/5] bg-muted animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-1/4 bg-muted rounded animate-pulse" />
          <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
