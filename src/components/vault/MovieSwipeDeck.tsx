/**
 * Watchlist (Shared Watch Space)
 * Features:
 * - Simple clean image covers with movie title & rating below (genre, description, and reviews removed from card face)
 * - Release year removed
 * - On hover, displays avatars of who completed it
 * - Clicking any card opens a rich Movie Modal Card showing full details, synopsis, backdrop, and partner reviews
 * - TMDB & AniList API integration to search and fetch live posters, backdrops, ratings, and synopsis
 * - Popcorn reaction (🍿) for "Up next"
 * - Tick reaction (✓) to mark complete / watched
 */
import React, { useState, useEffect } from 'react';
import { WatchlistItem } from '../../types/orbit';
import { INITIAL_WATCHLIST, CURRENT_USER, PARTNER } from '../../utils/mockData';
import { searchUnifiedMedia, MediaSearchResult } from '../../utils/mediaApi';
import {
  Star,
  Film,
  CheckCircle2,
  Tv,
  Plus,
  MessageCircle,
  Clapperboard,
  Check,
  X,
  Search,
  Loader2,
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { haptics } from '../../utils/haptics';

export const MovieSwipeDeck: React.FC = () => {
  const [deck, setDeck] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);
  const [filterType, setFilterType] = useState<'all' | 'up_next' | 'completed' | 'anime' | 'show' | 'movie'>('all');

  // Selected Movie for Full Details & Reviews Modal Card
  const [selectedMovie, setSelectedMovie] = useState<WatchlistItem | null>(null);
  const [newReviewText, setNewReviewText] = useState('');

  // Add Title Modal & TMDB / AniList API Search State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiType, setApiType] = useState<'all' | 'movie' | 'show' | 'anime'>('all');
  const [searchResults, setSearchResults] = useState<MediaSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form Fields (Autofilled from API or manual)
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'movie' | 'show' | 'anime'>('movie');
  const [newGenre, setNewGenre] = useState('');
  const [newPoster, setNewPoster] = useState('');
  const [newBackdrop, setNewBackdrop] = useState('');
  const [newRuntime, setNewRuntime] = useState('');
  const [newOverview, setNewOverview] = useState('');
  const [newRating, setNewRating] = useState<number>(8.5);

  // Live search TMDB & AniList API when user types
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUnifiedMedia(searchQuery, apiType);
        setSearchResults(results);
      } catch (err) {
        console.error('Media search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, apiType]);

  // Select an API Search Result to Autofill
  const handleSelectSearchResult = (item: MediaSearchResult) => {
    haptics.selection();
    setNewTitle(item.title);
    setNewType(item.type);
    setNewGenre(item.genre);
    setNewPoster(item.posterUrl);
    setNewBackdrop(item.backdropUrl || item.posterUrl);
    setNewRuntime(item.runtime || (item.type === 'movie' ? '2h 00m' : '12 eps'));
    setNewOverview(item.overview);
    setNewRating(item.rating);
    setSearchResults([]); // close dropdown
  };

  // Popcorn Reaction: Toggle "Up next 🍿" for current user
  const handlePopcornReaction = (item: WatchlistItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    haptics.success();

    setDeck((prev) =>
      prev.map((m) => {
        if (m.id !== item.id) return m;
        const currentReactions = m.reactions || [];
        const hasMyPopcorn = currentReactions.some(
          (r) => r.userId === CURRENT_USER.id && (r.emoji === '🍿' || r.text.includes('Up next'))
        );

        let updatedReactions;
        if (hasMyPopcorn) {
          updatedReactions = currentReactions.filter(
            (r) => !(r.userId === CURRENT_USER.id && (r.emoji === '🍿' || r.text.includes('Up next')))
          );
        } else {
          const newReaction = {
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            userAvatar: CURRENT_USER.avatar,
            text: 'Up next on movie night! 🍿',
            emoji: '🍿',
          };
          updatedReactions = [newReaction, ...currentReactions.filter((r) => r.userId !== CURRENT_USER.id)];
        }

        const popcornStatus: WatchlistItem['status'] = hasMyPopcorn
          ? m.watchedBy && m.watchedBy.length > 0
            ? 'watched'
            : 'want_to_watch'
          : 'want_to_watch';

        const updatedMovie: WatchlistItem = {
          ...m,
          status: popcornStatus,
          reactions: updatedReactions,
        };

        // Also update selectedMovie if opened
        if (selectedMovie && selectedMovie.id === item.id) {
          setSelectedMovie(updatedMovie);
        }

        return updatedMovie;
      })
    );
  };

  // Tick Reaction: Toggle "Complete / Watched" for current user
  const handleToggleComplete = (item: WatchlistItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    haptics.medium();

    setDeck((prev) =>
      prev.map((m) => {
        if (m.id !== item.id) return m;
        const currentWatched = m.watchedBy || [];
        const hasAlex = currentWatched.includes('alex');
        const nextWatched = hasAlex
          ? currentWatched.filter((w) => w !== 'alex')
          : [...currentWatched, 'alex' as const];

        const nextStatus: WatchlistItem['status'] = nextWatched.length > 0 ? 'watched' : 'want_to_watch';

        let updatedReactions = m.reactions || [];
        if (!hasAlex) {
          const completeReaction = {
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            userAvatar: CURRENT_USER.avatar,
            text: 'Completed! ✓',
            emoji: '✓',
          };
          updatedReactions = [
            completeReaction,
            ...updatedReactions.filter((r) => !(r.userId === CURRENT_USER.id && r.emoji === '✓')),
          ];
        } else {
          updatedReactions = updatedReactions.filter(
            (r) => !(r.userId === CURRENT_USER.id && r.emoji === '✓')
          );
        }

        const updatedMovie: WatchlistItem = {
          ...m,
          watchedBy: nextWatched,
          status: nextStatus,
          reactions: updatedReactions,
        };

        if (selectedMovie && selectedMovie.id === item.id) {
          setSelectedMovie(updatedMovie);
        }

        return updatedMovie;
      })
    );
  };

  // Submit a Review / Comment from the Movie Modal Card
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie || !newReviewText.trim()) return;

    haptics.success();
    const newReview = {
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      userAvatar: CURRENT_USER.avatar,
      text: newReviewText.trim(),
      emoji: '💬',
    };

    setDeck((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMovie.id) return m;
        const current = m.reactions || [];
        const updated = [...current, newReview];
        const updatedItem = { ...m, reactions: updated };
        setSelectedMovie(updatedItem);
        return updatedItem;
      })
    );

    setNewReviewText('');
  };

  // Add new movie / show / anime to watchlist
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    haptics.success();
    const newItem: WatchlistItem = {
      id: `watch_${Date.now()}`,
      title: newTitle.trim(),
      year: new Date().getFullYear(),
      genre: newGenre.trim() || 'Drama',
      rating: newRating || 8.5,
      type: newType,
      status: 'want_to_watch',
      posterUrl:
        newPoster.trim() ||
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      backdropUrl: newBackdrop.trim() || newPoster.trim(),
      overview: newOverview.trim() || 'Added to our shared couple watchlist.',
      runtime: newRuntime.trim() || (newType === 'movie' ? '2h 00m' : '12 eps'),
      watchedBy: [],
      reactions: [
        {
          userId: CURRENT_USER.id,
          userName: CURRENT_USER.name,
          userAvatar: CURRENT_USER.avatar,
          text: 'Up next on our watchlist! 🍿',
          emoji: '🍿',
        },
      ],
    };

    setDeck((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
    setSearchQuery('');
    setNewTitle('');
    setNewGenre('');
    setNewPoster('');
    setNewBackdrop('');
    setNewRuntime('');
    setNewOverview('');
  };

  const filteredItems = deck.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'movie') return item.type === 'movie';
    if (filterType === 'show') return item.type === 'show';
    if (filterType === 'anime') return item.type === 'anime';
    if (filterType === 'up_next') {
      const hasPopcorn = (item.reactions || []).some(
        (r) => r.emoji === '🍿' || r.text.includes('Up next')
      );
      return hasPopcorn || item.status === 'want_to_watch';
    }
    if (filterType === 'completed') {
      return (item.watchedBy || []).length > 0 || item.status === 'watched';
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Top Header Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-[#6750A4] dark:text-[#D0BCFF]">
            <Clapperboard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
              Shared watchlist
            </h3>
            <span className="text-[11px] text-slate-500">
              {deck.length} titles · Powered by TMDB & AniList
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            haptics.light();
            setIsAddOpen(true);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xs active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add title</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 overflow-x-auto border-b border-black/[0.04] dark:border-white/[0.06] scrollbar-none">
        {[
          { key: 'all', label: `All (${deck.length})` },
          { key: 'up_next', label: 'Up next 🍿' },
          { key: 'completed', label: 'Completed ✓' },
          { key: 'anime', label: 'Anime' },
          { key: 'show', label: 'Shows' },
          { key: 'movie', label: 'Movies' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => {
              haptics.selection();
              setFilterType(f.key as any);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === f.key
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-black/[0.03] dark:bg-white/[0.05]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Watchlist Cards Grid: Simple Image Covers with Minimal Title & Rating Below (No genre, description, reviews on card) */}
      <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-y-auto flex-1">
        {filteredItems.map((item) => {
          const watchedByAlex = (item.watchedBy || []).includes('alex');
          const watchedBySam = (item.watchedBy || []).includes('sam');
          const isCompleted = watchedByAlex || watchedBySam;
          const watchedTogether = watchedByAlex && watchedBySam;

          const hasMyPopcorn = (item.reactions || []).some(
            (r) => r.userId === CURRENT_USER.id && (r.emoji === '🍿' || r.text.includes('Up next'))
          );

          return (
            <div
              key={item.id}
              onClick={() => {
                haptics.light();
                setSelectedMovie(item);
              }}
              className="group flex flex-col rounded-2xl bg-white dark:bg-[#1D1B20] border border-black/[0.06] dark:border-white/[0.08] shadow-xs hover:shadow-lg transition-all overflow-hidden cursor-pointer active:scale-[0.98]"
            >
              {/* Simple Image Cover with Hover Avatars Overlay */}
              <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Type & Rating Tag on Top of Cover */}
                <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 capitalize">
                    {item.type || 'Movie'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 flex items-center gap-0.5 font-mono">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </span>
                </div>

                {/* Small indicator when completed (visible even before hover) */}
                {isCompleted && (
                  <div className="absolute bottom-2 right-2 flex -space-x-1.5 z-10 transition-opacity group-hover:opacity-0">
                    {watchedByAlex && (
                      <img
                        src={CURRENT_USER.avatar}
                        alt="Alex"
                        className="w-5 h-5 rounded-full border border-white dark:border-black object-cover shadow-sm"
                        title="Completed by Alex"
                      />
                    )}
                    {watchedBySam && (
                      <img
                        src={PARTNER.avatar}
                        alt="Sam"
                        className="w-5 h-5 rounded-full border border-white dark:border-black object-cover shadow-sm"
                        title="Completed by Sam"
                      />
                    )}
                  </div>
                )}

                {/* ON HOVER: Show Avatars of Who Completed It */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-white text-center z-20">
                  {isCompleted ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center -space-x-2">
                        {watchedByAlex && (
                          <div className="relative">
                            <img
                              src={CURRENT_USER.avatar}
                              alt="Alex"
                              className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          </div>
                        )}
                        {watchedBySam && (
                          <div className="relative">
                            <img
                              src={PARTNER.avatar}
                              alt="Sam"
                              className="w-9 h-9 rounded-full border-2 border-pink-400 object-cover shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-emerald-300 block">
                          {watchedTogether
                            ? 'Completed by both'
                            : watchedByAlex
                            ? 'Completed by Alex'
                            : 'Completed by Sam'}
                        </span>
                        <span className="text-[10px] text-white/70 block">
                          {watchedTogether
                            ? 'Watched together 💖'
                            : watchedByAlex
                            ? 'Alex finished this'
                            : 'Sam finished this'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60">
                        <Tv className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-white/80">
                        Not completed yet
                      </span>
                      <span className="text-[10px] text-white/60">
                        Click for reviews & details
                      </span>
                    </div>
                  )}

                  {/* Popcorn badge preview on hover if queued */}
                  {hasMyPopcorn && (
                    <div className="mt-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-200 text-[10px] font-semibold">
                      <span>🍿</span>
                      <span>Up next</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimal Metadetails BELOW the image cover (Genre, description, reviews removed as requested) */}
              <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-2">
                <div>
                  <h4
                    className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug"
                    title={item.title}
                  >
                    {item.title}
                  </h4>

                  {/* Clean subtitle with Type & Rating only */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    <span className="capitalize">{item.type || 'Movie'}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold text-[11px]">
                      ★ {item.rating}
                    </span>
                  </div>
                </div>

                {/* Reaction Actions: Popcorn for upnext, Tick to mark complete */}
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-black/[0.05] dark:border-white/[0.06]">
                  {/* Popcorn Reaction Button */}
                  <button
                    type="button"
                    onClick={(e) => handlePopcornReaction(item, e)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                      hasMyPopcorn
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-2xs'
                        : 'bg-black/[0.03] dark:bg-white/[0.05] border-transparent text-slate-600 dark:text-slate-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]'
                    }`}
                    title={hasMyPopcorn ? 'Remove from up next' : 'Queue up next with popcorn'}
                  >
                    <span className="text-sm leading-none">🍿</span>
                    <span className="text-[11px]">Up next</span>
                  </button>

                  {/* Tick Reaction Button (Mark Complete) */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleComplete(item, e)}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                      watchedByAlex
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-2xs'
                        : 'bg-black/[0.03] dark:bg-white/[0.05] border-transparent text-slate-600 dark:text-slate-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]'
                    }`}
                    title={watchedByAlex ? 'Mark uncompleted by me' : 'Mark completed by me'}
                  >
                    <Check className={`w-3.5 h-3.5 ${watchedByAlex ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    <span className="text-[11px]">{watchedByAlex ? 'Done' : 'Tick'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOVIE DETAILS & REVIEWS MODAL CARD */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedMovie(null)}
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header Backdrop Banner */}
            <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden shrink-0">
              <img
                src={selectedMovie.backdropUrl || selectedMovie.posterUrl}
                alt={selectedMovie.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#211F26] via-black/40 to-black/20" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Poster Thumbnail & Header Details */}
              <div className="absolute bottom-3 inset-x-4 flex items-end gap-3 z-10">
                <img
                  src={selectedMovie.posterUrl}
                  alt=""
                  className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl object-cover shadow-2xl border-2 border-white dark:border-[#211F26] shrink-0"
                />
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white capitalize">
                      {selectedMovie.type || 'Movie'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-md">
                      {selectedMovie.genre}
                    </span>
                    {selectedMovie.runtime && (
                      <span className="text-[10px] font-mono text-slate-300">
                        {selectedMovie.runtime}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate mt-1">
                    {selectedMovie.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-0.5 text-xs">
                    <span className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {selectedMovie.rating} / 10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content: Details + Synopsis + Who Completed + Reviews */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Quick Actions Row */}
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handlePopcornReaction(selectedMovie)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    (selectedMovie.reactions || []).some(
                      (r) => r.userId === CURRENT_USER.id && (r.emoji === '🍿' || r.text.includes('Up next'))
                    )
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-[#1D1B20] border-black/[0.06] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-sm">🍿</span>
                  <span>
                    {(selectedMovie.reactions || []).some(
                      (r) => r.userId === CURRENT_USER.id && (r.emoji === '🍿' || r.text.includes('Up next'))
                    )
                      ? 'In your up next queue'
                      : 'Queue up next'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleComplete(selectedMovie)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    (selectedMovie.watchedBy || []).includes('alex')
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                      : 'bg-white dark:bg-[#1D1B20] border-black/[0.06] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{(selectedMovie.watchedBy || []).includes('alex') ? 'Completed by you' : 'Mark complete'}</span>
                </button>
              </div>

              {/* Completion Avatars Status */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
                <span className="text-xs font-semibold text-slate-500">
                  Completed status:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {(selectedMovie.watchedBy || []).includes('alex') && (
                      <img
                        src={CURRENT_USER.avatar}
                        alt="Alex"
                        className="w-6 h-6 rounded-full border-2 border-emerald-400 object-cover shadow-sm"
                        title="Completed by Alex"
                      />
                    )}
                    {(selectedMovie.watchedBy || []).includes('sam') && (
                      <img
                        src={PARTNER.avatar}
                        alt="Sam"
                        className="w-6 h-6 rounded-full border-2 border-pink-400 object-cover shadow-sm"
                        title="Completed by Sam"
                      />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {(selectedMovie.watchedBy || []).length === 2
                      ? 'Watched together 💖'
                      : (selectedMovie.watchedBy || []).includes('alex')
                      ? 'Watched by Alex'
                      : (selectedMovie.watchedBy || []).includes('sam')
                      ? 'Watched by Sam'
                      : 'Not completed yet'}
                  </span>
                </div>
              </div>

              {/* Synopsis / Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#6750A4] dark:text-[#D0BCFF]" />
                  <span>Story synopsis</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.05]">
                  {selectedMovie.overview || 'No synopsis available for this title.'}
                </p>
              </div>

              {/* Partner Reviews & Thoughts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-purple-500" />
                    <span>Reviews & thoughts</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {(selectedMovie.reactions || []).filter((r) => r.text && r.emoji !== '✓').length} reviews
                  </span>
                </div>

                {/* Reviews List */}
                <div className="space-y-2 mb-3">
                  {(selectedMovie.reactions || []).filter((r) => r.text && r.emoji !== '✓').length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      No thoughts written yet. Be the first to add a review!
                    </div>
                  ) : (
                    (selectedMovie.reactions || [])
                      .filter((r) => r.text && r.emoji !== '✓')
                      .map((r, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] flex items-start gap-2.5"
                        >
                          <img
                            src={r.userAvatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {r.userName}
                              </span>
                              <span className="text-sm">{r.emoji || '💬'}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                              {r.text}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {/* Add Review Input Form */}
                <form onSubmit={handleAddReview} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write a thought or review..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD TITLE MODAL WITH LIVE TMDB & ANILIST API SEARCH */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
                  Add to watchlist
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Search live on TMDB & AniList for posters & details
                </span>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live API Search Input */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-1.5">
                <label className="text-[11px] font-semibold text-slate-500">
                  Search TMDB / AniList
                </label>
                <div className="ml-auto flex items-center gap-1 text-[10px]">
                  {(['all', 'movie', 'show', 'anime'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setApiType(t)}
                      className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                        apiType === t
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Frieren, Dune, Interstellar, Arcane..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF] animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Quick Sample Tags */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-slate-400">Try:</span>
                {['Frieren', 'Dune', 'Spirited Away', 'Severance', 'Arcane'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSearchQuery(q)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-black/[0.07]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* API Live Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="mt-2.5 p-2 rounded-2xl bg-white dark:bg-[#1D1B20] border border-black/[0.08] dark:border-white/[0.1] shadow-xl max-h-56 overflow-y-auto space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1">
                    Select title to autofill:
                  </div>
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left transition-colors"
                    >
                      <img
                        src={res.posterUrl}
                        alt=""
                        className="w-8 h-12 object-cover rounded-md bg-black/10 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              res.source === 'anilist'
                                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {res.source === 'anilist' ? 'AniList' : 'TMDB'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {res.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {res.genre} · ★ {res.rating} · {res.runtime}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Autofilled / Manual Form */}
            <form onSubmit={handleAddItem} className="space-y-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dune: Part Two"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  >
                    <option value="movie">Movie</option>
                    <option value="show">Show</option>
                    <option value="anime">Anime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sci-Fi / Drama"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Poster cover URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newPoster}
                    onChange={(e) => setNewPoster(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                  {newPoster && (
                    <img
                      src={newPoster}
                      alt="Preview"
                      className="w-8 h-10 object-cover rounded-lg border border-black/10 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Runtime / Episodes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2h 46m or 12 eps"
                  value={newRuntime}
                  onChange={(e) => setNewRuntime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Overview synopsis (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis..."
                  value={newOverview}
                  onChange={(e) => setNewOverview(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] rounded-xl shadow-xs"
                >
                  Add to watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
