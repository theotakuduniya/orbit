/**
 * PolymorphicListHost: Polymorphic reusable list component
 * Switches dynamically between Media Cards mode and Compact Links/Checklist mode
 * with interactive completion and link opening.
 */
import React, { useState } from 'react';
import { VaultItem } from '../../types/orbit';
import { INITIAL_VAULT_ITEMS, CURRENT_USER } from '../../utils/mockData';
import {
  CheckSquare,
  Square,
  ExternalLink,
  Plus,
  LayoutGrid,
  List,
  X,
  Tag
} from 'lucide-react';
import { haptics } from '../../utils/haptics';

export type DisplayMode = 'cards' | 'compact';

export const PolymorphicListHost: React.FC = () => {
  const [items, setItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);
  const [mode, setMode] = useState<DisplayMode>('cards');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<'restaurant' | 'idea' | 'recipe' | 'travel'>('restaurant');

  const handleToggleComplete = (id: string) => {
    haptics.selection();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          if (nextCompleted) haptics.success();
          return { ...item, completed: nextCompleted };
        }
        return item;
      })
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    haptics.success();
    const newItem: VaultItem = {
      id: `v_${Date.now()}`,
      title: newTitle.trim(),
      caption: newCaption.trim() || undefined,
      url: newUrl.trim() || undefined,
      imageUrl:
        newCategory === 'restaurant'
          ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
          : newCategory === 'travel'
          ? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      category: newCategory,
      completed: false,
      addedBy: CURRENT_USER,
      addedAt: 'Just now',
      tags: [newCategory.toUpperCase()],
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewCaption('');
    setNewUrl('');
  };

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Controls Bar: Segmented Buttons + Add - hidden on mobile view */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 border-b border-black/[0.06] dark:border-white/[0.08]">
        {/* Segmented Buttons for Display Mode */}
        <div className="flex items-center p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06]">
          <button
            onClick={() => {
              haptics.light();
              setMode('cards');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'cards'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => {
              haptics.light();
              setMode('compact');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'compact'
                ? 'bg-white dark:bg-[#4F378B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Quick Links</span>
          </button>
        </div>

        <button
          onClick={() => {
            haptics.light();
            setIsAddOpen(true);
          }}
          className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xs active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Mobile Floating Action Button (Elevated touch target >= 48px) */}
      <button
        onClick={() => {
          haptics.medium();
          setIsAddOpen(true);
        }}
        className="sm:hidden fixed bottom-36 right-4 z-40 min-w-[50px] min-h-[50px] w-13 h-13 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xl shadow-black/20 dark:shadow-black/40 flex items-center justify-center active:scale-90 transition-transform touch-manipulation cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6750A4]"
        aria-label="New entry"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* List Content */}
      <div className="p-3 overflow-y-auto flex-1">
        <div className={mode === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto' : 'space-y-2 max-w-4xl mx-auto'}>
        {items.map((item) => {
          if (mode === 'cards') {
            return (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden bg-white dark:bg-[#1D1B20] border border-black/[0.08] dark:border-white/[0.1] shadow-xs transition-shadow hover:shadow-md"
              >
                {item.imageUrl && (
                  <div className="relative h-40 overflow-hidden bg-black/5">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </div>
                )}

                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-bold text-slate-900 dark:text-slate-100 ${
                          item.completed ? 'line-through opacity-50' : ''
                        }`}
                      >
                        {item.title}
                      </h4>
                      {item.caption && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      className="p-1 text-slate-400 hover:text-[#6750A4] dark:hover:text-[#D0BCFF] transition-colors shrink-0"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-5 h-5 text-[#6750A4] dark:text-[#D0BCFF]" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Metadata and URL link */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/[0.05] dark:border-white/[0.06] text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <img src={item.addedBy.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span>{item.addedBy.name} · {item.addedAt}</span>
                    </div>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#6750A4] dark:text-[#D0BCFF] hover:underline"
                      >
                        <span>Open Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Compact Mode (Links & Checklists)
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#1D1B20] border border-black/[0.06] dark:border-white/[0.08] shadow-2xs hover:bg-black/[0.02]"
            >
              <button
                onClick={() => handleToggleComplete(item.id)}
                className="text-slate-400 hover:text-[#6750A4] dark:hover:text-[#D0BCFF] shrink-0"
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-[#6750A4] dark:text-[#D0BCFF]" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-bold text-slate-900 dark:text-slate-100 truncate ${
                    item.completed ? 'line-through opacity-50' : ''
                  }`}
                >
                  {item.title}
                </div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#6750A4] dark:text-[#D0BCFF] truncate hover:underline block mt-0.5"
                  >
                    {item.url}
                  </a>
                ) : item.caption ? (
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.caption}</div>
                ) : null}
              </div>

              <span className="text-[10px] text-slate-400 shrink-0 px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06]">
                {item.category}
              </span>
            </div>
          );
        })}
        </div>
      </div>

      {/* Add New Vault Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-sm p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Add to vault
              </h4>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Osteria Francescana"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                >
                  <option value="restaurant">Restaurant & Dining</option>
                  <option value="travel">Travel & Getaway</option>
                  <option value="idea">Date Idea / Workshop</option>
                  <option value="recipe">Recipe to Cook</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Web link (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Notes or details
                </label>
                <textarea
                  rows={2}
                  placeholder="Reservation notes, recommendations..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
