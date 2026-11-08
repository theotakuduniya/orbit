/**
 * Orbit: All-in-One Collaborative Micro-Hub for Couples & Close Groups
 * Responsive mobile-first website with Material Design 3 tokens, gestures, and tactile feedback
 */
import React, { useState } from 'react';
import { SpaceProvider } from './context/SpaceContext';
import { PlayerProvider } from './context/PlayerContext';
import { OrbitHeader } from './components/common/OrbitHeader';
import { PersistentMiniPlayer } from './components/common/PersistentMiniPlayer';
import { QuickActionFAB } from './components/common/QuickActionFAB';
import { SearchModal } from './components/common/SearchModal';
import { BottomTabNavigator, TabKey } from './navigation/BottomTabNavigator';
import { StudioScreen } from './screens/StudioScreen';
import { MediaScreen } from './screens/MediaScreen';
import { VaultScreen } from './screens/VaultScreen';
import { DailyScreen } from './screens/DailyScreen';
import { useGestureNavigation } from './hooks/useGestureNavigation';

const OrbitAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('daily');

  // Passive touch gesture layer for fluid horizontal tab switching on mobile
  useGestureNavigation({
    activeTab,
    onTabChange: setActiveTab,
  });

  const handleQuickAction = (action: 'snap' | 'pin' | 'meme' | 'mood') => {
    if (action === 'snap' || action === 'mood') {
      setActiveTab('daily');
    } else if (action === 'pin') {
      setActiveTab('studio');
    } else if (action === 'meme') {
      setActiveTab('media');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FEF7FF] dark:bg-[#141218] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation Bar with Space Switcher & Desktop Navigation */}
      <OrbitHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area - Expands naturally on tablet/desktop, mobile-first on small screens */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-24 sm:pb-28 md:pb-8 flex flex-col">
        {activeTab === 'daily' && <DailyScreen />}
        {activeTab === 'studio' && <StudioScreen />}
        {activeTab === 'media' && <MediaScreen />}
        {activeTab === 'vault' && <VaultScreen />}
      </main>

      {/* Floating Now-Playing Mini Player Dock */}
      <PersistentMiniPlayer />

      {/* Speed dial FAB for rapid actions */}
      <QuickActionFAB onSelectAction={handleQuickAction} />

      {/* Mobile-Only Bottom Navigation Bar (Hidden on desktop md:) */}
      <BottomTabNavigator activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Global Search Modal */}
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <SpaceProvider>
      <PlayerProvider>
        <OrbitAppContent />
      </PlayerProvider>
    </SpaceProvider>
  );
}
