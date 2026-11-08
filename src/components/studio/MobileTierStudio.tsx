/**
 * MobileTierStudio: Interactive Tier List Studio with Multi-List Collections & Drag-and-Drop
 * Supports "View Created Tiers" gallery, creating new tier lists, and authentic drag-and-drop between shelves and stash.
 */
import React, { useState } from 'react';
import { TierItem, TierRow, TierListCollection } from '../../types/orbit';
import { INITIAL_TIER_COLLECTIONS } from '../../utils/mockData';
import {
  Plus,
  X,
  RotateCcw,
  FolderOpen,
  Check,
  Trash2,
  Sparkles,
  GripVertical,
  Layers,
  ChevronRight
} from 'lucide-react';
import { haptics } from '../../utils/haptics';

export const MobileTierStudio: React.FC = () => {
  const [collections, setCollections] = useState<TierListCollection[]>(INITIAL_TIER_COLLECTIONS);
  const [activeCollectionId, setActiveCollectionId] = useState<string>(INITIAL_TIER_COLLECTIONS[0].id);

  // Modal states
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // New List Form State
  const [newListTitle, setNewListTitle] = useState('');
  const [newListEmoji, setNewListEmoji] = useState('✨');
  const [newListCategory, setNewListCategory] = useState('General');

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Selected item fallback for quick clicks
  const [selectedStashItem, setSelectedStashItem] = useState<TierItem | null>(null);

  // Drag and Drop State
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOverTier, setDragOverTier] = useState<'S' | 'A' | 'B' | 'C' | 'D' | 'stash' | null>(null);

  const activeCollection =
    collections.find((c) => c.id === activeCollectionId) || collections[0];

  const tiers = activeCollection.tiers;
  const stash = activeCollection.stash;

  // Move item to target tier
  const moveItem = (itemId: string, targetTier: 'S' | 'A' | 'B' | 'C' | 'D' | 'stash') => {
    haptics.medium();

    setCollections((prev) =>
      prev.map((col) => {
        if (col.id !== activeCollectionId) return col;

        // Find the item either in stash or in one of the tiers
        let itemToMove: TierItem | undefined = col.stash.find((i) => i.id === itemId);
        if (!itemToMove) {
          for (const t of col.tiers) {
            const found = t.items.find((i) => i.id === itemId);
            if (found) {
              itemToMove = found;
              break;
            }
          }
        }
        if (!itemToMove) return col;

        // Clean out from stash
        const newStash = col.stash.filter((i) => i.id !== itemId);

        // Clean out from tiers
        const newTiers = col.tiers.map((t) => ({
          ...t,
          items: t.items.filter((i) => i.id !== itemId),
        }));

        if (targetTier === 'stash') {
          return {
            ...col,
            stash: [itemToMove, ...newStash],
            tiers: newTiers,
          };
        }

        // Add to target tier shelf
        return {
          ...col,
          stash: newStash,
          tiers: newTiers.map((t) =>
            t.key === targetTier ? { ...t, items: [...t.items, itemToMove!] } : t
          ),
        };
      })
    );

    setSelectedStashItem(null);
    setDraggingItemId(null);
    setDragOverTier(null);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, item: TierItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingItemId(item.id);
    haptics.light();
  };

  const handleDragOver = (e: React.DragEvent, tierKey: 'S' | 'A' | 'B' | 'C' | 'D' | 'stash') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTier !== tierKey) {
      setDragOverTier(tierKey);
    }
  };

  const handleDrop = (e: React.DragEvent, targetTier: 'S' | 'A' | 'B' | 'C' | 'D' | 'stash') => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggingItemId;
    if (itemId) {
      moveItem(itemId, targetTier);
    }
  };

  // Add Item to active collection stash
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    haptics.success();
    const newItem: TierItem = {
      id: `t_${Date.now()}`,
      title: newTitle.trim(),
      imageUrl:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
    };

    setCollections((prev) =>
      prev.map((col) =>
        col.id === activeCollectionId
          ? { ...col, stash: [newItem, ...col.stash] }
          : col
      )
    );

    setIsAddItemModalOpen(false);
    setNewTitle('');
    setNewImageUrl('');
  };

  // Create New Tier List
  const handleCreateNewList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    haptics.success();
    const newId = `tierlist_${Date.now()}`;
    const newCol: TierListCollection = {
      id: newId,
      title: `${newListTitle.trim()} ${newListEmoji}`,
      emoji: newListEmoji,
      category: newListCategory.trim() || 'Custom',
      tiers: [
        { key: 'S', label: 'S', color: '#FF7F7F', items: [] },
        { key: 'A', label: 'A', color: '#FFBF7F', items: [] },
        { key: 'B', label: 'B', color: '#FFDF7F', items: [] },
        { key: 'C', label: 'C', color: '#FFFF7F', items: [] },
        { key: 'D', label: 'D', color: '#BFFF7F', items: [] },
      ],
      stash: [
        {
          id: `item_starter_1_${Date.now()}`,
          title: 'Option 1',
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: `item_starter_2_${Date.now()}`,
          title: 'Option 2',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
        },
      ],
      updatedAt: 'Just now',
    };

    setCollections((prev) => [newCol, ...prev]);
    setActiveCollectionId(newId);
    setIsCreateListModalOpen(false);
    setIsCollectionsModalOpen(false);
    setNewListTitle('');
  };

  // Reset current active collection
  const resetCurrentList = () => {
    haptics.heavy();
    const defaultCol = INITIAL_TIER_COLLECTIONS.find((c) => c.id === activeCollectionId);
    if (defaultCol) {
      setCollections((prev) =>
        prev.map((c) => (c.id === activeCollectionId ? defaultCol : c))
      );
    } else {
      // Empty all tiers back to stash
      setCollections((prev) =>
        prev.map((c) => {
          if (c.id !== activeCollectionId) return c;
          const allItems = [...c.stash, ...c.tiers.flatMap((t) => t.items)];
          return {
            ...c,
            stash: allItems,
            tiers: c.tiers.map((t) => ({ ...t, items: [] })),
          };
        })
      );
    }
  };

  // Delete current list (if more than 1)
  const handleDeleteList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (collections.length <= 1) return;
    haptics.heavy();
    const remaining = collections.filter((c) => c.id !== id);
    setCollections(remaining);
    if (activeCollectionId === id) {
      setActiveCollectionId(remaining[0].id);
    }
  };

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Tier Studio Header with View Created Tiers Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.08] max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => {
              haptics.selection();
              setIsCollectionsModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] transition-colors text-left"
          >
            <FolderOpen className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block max-w-[140px] sm:max-w-[200px]">
                {activeCollection.title}
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block">
                View Created Tiers ({collections.length}) ▾
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetCurrentList}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/[0.03] transition-colors"
            title="Reset current tier list"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              haptics.light();
              setIsAddItemModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xs active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => {
          haptics.medium();
          setIsAddItemModalOpen(true);
        }}
        className="sm:hidden fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Add item"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Tier Shelves Container */}
      <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-w-4xl mx-auto w-full">
        {tiers.map((tier) => {
          const isOver = dragOverTier === tier.key;

          return (
            <div
              key={tier.key}
              onDragOver={(e) => handleDragOver(e, tier.key)}
              onDragLeave={() => setDragOverTier(null)}
              onDrop={(e) => handleDrop(e, tier.key)}
              className={`flex rounded-2xl overflow-hidden bg-black/[0.03] dark:bg-[#1D1B20] border transition-all min-h-[80px] shadow-xs ${
                isOver
                  ? 'border-[#6750A4] dark:border-[#D0BCFF] ring-2 ring-purple-400 bg-purple-500/10'
                  : 'border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              {/* Color Tier Badge */}
              <div
                className="w-16 sm:w-20 flex items-center justify-center shrink-0 font-black text-2xl text-slate-950 shadow-inner select-none cursor-default"
                style={{ backgroundColor: tier.color }}
              >
                {tier.label}
              </div>

              {/* Shelf Scroll View & Drop Target */}
              <div className="flex-1 flex items-center gap-2.5 p-2.5 overflow-x-auto min-w-0">
                {tier.items.length === 0 ? (
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 italic px-3 py-4 flex items-center gap-1.5 pointer-events-none">
                    <GripVertical className="w-3.5 h-3.5 opacity-40" />
                    <span>Drag items here or tap stash to rank</span>
                  </div>
                ) : (
                  tier.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => moveItem(item.id, 'stash')}
                      className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-xs border border-white/20 cursor-grab active:cursor-grabbing transition-transform hover:scale-105 active:scale-95"
                      title={`${item.title} (Drag or click to demote to stash)`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold text-center px-1">
                        <X className="w-4 h-4" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Items Stash with Drop Area */}
      <div
        onDragOver={(e) => handleDragOver(e, 'stash')}
        onDragLeave={() => setDragOverTier(null)}
        onDrop={(e) => handleDrop(e, 'stash')}
        className={`p-3.5 bg-white dark:bg-[#211F26] border-t max-w-4xl mx-auto w-full rounded-t-3xl shadow-lg transition-all ${
          dragOverTier === 'stash'
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 ring-2 ring-purple-400'
            : 'border-black/[0.08] dark:border-white/[0.1]'
        }`}
      >
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#6750A4] dark:text-[#D0BCFF]" />
            Unranked stash ({stash.length})
          </span>
          {selectedStashItem && (
            <span className="text-[11px] font-semibold text-[#6750A4] dark:text-[#D0BCFF] animate-pulse">
              Rank "{selectedStashItem.title}":
            </span>
          )}
        </div>

        {/* If an item is selected from stash via click, show fast tier buttons */}
        {selectedStashItem ? (
          <div className="flex items-center gap-2 p-2 bg-[#EADDFF] dark:bg-[#4F378B]/40 rounded-2xl mb-2.5">
            <img
              src={selectedStashItem.imageUrl}
              alt={selectedStashItem.title}
              className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate">{selectedStashItem.title}</div>
            </div>
            <div className="flex items-center gap-1.5">
              {(['S', 'A', 'B', 'C', 'D'] as const).map((key) => {
                const color = tiers.find((t) => t.key === key)?.color;
                return (
                  <button
                    key={key}
                    onClick={() => moveItem(selectedStashItem.id, key)}
                    className="w-7 h-7 rounded-lg font-black text-xs text-black shadow-xs active:scale-95 transition-transform"
                    style={{ backgroundColor: color }}
                  >
                    {key}
                  </button>
                );
              })}
              <button
                onClick={() => setSelectedStashItem(null)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}

        {/* Horizontal Stash List */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          {stash.length === 0 ? (
            <div className="py-2.5 px-3 text-xs text-slate-400 italic">
              All items are ranked! Drag items back here to unrank, or click "Add Item" to add new tokens.
            </div>
          ) : (
            stash.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => {
                  haptics.selection();
                  setSelectedStashItem(item);
                }}
                className={`relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all hover:scale-105 active:scale-95 ${
                  selectedStashItem?.id === item.id
                    ? 'border-[#6750A4] dark:border-[#D0BCFF] ring-2 ring-purple-400'
                    : 'border-transparent hover:border-black/20 shadow-xs'
                }`}
                title="Drag to shelf or tap to rank"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] font-medium truncate px-1 text-center">
                  {item.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* VIEW CREATED TIERS MODAL (Full-fledged Card View Gallery) */}
      {isCollectionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsCollectionsModalOpen(false)} />
          <div className="relative w-full max-w-3xl p-5 sm:p-6 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10 max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#6750A4] dark:text-[#D0BCFF]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Created Tier Lists ({collections.length})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    haptics.light();
                    setIsCreateListModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] text-xs font-semibold shadow-xs active:scale-95 transition-transform"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New List</span>
                </button>
                <button
                  onClick={() => setIsCollectionsModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Card Grid of Created Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-1 pb-1">
              {collections.map((col) => {
                const isActive = col.id === activeCollectionId;
                const totalRanked = col.tiers.reduce((acc, t) => acc + t.items.length, 0);

                return (
                  <div
                    key={col.id}
                    onClick={() => {
                      haptics.selection();
                      setActiveCollectionId(col.id);
                      setIsCollectionsModalOpen(false);
                    }}
                    className={`group relative flex flex-col justify-between p-4 rounded-3xl cursor-pointer border transition-all duration-200 hover:-translate-y-0.5 ${
                      isActive
                        ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-400 dark:border-purple-600 shadow-md ring-2 ring-purple-300 dark:ring-purple-700'
                        : 'bg-white dark:bg-[#1D1B20] border-black/[0.08] dark:border-white/[0.08] hover:shadow-md hover:border-purple-300'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xl shrink-0 shadow-xs border border-purple-200/50 dark:border-purple-700/50">
                            {col.emoji}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                              {col.title}
                            </h4>
                            <span className="text-[11px] font-medium text-slate-500">
                              {col.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {isActive && (
                            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-700">
                              Active
                            </span>
                          )}
                          {collections.length > 1 && (
                            <button
                              onClick={(e) => handleDeleteList(col.id, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Delete tier list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mini Tier Shelves Visual Preview */}
                      <div className="space-y-1 mb-3.5 bg-black/[0.02] dark:bg-black/20 p-2 rounded-2xl border border-black/[0.04] dark:border-white/[0.04]">
                        {col.tiers.map((t) => (
                          <div key={t.key} className="flex items-center gap-1.5 h-6 rounded-lg overflow-hidden bg-white/60 dark:bg-white/[0.04]">
                            <div
                              className="w-6 h-full flex items-center justify-center font-black text-[10px] text-slate-950 shrink-0"
                              style={{ backgroundColor: t.color }}
                            >
                              {t.label}
                            </div>
                            <div className="flex items-center gap-1 overflow-hidden px-1">
                              {t.items.length === 0 ? (
                                <span className="text-[9px] text-slate-400 italic">empty</span>
                              ) : (
                                t.items.slice(0, 5).map((it) => (
                                  <img
                                    key={it.id}
                                    src={it.imageUrl}
                                    alt={it.title}
                                    className="w-4 h-4 rounded-full object-cover shrink-0 border border-white/40"
                                  />
                                ))
                              )}
                              {t.items.length > 5 && (
                                <span className="text-[9px] font-bold text-slate-500">
                                  +{t.items.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.06] text-xs">
                      <span className="text-slate-500 text-[11px]">
                        {totalRanked} ranked · {col.stash.length} stash
                      </span>
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                          isActive
                            ? 'bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xs'
                            : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 group-hover:bg-[#6750A4] group-hover:text-white'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Current</span>
                          </>
                        ) : (
                          <>
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Create New Tier List Action Card */}
              <button
                type="button"
                onClick={() => {
                  haptics.light();
                  setIsCreateListModalOpen(true);
                }}
                className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-purple-300 dark:border-purple-800 hover:border-purple-500 bg-purple-50/30 dark:bg-purple-950/10 hover:bg-purple-50/60 dark:hover:bg-purple-950/20 text-center transition-all group min-h-[190px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-[#6750A4] dark:text-[#D0BCFF] flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Create New Tier List
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  Custom shelves & items
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TIER LIST MODAL */}
      {isCreateListModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsCreateListModalOpen(false)} />
          <div className="relative w-full max-w-sm p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
                New Tier List
              </h4>
              <button onClick={() => setIsCreateListModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateNewList} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  List title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Favorite Cafes in Tokyo"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Emoji icon
                </label>
                <div className="flex gap-2">
                  {['🍕', '🎬', '✈️', '🎡', '☕', '🎵', '🎮', '❤️'].map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setNewListEmoji(em)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border transition-all ${
                        newListEmoji === em
                          ? 'border-[#6750A4] dark:border-[#D0BCFF] bg-purple-100 dark:bg-purple-950/60 scale-110'
                          : 'border-transparent bg-black/[0.04] dark:bg-white/[0.05]'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Travel, Food, Movies"
                  value={newListCategory}
                  onChange={(e) => setNewListCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateListModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] rounded-xl shadow-xs"
                >
                  Create board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsAddItemModalOpen(false)} />
          <div className="relative w-full max-w-xs p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Add to stash
              </h4>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Item title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truffle Fries 🍟"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Image url (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] rounded-xl shadow-xs"
                >
                  Add to Stash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
