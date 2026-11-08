/**
 * BucketListSection: Shared bucket list with small square rounded cards
 * Features:
 * - Completed progress strip removed
 * - Small square rounded cards displaying photo proof or dream status
 * - Creator avatar icon on each card
 * - Editable and deletable ONLY by the creator of the dream
 * - Ability to add/edit proofs anytime
 * - Clicking a card opens the full photo proof lightbox
 * - Short labels, no full uppercase
 */
import React, { useState } from 'react';
import { BucketListItem } from '../../types/orbit';
import { INITIAL_BUCKET_LIST, CURRENT_USER, PARTNER } from '../../utils/mockData';
import {
  Camera,
  Plus,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  Compass,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';
import { haptics } from '../../utils/haptics';

const NO_PROOF_THEMES = [
  {
    bg: 'bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white border-white/20 shadow-orange-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#845EC2] to-[#D65DB1] text-white border-white/20 shadow-purple-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#00C9A7] to-[#0081CF] text-white border-white/20 shadow-teal-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#F39C12] to-[#E67E22] text-white border-white/20 shadow-amber-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#FF5E7E] to-[#FF9999] text-white border-white/20 shadow-pink-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#6C5CE7] to-[#a29bfe] text-white border-white/20 shadow-indigo-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#0984E3] to-[#74B9FF] text-white border-white/20 shadow-blue-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#6A0572] to-[#AB83A1] text-white border-white/20 shadow-fuchsia-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#10B981] to-[#047857] text-white border-white/20 shadow-emerald-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
  {
    bg: 'bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] text-white border-white/20 shadow-pink-500/10',
    categoryBadge: 'bg-black/25 text-white',
    pill: 'bg-white/20 text-white',
  },
];

const getNoProofTheme = (id: string, title: string) => {
  let hash = 0;
  const str = id + title;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return NO_PROOF_THEMES[Math.abs(hash) % NO_PROOF_THEMES.length];
};

export const BucketListSection: React.FC = () => {
  const [items, setItems] = useState<BucketListItem[]>(INITIAL_BUCKET_LIST);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
  const [viewProofItem, setViewProofItem] = useState<BucketListItem | null>(null);

  // New Item State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Travel' | 'Adventure' | 'Food' | 'Milestone'>('Travel');
  const [targetDate, setTargetDate] = useState('');
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [proofCaptionInput, setProofCaptionInput] = useState('');

  const filteredItems = items.filter(
    (item) => categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase()
  );

  // Delete item (only permitted for creator)
  const handleDelete = (item: BucketListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.createdById && item.createdById !== CURRENT_USER.id) {
      return; // Only creator can delete
    }
    haptics.heavy();
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  // Open edit modal
  const handleOpenEdit = (item: BucketListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.createdById && item.createdById !== CURRENT_USER.id) return;
    haptics.selection();
    setEditingItem(item);
    setNewTitle(item.title);
    setNewCategory(item.category);
    setTargetDate(item.targetDate || '');
    setProofUrlInput(item.proofImageUrl || '');
    setProofCaptionInput(item.proofCaption || '');
  };

  // Save edited dream & proof
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !newTitle.trim()) return;

    haptics.success();
    const hasProof = Boolean(proofUrlInput.trim());

    setItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              title: newTitle.trim(),
              category: newCategory,
              targetDate: targetDate.trim() || undefined,
              completed: hasProof || i.completed,
              proofImageUrl: proofUrlInput.trim() || i.proofImageUrl,
              proofCaption: proofCaptionInput.trim() || i.proofCaption,
              completedDate: hasProof ? i.completedDate || 'Recently' : i.completedDate,
              completedBy: hasProof ? i.completedBy || CURRENT_USER.name : i.completedBy,
            }
          : i
      )
    );

    setEditingItem(null);
    setNewTitle('');
    setProofUrlInput('');
    setProofCaptionInput('');
  };

  // Add new dream
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    haptics.success();
    const hasProof = Boolean(proofUrlInput.trim());

    const newItem: BucketListItem = {
      id: `b_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetDate: targetDate.trim() || undefined,
      completed: hasProof,
      createdById: CURRENT_USER.id,
      createdByName: CURRENT_USER.name,
      createdByAvatar: CURRENT_USER.avatar,
      proofImageUrl: proofUrlInput.trim() || undefined,
      proofCaption: proofCaptionInput.trim() || undefined,
      completedDate: hasProof ? 'Today' : undefined,
      completedBy: hasProof ? CURRENT_USER.name : undefined,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
    setNewTitle('');
    setTargetDate('');
    setProofUrlInput('');
    setProofCaptionInput('');
  };

  // Open Proof or Add Proof on Card Click
  const handleCardClick = (item: BucketListItem) => {
    haptics.selection();
    if (item.proofImageUrl) {
      setViewProofItem(item);
    } else if (item.createdById === CURRENT_USER.id) {
      // Creator can add proof directly
      setEditingItem(item);
      setNewTitle(item.title);
      setNewCategory(item.category);
      setTargetDate(item.targetDate || '');
      setProofUrlInput('');
      setProofCaptionInput('');
    }
  };

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Top Filter and Add Bar (Short labels, no uppercase, completed div removed) */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.08] mb-3">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {[
            { key: 'all', label: `All (${items.length})` },
            { key: 'travel', label: 'Travel' },
            { key: 'adventure', label: 'Adventure' },
            { key: 'food', label: 'Food' },
            { key: 'milestone', label: 'Milestones' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                haptics.selection();
                setCategoryFilter(cat.key);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                categoryFilter === cat.key
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            haptics.light();
            setIsAddOpen(true);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shrink-0 shadow-xs active:scale-95 transition-transform ml-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add dream</span>
        </button>
      </div>

      {/* Small Square Rounded Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 px-3 sm:px-4 pb-20 overflow-y-auto flex-1">
        {filteredItems.map((item) => {
          const isOwner = item.createdById === CURRENT_USER.id;
          const hasProof = Boolean(item.proofImageUrl);
          const noProofTheme = getNoProofTheme(item.id, item.title);

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className={`group relative aspect-square rounded-3xl p-3 flex flex-col justify-between overflow-hidden cursor-pointer border transition-all duration-300 hover:scale-[1.03] shadow-xs hover:shadow-xl ${
                hasProof
                  ? 'border-black/[0.08] dark:border-white/[0.1] bg-slate-950 text-white'
                  : `${noProofTheme.bg}`
              }`}
            >
              {/* If Proof Image Exists: Full Bleed Background with Dark Gradient */}
              {hasProof && (
                <>
                  <img
                    src={item.proofImageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
                </>
              )}

              {/* Top Row: Creator Avatar + Status Badge + Owner Controls */}
              <div className="relative z-10 flex items-center justify-between gap-1">
                {/* Creator Avatar with Tooltip */}
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-medium"
                  title={`Dream created by ${item.createdByName || 'Partner'}`}
                >
                  <img
                    src={
                      item.createdByAvatar ||
                      (item.createdById === CURRENT_USER.id ? CURRENT_USER.avatar : PARTNER.avatar)
                    }
                    alt={item.createdByName || 'Creator'}
                    className="w-4 h-4 rounded-full object-cover border border-white/40"
                  />
                  <span className="truncate max-w-[50px]">{item.createdByName || 'Alex'}</span>
                </div>

                {/* Right controls: Completed badge or Edit/Delete icons if owner */}
                <div className="flex items-center gap-1">
                  {item.completed ? (
                    <span
                      className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                      title="Goal achieved with proof!"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : null}

                  {/* Owner-only Edit & Delete */}
                  {isOwner && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-md rounded-full px-1 py-0.5 text-white">
                      <button
                        onClick={(e) => handleOpenEdit(item, e)}
                        className="p-1 hover:text-purple-300 transition-colors"
                        title="Edit dream or add proof"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item, e)}
                        className="p-1 hover:text-rose-400 transition-colors"
                        title="Delete dream"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Section: For No-Proof Cards, Big Text Taking Up the Whole Card */}
              {!hasProof ? (
                <div className="relative z-10 my-auto py-2 px-1 text-center flex-1 flex flex-col justify-center items-center">
                  <h4 className="text-sm sm:text-base md:text-lg font-black leading-snug tracking-tight text-white line-clamp-4 drop-shadow-sm select-none">
                    {item.title}
                  </h4>
                </div>
              ) : null}

              {/* Bottom Row */}
              {hasProof ? (
                <div className="relative z-10 min-w-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mb-1 bg-white/20 backdrop-blur-md text-white">
                    {item.category}
                  </span>

                  <h4 className="text-xs font-bold leading-snug line-clamp-2 text-white drop-shadow-sm">
                    {item.title}
                  </h4>

                  {/* Proof Status Cue */}
                  <div className="mt-1 flex items-center justify-between text-[10px] opacity-80">
                    <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                      <Camera className="w-3 h-3" />
                      <span>View proof</span>
                    </span>
                    {item.targetDate && (
                      <span className="font-mono text-slate-300">{item.targetDate}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex items-center justify-between text-[10px] pt-1.5 border-t border-white/20">
                  <span className="font-semibold px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-white">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isOwner ? (
                      <span className="flex items-center gap-1 font-semibold text-white/95 hover:underline bg-white/20 px-2 py-0.5 rounded-full">
                        <Camera className="w-2.5 h-2.5" />
                        <span>+ Add proof</span>
                      </span>
                    ) : item.targetDate ? (
                      <span className="font-mono text-white/80">{item.targetDate}</span>
                    ) : (
                      <span className="text-white/80">In progress</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* VIEW PROOF LIGHTBOX MODAL */}
      {viewProofItem && (
        <div
          onClick={() => setViewProofItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
        >
          <button
            onClick={() => setViewProofItem(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={viewProofItem.proofImageUrl}
              alt={viewProofItem.title}
              className="w-full max-h-[70vh] object-contain rounded-3xl mb-3 shadow-2xl"
            />
            <div className="p-4 rounded-3xl bg-black/60 backdrop-blur-md text-white border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accomplished ({viewProofItem.completedDate || 'Done'})</span>
                </span>
                <span className="text-[10px] text-white/60">
                  By {viewProofItem.completedBy || viewProofItem.createdByName || 'Alex & Sam'}
                </span>
              </div>
              <h3 className="text-sm font-bold">{viewProofItem.title}</h3>
              {viewProofItem.proofCaption && (
                <p className="text-xs text-white/80 italic mt-1.5">
                  "{viewProofItem.proofCaption}"
                </p>
              )}

              {/* Owner can edit proof directly */}
              {viewProofItem.createdById === CURRENT_USER.id && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => {
                      setViewProofItem(null);
                      handleOpenEdit(viewProofItem, { stopPropagation: () => {} } as any);
                    }}
                    className="flex items-center gap-1 text-xs text-[#D0BCFF] font-semibold hover:underline"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit proof or memory</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT DREAM & PROOF MODAL */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => {
              setIsAddOpen(false);
              setEditingItem(null);
            }}
          />
          <div className="relative w-full max-w-sm p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
                <span>{editingItem ? 'Edit dream & proof' : 'Add bucket list dream'}</span>
              </span>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingItem ? handleSaveEdit : handleAddItem} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Goal or dream
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scuba dive in Hawaii"
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
                  <option value="Travel">Travel</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Food">Food</option>
                  <option value="Milestone">Milestone</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Target timeframe (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer 2027"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              {/* Photo Proof Section (Add proof anytime) */}
              <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Proof photo URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash..."
                  value={proofUrlInput}
                  onChange={(e) => setProofUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              {proofUrlInput.trim() && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Proof memory caption
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Finished with flying colors! 🏆"
                    value={proofCaptionInput}
                    onChange={(e) => setProofCaptionInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 rounded-xl bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] text-xs font-semibold shadow-xs disabled:opacity-40"
                >
                  {editingItem ? 'Save changes' : 'Add dream'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
