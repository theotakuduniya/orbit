/**
 * GalleryDump: Shared and individual photo dump gallery
 * Allows Alex and Sam to drop memories, tag pictures, like, and view full-screen.
 */
import React, { useState } from 'react';
import { GalleryItem } from '../../types/orbit';
import { INITIAL_GALLERY_ITEMS, CURRENT_USER, PARTNER } from '../../utils/mockData';
import { Heart, Plus, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { haptics } from '../../utils/haptics';

export const GalleryDump: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [filter, setFilter] = useState<'all' | 'shared' | 'alex' | 'sam'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // Form State
  const [photoUrl, setPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [photoType, setPhotoType] = useState<'shared' | 'alex' | 'sam'>('shared');

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    haptics.light();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextLiked = !item.userLiked;
        return {
          ...item,
          userLiked: nextLiked,
          likes: nextLiked ? item.likes + 1 : Math.max(0, item.likes - 1),
        };
      })
    );
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;

    haptics.success();
    const isAlex = photoType === 'alex' || photoType === 'shared';
    const author = isAlex ? CURRENT_USER : PARTNER;

    const newItem: GalleryItem = {
      id: `gal_${Date.now()}`,
      imageUrl: photoUrl.trim(),
      title: title.trim() || undefined,
      type: photoType,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      timestamp: 'Just now',
      likes: 1,
      userLiked: true,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
    setPhotoUrl('');
    setTitle('');
  };

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Top Filter and Add Bar - hidden on mobile view */}
      <div className="hidden sm:flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.08] mb-3">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {[
            { key: 'all', label: `All (${items.length})` },
            { key: 'shared', label: 'Shared (Us 💖)' },
            { key: 'alex', label: "Alex's Snaps" },
            { key: 'sam', label: "Sam's Snaps" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                haptics.selection();
                setFilter(tab.key as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.key
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            haptics.light();
            setIsAddOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shrink-0 shadow-xs active:scale-95 transition-transform ml-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Drop Photo</span>
        </button>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => {
          haptics.medium();
          setIsAddOpen(true);
        }}
        className="sm:hidden fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Drop photo"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Masonry Columns Gallery */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-3.5 space-y-3.5 px-3 sm:px-4 flex-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              haptics.selection();
              setActiveLightboxItem(item);
            }}
            className="group relative rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.1] shadow-xs hover:shadow-md transition-all active:scale-[0.99] break-inside-avoid cursor-pointer"
          >
            <img
              src={item.imageUrl}
              alt={item.title || 'Memory'}
              className="w-full h-auto object-cover block group-hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />

            {/* Author Avatar Pill */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-medium shadow-sm">
              <img
                src={item.authorAvatar}
                alt={item.authorName}
                className="w-3.5 h-3.5 rounded-full object-cover"
              />
              <span>{item.authorName}</span>
            </div>

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
              {item.title ? (
                <span className="text-[10px] text-white/90 font-medium truncate bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full max-w-[130px]">
                  {item.title}
                </span>
              ) : <span />}

              <button
                onClick={(e) => handleLike(item.id, e)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white shadow-sm pointer-events-auto transition-transform active:scale-125 ${
                  item.userLiked ? 'text-rose-400 font-bold' : 'text-white/80'
                }`}
              >
                <Heart
                  className={`w-3 h-3 ${item.userLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                />
                <span className="text-[10px] font-mono">{item.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          onClick={() => setActiveLightboxItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
        >
          <button
            onClick={() => setActiveLightboxItem(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeLightboxItem.imageUrl}
              alt={activeLightboxItem.title || 'Memory'}
              className="w-full max-h-[75vh] object-contain rounded-2xl mb-3 shadow-2xl"
            />
            <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={activeLightboxItem.authorAvatar}
                  alt={activeLightboxItem.authorName}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <span className="font-semibold block truncate">
                    {activeLightboxItem.title || 'Photo Memory'}
                  </span>
                  <span className="text-[10px] text-white/60 block">
                    Shared by {activeLightboxItem.authorName} · {activeLightboxItem.timestamp}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleLike(activeLightboxItem.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all ${
                  activeLightboxItem.userLiked ? 'text-rose-400' : 'text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeLightboxItem.userLiked ? 'fill-rose-500' : ''}`} />
                <span className="font-mono">{activeLightboxItem.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drop Photo Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-sm p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
                <span>Drop a Photo</span>
              </span>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Photo source
                </label>
                <div className="flex rounded-xl bg-black/[0.04] dark:bg-white/[0.06] p-1 gap-1">
                  {[
                    { key: 'shared', label: 'Shared (Us 💖)' },
                    { key: 'alex', label: 'Alex' },
                    { key: 'sam', label: 'Sam' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setPhotoType(t.key as any)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                        photoType === t.key
                          ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Memory title (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon coffee in the garden"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  disabled={!photoUrl.trim()}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] rounded-xl shadow-xs disabled:opacity-40"
                >
                  Post Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
