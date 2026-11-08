/**
 * MoodboardCanvas: Freeform collaborative pinboard
 * Displays pinned photos, link tickets, and sticky notes in multiple aesthetic pastel colors.
 * Simplified modal without preset clutter or color selectors.
 */
import React, { useState } from 'react';
import { MoodboardItem } from '../../types/orbit';
import { INITIAL_MOODBOARD_ITEMS } from '../../utils/mockData';
import { Heart, Plus, Trash2, X, Pin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { haptics } from '../../utils/haptics';

// Diverse pastel palette automatically cycled for cards & sticky notes
const PASTEL_PALETTE = [
  { bg: '#FEF08A', darkBg: '#713F12', text: '#713F12', border: '#FDE047', tape: 'rgba(253, 224, 71, 0.7)' }, // Sunny Yellow
  { bg: '#FBCFE8', darkBg: '#831843', text: '#831843', border: '#F472B6', tape: 'rgba(244, 114, 182, 0.7)' }, // Pastel Pink
  { bg: '#E9D5FF', darkBg: '#581C87', text: '#581C87', border: '#C084FC', tape: 'rgba(192, 132, 252, 0.7)' }, // Lavender
  { bg: '#BBF7D0', darkBg: '#14532D', text: '#14532D', border: '#86EFAC', tape: 'rgba(134, 239, 172, 0.7)' }, // Mint Sage
  { bg: '#BAE6FD', darkBg: '#0C4A6E', text: '#0C4A6E', border: '#7DD3FC', tape: 'rgba(125, 211, 252, 0.7)' }, // Sky Blue
  { bg: '#FED7AA', darkBg: '#7C2D12', text: '#7C2D12', border: '#FDBA74', tape: 'rgba(253, 186, 116, 0.7)' }, // Peach
];

export const MoodboardCanvas: React.FC = () => {
  const [items, setItems] = useState<MoodboardItem[]>(INITIAL_MOODBOARD_ITEMS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newType, setNewType] = useState<'photo' | 'note'>('photo');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('#FEF08A');

  const handleLike = (id: string) => {
    haptics.light();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    haptics.heavy();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() && !newImageUrl.trim()) return;

    haptics.success();
    const randomRotation = Number((Math.random() * 6 - 3).toFixed(1)); // -3 to +3 deg

    const newItem: MoodboardItem = {
      id: `mb_${Date.now()}`,
      type: newType,
      title: newTitle.trim() || undefined,
      content: newContent.trim(),
      imageUrl:
        newType === 'photo'
          ? newImageUrl.trim() || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80'
          : undefined,
      color: selectedColor,
      authorId: 'user_alex',
      rotation: randomRotation,
      position: { x: 20 + Math.random() * 40, y: 40 + Math.random() * 60 },
      likes: 1,
      timestamp: 'Just now',
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewImageUrl('');
  };

  // Helper to get card color styling
  const getCardStyle = (item: MoodboardItem, index: number) => {
    const palette = PASTEL_PALETTE[index % PASTEL_PALETTE.length];
    const itemColor = item.color || palette.bg;

    if (item.type === 'note') {
      return {
        backgroundColor: itemColor,
        color: '#1E293B',
        borderColor: `${itemColor}CC`,
        tapeColor: palette.tape,
      };
    }

    // Photo Card: soft cream or tinted pastel border
    return {
      backgroundColor: itemColor === '#FFFFFF' ? '#FFFFFF' : `${itemColor}15`,
      borderColor: itemColor === '#FFFFFF' ? 'rgba(0,0,0,0.08)' : `${itemColor}60`,
      tapeColor: palette.tape,
    };
  };

  return (
    <div className="relative min-h-[520px] pb-16">
      {/* Pinboard Toolbar */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] mb-4">
        <div>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Pin className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
            Shared Moodboard ({items.length})
          </span>
        </div>
        <button
          onClick={() => {
            haptics.light();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] text-xs font-semibold shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Pin to Board</span>
        </button>
      </div>

      {/* Pinboard Grid / Scattered Surface */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item, idx) => {
          const style = getCardStyle(item, idx);
          const isNote = item.type === 'note';

          return (
            <motion.div
              key={item.id}
              drag
              dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
              whileDrag={{ scale: 1.04, zIndex: 30 }}
              style={{
                rotate: `${item.rotation}deg`,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
              }}
              className={`relative rounded-2xl p-3.5 shadow-md border cursor-grab active:cursor-grabbing transition-shadow ${
                isNote
                  ? 'shadow-black/5 dark:shadow-black/20'
                  : 'bg-white dark:bg-[#211F26] border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100'
              }`}
            >
              {/* Washi Tape / Pushpin Effect with Color Accents */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 backdrop-blur-xs rounded-xs shadow-xs border-b border-black/10"
                style={{ backgroundColor: style.tapeColor }}
              />

              {/* Photo Card Type */}
              {item.imageUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-3 bg-black/5 shadow-inner">
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Pinned photo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content & Metadata */}
              <div className="px-0.5">
                {item.title && (
                  <h4
                    className={`text-sm font-bold leading-snug mb-1 ${
                      isNote ? 'text-slate-900' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                  </h4>
                )}
                <p
                  className={`text-xs leading-relaxed ${
                    isNote ? 'text-slate-800 font-medium' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.content}
                </p>

                <div
                  className={`flex items-center justify-between mt-3 pt-2 border-t text-[11px] ${
                    isNote
                      ? 'border-black/10 text-slate-700'
                      : 'border-black/10 dark:border-white/10 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="font-medium">{item.timestamp}</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                      title="Love this pin"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span className="font-mono">{item.likes}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="hover:text-red-600 transition-colors opacity-60 hover:opacity-100"
                      title="Remove pin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add New Pin Modal (Clean without presets or color pickers) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-sm p-6 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pin to Moodboard
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Switcher: Polaroid Photo vs Sticky Note */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-white/[0.06] p-1 mb-4">
              <button
                type="button"
                onClick={() => setNewType('photo')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  newType === 'photo'
                    ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Polaroid Photo
              </button>
              <button
                type="button"
                onClick={() => setNewType('note')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  newType === 'note'
                    ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Sticky Note
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Title (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next Summer Dreams ☀️"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              {newType === 'photo' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Photo url
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {newType === 'photo' ? 'Photo caption' : 'Note content'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write your note, idea or memory..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              {/* Color Options & Custom Color Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Card and sticky note color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { hex: '#FEF08A', label: 'Yellow' },
                    { hex: '#FBCFE8', label: 'Pink' },
                    { hex: '#E9D5FF', label: 'Lavender' },
                    { hex: '#BBF7D0', label: 'Mint' },
                    { hex: '#BAE6FD', label: 'Sky' },
                    { hex: '#FED7AA', label: 'Peach' },
                    { hex: '#FFFFFF', label: 'White' },
                    { hex: '#334155', label: 'Slate' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        haptics.light();
                        setSelectedColor(c.hex);
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        selectedColor === c.hex
                          ? 'scale-125 border-purple-600 shadow-md ring-2 ring-purple-300'
                          : 'border-black/10 dark:border-white/20'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}

                  {/* Custom Color Input */}
                  <div className="flex items-center gap-1.5 ml-auto pl-2 border-l border-black/10 dark:border-white/10">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                      title="Custom color picker"
                    />
                    <span className="text-[10px] font-mono text-slate-500">
                      {selectedColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-sm active:scale-95 transition-transform"
                >
                  Pin to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
