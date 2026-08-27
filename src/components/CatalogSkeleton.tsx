import React from 'react';

const CatalogSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-white/10" />
          <div className="p-6 space-y-3">
            <div className="h-5 w-3/4 rounded-lg bg-white/10" />
            <div className="h-4 w-full rounded-lg bg-white/5" />
            <div className="h-4 w-2/3 rounded-lg bg-white/5" />
            <div className="h-8 w-24 rounded-lg bg-[#BD20D3]/20 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogSkeleton;
