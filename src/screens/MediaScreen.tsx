/**
 * MediaScreen: Media Lounge Tab
 * Sub-segments: [Meme Vault] | [Spotify] | [YouTube]
 */
import React, { useState } from 'react';
import { GalleryDump } from '../components/media/GalleryDump';
import { MemeMasonryCard } from '../components/media/MemeMasonryCard';
import { SpotifyDeck } from '../components/media/SpotifyDeck';
import { YouTubeDeck } from '../components/media/YouTubeDeck';
import { MemeItem } from '../types/orbit';
import { INITIAL_MEMES, CURRENT_USER } from '../utils/mockData';
import { Image, Images, Music, Tv, Plus, X } from 'lucide-react';
import { haptics } from '../utils/haptics';

export const MediaScreen: React.FC = () => {
  const [segment, setSegment] = useState<'gallery' | 'memes' | 'spotify' | 'youtube'>('gallery');
  const [memes, setMemes] = useState<MemeItem[]>(INITIAL_MEMES);
  const [isAddMemeOpen, setIsAddMemeOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleUpdateMeme = (updated: MemeItem) => {
    setMemes((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleAddMeme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    haptics.success();
    const newMeme: MemeItem = {
      id: `meme_${Date.now()}`,
      imageUrl: newImageUrl.trim(),
      caption: newTitle.trim() || 'Meme',
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      likes: 1,
      fires: 1,
      userLiked: true,
      userFired: false,
      timestamp: 'Just now',
      voiceReactions: [],
    };

    setMemes((prev) => [newMeme, ...prev]);
    setIsAddMemeOpen(false);
    setNewTitle('');
    setNewImageUrl('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal Pill Segments */}
      <div className="px-3 sm:px-4 py-2 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#FEF7FF]/50 dark:bg-[#141218]/50 backdrop-blur-xs">
        <div className="flex items-center p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] gap-1 overflow-x-auto">
          <button
            onClick={() => {
              haptics.selection();
              setSegment('gallery');
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              segment === 'gallery'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Images className="w-3.5 h-3.5" />
            <span>Gallery Dump</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('memes');
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              segment === 'memes'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Meme Vault</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('spotify');
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              segment === 'spotify'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Music</span>
          </button>

          <button
            onClick={() => {
              haptics.selection();
              setSegment('youtube');
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              segment === 'youtube'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </button>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto">
        {segment === 'gallery' && <GalleryDump />}
        {segment === 'memes' && (
          <div className="p-3 pb-16">
            {/* Top Toolbar - hidden on mobile */}
            <div className="hidden sm:flex items-center justify-between px-2 mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Couple Meme Dump ({memes.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  haptics.light();
                  setIsAddMemeOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xs active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Drop Meme</span>
              </button>
            </div>

            {/* Mobile Floating Action Button (Elevated touch target >= 48px) */}
            <button
              onClick={() => {
                haptics.medium();
                setIsAddMemeOpen(true);
              }}
              className="sm:hidden fixed bottom-36 right-4 z-40 min-w-[50px] min-h-[50px] w-13 h-13 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xl shadow-black/20 dark:shadow-black/40 flex items-center justify-center active:scale-90 transition-transform touch-manipulation cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6750A4]"
              aria-label="Drop meme"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Staggered Masonry Grid */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-7xl mx-auto">
              {memes.map((meme) => (
                <MemeMasonryCard
                  key={meme.id}
                  meme={meme}
                  onUpdateMeme={handleUpdateMeme}
                />
              ))}
            </div>

            {/* Add Meme Modal */}
            {isAddMemeOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
                <div className="fixed inset-0" onClick={() => setIsAddMemeOpen(false)} />
                <div className="relative w-full max-w-xs p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Drop a Meme
                    </h4>
                    <button onClick={() => setIsAddMemeOpen(false)} className="p-1 text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddMeme} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Meme image URL
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Title or tag (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mood today"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setIsAddMemeOpen(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newImageUrl.trim()}
                        className="px-4 py-1.5 text-xs font-semibold bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] rounded-xl shadow-xs disabled:opacity-40"
                      >
                        Drop Meme
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {segment === 'spotify' && <SpotifyDeck />}
        {segment === 'youtube' && <YouTubeDeck />}
      </div>
    </div>
  );
};
