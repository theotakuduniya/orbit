/**
 * VaultScreen: Universal Vault Tab
 * Sub-segments: [Custom Lists] | [Watchlist] | [Bucket List]
 */
import React, { useState } from 'react';
import { PolymorphicListHost } from '../components/vault/PolymorphicListHost';
import { MovieSwipeDeck } from '../components/vault/MovieSwipeDeck';
import { BucketListSection } from '../components/vault/BucketListSection';
import { ListFilter, Film, Compass } from 'lucide-react';
import { haptics } from '../utils/haptics';

export const VaultScreen: React.FC = () => {
  const [segment, setSegment] = useState<'lists' | 'watchlist' | 'bucket'>('lists');

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal Pill Segments */}
      <div className="px-4 py-2 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#FEF7FF]/50 dark:bg-[#141218]/50 backdrop-blur-xs">
        <div className="flex items-center p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] gap-1">
          <button
            onClick={() => {
              haptics.selection();
              setSegment('lists');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'lists'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Vault Lists</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('watchlist');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'watchlist'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Watchlist</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('bucket');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              segment === 'bucket'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Bucket list</span>
          </button>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto">
        {segment === 'lists' && <PolymorphicListHost />}
        {segment === 'watchlist' && <MovieSwipeDeck />}
        {segment === 'bucket' && <BucketListSection />}
      </div>
    </div>
  );
};
