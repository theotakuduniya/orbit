/**
 * BottomTabNavigator: Adaptive Material Design 3 Bottom Navigation Bar
 * 4 Primary Destinations: Studio | Media | Vault | Daily
 */
import React from 'react';
import { Palette, Film, Bookmark, Sparkles } from 'lucide-react';
import { haptics } from '../utils/haptics';

export type TabKey = 'studio' | 'media' | 'vault' | 'daily';

interface BottomTabNavigatorProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'studio', label: 'Studio', icon: Palette },
  { key: 'media', label: 'Media', icon: Film },
  { key: 'vault', label: 'Vault', icon: Bookmark },
  { key: 'daily', label: 'Daily', icon: Sparkles },
];

export const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="md:hidden sticky bottom-0 z-30 bg-[#FEF7FF]/95 dark:bg-[#141218]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] px-2 py-1.5 transition-colors">
      <div className="grid grid-cols-4 items-center max-w-lg mx-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => {
                haptics.selection();
                onTabChange(tab.key);
              }}
              className="flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform"
            >
              {/* Active Pill Pill Indicator */}
              <div
                className={`flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>

              {/* Caption */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                  isActive
                    ? 'font-bold text-slate-950 dark:text-white'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
