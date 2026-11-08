/**
 * OrbitHeader: Responsive Website Header with Space Switcher, Navigation Links, & Partner Presence
 */
import React, { useState } from 'react';
import { useSpace } from '../../context/SpaceContext';
import {
  ChevronDown,
  Search,
  Moon,
  Sun,
  Sparkles,
  Users,
  Check,
  Palette,
  Film,
  Bookmark
} from 'lucide-react';
import { TabKey } from '../../navigation/BottomTabNavigator';
import { haptics } from '../../utils/haptics';

interface OrbitHeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const OrbitHeader: React.FC<OrbitHeaderProps> = ({ activeTab, onTabChange }) => {
  const {
    currentSpace,
    spaces,
    switchSpace,
    partner,
    themeMode,
    toggleTheme,
    setIsSearchOpen,
  } = useSpace();

  const [isSpaceMenuOpen, setIsSpaceMenuOpen] = useState(false);
  const [showPartnerStatus, setShowPartnerStatus] = useState(false);

  const NAV_LINKS: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'daily', label: 'Daily', icon: Sparkles },
    { key: 'studio', label: 'Studio', icon: Palette },
    { key: 'media', label: 'Media Lounge', icon: Film },
    { key: 'vault', label: 'Universal Vault', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FEF7FF]/90 dark:bg-[#141218]/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left Zone: Brand Wordmark + Space Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              haptics.selection();
              onTabChange('daily');
            }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6750A4] to-[#D0BCFF] flex items-center justify-center text-white shadow-sm font-black text-sm">
              🪐
            </div>
            <div className="hidden xs:block">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-[#6750A4] dark:group-hover:text-[#D0BCFF] transition-colors">
                Orbit
              </span>
            </div>
          </button>

          {/* Space Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                haptics.selection();
                setIsSpaceMenuOpen(!isSpaceMenuOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] transition-colors text-left"
              aria-label="Switch Space"
            >
              <span className="text-sm leading-none">{currentSpace.emoji}</span>
              <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100 max-w-[90px] sm:max-w-[120px] truncate">
                {currentSpace.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            </button>

            {isSpaceMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSpaceMenuOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-[#211F26] shadow-xl border border-black/[0.08] dark:border-white/[0.1] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    Your micro-spaces
                  </div>
                  <div className="space-y-1">
                    {spaces.map((space) => {
                      const isActive = space.id === currentSpace.id;
                      return (
                        <button
                          key={space.id}
                          onClick={() => {
                            switchSpace(space.id);
                            setIsSpaceMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors text-left ${
                            isActive
                              ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF]'
                              : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{space.emoji}</span>
                            <div>
                              <div className="text-sm font-semibold leading-tight">{space.name}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                <Users className="w-3 h-3" />
                                <span>{space.members.length} members</span>
                                {space.anniversaryOrDate && (
                                  <>
                                    <span>·</span>
                                    <span>{space.anniversaryOrDate}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center Zone: Desktop Navigation Links (hidden on mobile, uses bottom tab bar) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeTab === link.key;
            const Icon = link.icon;
            return (
              <button
                key={link.key}
                onClick={() => {
                  haptics.selection();
                  onTabChange(link.key);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Partner Presence Bubble + Search + Dark Mode */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Partner Avatar with Live Activity Badge */}
          <div className="relative">
            <button
              onClick={() => {
                haptics.light();
                setShowPartnerStatus(!showPartnerStatus);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-all border border-black/[0.05] dark:border-white/[0.08]"
            >
              <div className="relative">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-2 ring-[#EC4899]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-[#141218]" />
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
                {partner.name}
              </span>
            </button>

            {/* Status Popover */}
            {showPartnerStatus && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowPartnerStatus(false)} />
                <div className="absolute right-0 mt-2 w-64 p-3.5 rounded-2xl bg-white dark:bg-[#211F26] shadow-xl border border-black/[0.08] dark:border-white/[0.1] z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <img src={partner.avatar} alt={partner.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{partner.name}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Online now · Connected</div>
                    </div>
                  </div>
                  <div className="text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    "{partner.status}"
                  </div>
                  {partner.currentActivity && (
                    <div className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
                      <span className="truncate">{partner.currentActivity}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => {
              haptics.selection();
              setIsSearchOpen(true);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
