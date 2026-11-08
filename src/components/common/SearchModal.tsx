/**
 * SearchModal: Global quick search across all micro-hub domains
 */
import React, { useState } from 'react';
import { useSpace } from '../../context/SpaceContext';
import { Search, X, Music, Image as ImageIcon, Film, CheckSquare, Sparkles, Compass } from 'lucide-react';
import {
  INITIAL_VAULT_ITEMS,
  INITIAL_MEMES,
  INITIAL_TRACKS,
  INITIAL_WATCHLIST,
  INITIAL_BUCKET_LIST,
} from '../../utils/mockData';
import { haptics } from '../../utils/haptics';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useSpace();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingMemes = INITIAL_MEMES.filter(
    (m) => m.caption.toLowerCase().includes(trimmed) || m.authorName.toLowerCase().includes(trimmed)
  );

  const matchingTracks = INITIAL_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(trimmed) ||
      t.artist.toLowerCase().includes(trimmed) ||
      t.album.toLowerCase().includes(trimmed)
  );

  const matchingVault = INITIAL_VAULT_ITEMS.filter(
    (v) =>
      v.title.toLowerCase().includes(trimmed) ||
      (v.caption && v.caption.toLowerCase().includes(trimmed)) ||
      (v.tags && v.tags.some((tg) => tg.toLowerCase().includes(trimmed)))
  );

  const matchingMovies = INITIAL_WATCHLIST.filter(
    (w) => w.title.toLowerCase().includes(trimmed) || w.genre.toLowerCase().includes(trimmed)
  );

  const matchingBucket = INITIAL_BUCKET_LIST.filter((b) => b.title.toLowerCase().includes(trimmed));

  const totalResults =
    matchingMemes.length +
    matchingTracks.length +
    matchingVault.length +
    matchingMovies.length +
    matchingBucket.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-12 sm:p-4 sm:pt-16 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => {
          haptics.light();
          setIsSearchOpen(false);
        }}
      />
      <div className="relative w-full max-w-lg bg-[#FEF7FF] dark:bg-[#1D1B20] rounded-2xl sm:rounded-3xl shadow-2xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden z-10 flex flex-col max-h-[85vh] sm:max-h-[80vh]">
        {/* Search Input Bar (Selector 2) */}
        <div className="p-2 sm:p-3.5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2 sm:gap-3">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 ml-0.5 sm:ml-1" />
          {/* Input Element (Selector 1) */}
          <input
            type="text"
            autoFocus
            placeholder="Search vault, memes, songs, movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-xs sm:text-sm font-medium py-0.5"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0"
          >
            Done
          </button>
        </div>

        {/* Results List (Selector 3) */}
        <div className="overflow-y-auto p-2 sm:p-3 space-y-2.5 sm:space-y-4">
          {!trimmed ? (
            <div className="py-5 sm:py-8 text-center text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs px-2">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2 opacity-60 text-[#6750A4] dark:text-[#D0BCFF]" />
              Type anything to search across Us 💖 memories, playlists & plans
            </div>
          ) : totalResults === 0 ? (
            <div className="py-5 sm:py-8 text-center text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs px-2">
              No matching records found for "{query}"
            </div>
          ) : (
            <>
              {matchingTracks.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 px-1.5 sm:px-2 mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5">
                    <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6750A4] dark:text-[#D0BCFF]" />
                    <span>Music ({matchingTracks.length})</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {matchingTracks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <img src={t.coverUrl} alt={t.title} className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {t.title}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">{t.artist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingVault.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 px-1.5 sm:px-2 mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5">
                    <CheckSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                    <span>Vault items ({matchingVault.length})</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {matchingVault.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        {v.imageUrl && (
                          <img src={v.imageUrl} alt={v.title} className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg object-cover shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {v.title}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">{v.caption || v.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingMovies.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 px-1.5 sm:px-2 mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5">
                    <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                    <span>Watchlist ({matchingMovies.length})</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {matchingMovies.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <img src={w.posterUrl} alt={w.title} className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {w.title}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">{w.genre}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingMemes.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 px-1.5 sm:px-2 mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5">
                    <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500" />
                    <span>Memes ({matchingMemes.length})</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {matchingMemes.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <img src={m.imageUrl} alt={m.caption} className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {m.caption}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">By {m.authorName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingBucket.length > 0 && (
                <div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 px-1.5 sm:px-2 mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5">
                    <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" />
                    <span>Bucket List ({matchingBucket.length})</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {matchingBucket.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 text-sm">
                          {b.category === 'Travel' ? '✈️' : b.category === 'Adventure' ? '🎢' : b.category === 'Food' ? '🍕' : '⭐'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {b.title}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">{b.targetDate || 'Someday'} • {b.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
