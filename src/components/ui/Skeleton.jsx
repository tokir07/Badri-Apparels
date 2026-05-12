import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
  return (
    <div 
      className={`bg-text-primary/5 animate-pulse rounded-xl ${className}`}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] rounded-3xl" />
      <div className="space-y-2 px-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  );
};

export const CollectionCardSkeleton = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden bg-white/50 border border-border-light p-4">
       <Skeleton className="w-full h-full rounded-[1.5rem]" />
       <div className="absolute bottom-8 left-8 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
       </div>
    </div>
  );
};

export const DashboardStatSkeleton = () => {
  return (
    <div className="bg-[#0f0f0f]/60 border border-white/[0.05] p-8 rounded-[2.5rem] space-y-6">
       <div className="flex justify-between items-start">
          <Skeleton className="w-12 h-12 bg-white/5" />
          <Skeleton className="w-16 h-6 bg-white/5" />
       </div>
       <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-white/5" />
          <Skeleton className="h-8 w-32 bg-white/5" />
       </div>
    </div>
  );
};

export default Skeleton;
