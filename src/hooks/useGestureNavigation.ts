/**
 * useGestureNavigation: High-performance touch gesture interaction layer
 * Uses passive event listeners to enable fluid horizontal swipe navigation
 * between primary tabs without blocking compositor thread scrolling.
 */
import { useEffect, useRef } from 'react';
import { TabKey } from '../navigation/BottomTabNavigator';
import { haptics } from '../utils/haptics';

const TAB_ORDER: TabKey[] = ['daily', 'studio', 'media', 'vault'];

interface UseGestureNavigationOptions {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  enabled?: boolean;
}

export function useGestureNavigation({
  activeTab,
  onTabChange,
  enabled = true,
}: UseGestureNavigationOptions) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Passive touch start listener: capture coordinates
    const handleTouchStart = (e: TouchEvent) => {
      // Disregard multi-touch gestures (pinch-to-zoom)
      if (e.touches.length !== 1) return;

      const target = e.target as HTMLElement | null;
      // Do not intercept gestures originating on canvas, doodle area, inputs, sliders, or no-swipe elements
      if (
        target?.closest('canvas') ||
        target?.closest('.touch-none') ||
        target?.closest('[data-no-swipe]') ||
        target?.closest('input') ||
        target?.closest('textarea') ||
        target?.closest('button') ||
        target?.closest('[role="dialog"]')
      ) {
        touchStartRef.current = null;
        return;
      }

      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      touchMoveRef.current = null;
    };

    // Passive touch move listener: update current position
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchMoveRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    // Passive touch end listener: compute swipe velocity and displacement
    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchMoveRef.current) {
        touchStartRef.current = null;
        touchMoveRef.current = null;
        return;
      }

      const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
      const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Criteria for an intentional horizontal tab swipe:
      // 1. Horizontal displacement >= 60px
      // 2. Horizontal movement dominant over vertical (absX > absY * 1.5)
      // 3. Gesture completed within 550ms
      if (absX >= 60 && absX > absY * 1.5 && deltaTime <= 550) {
        const currentIndex = TAB_ORDER.indexOf(activeTab);
        if (deltaX < 0) {
          // Swipe Left -> Next Tab
          if (currentIndex < TAB_ORDER.length - 1) {
            haptics.selection();
            onTabChange(TAB_ORDER[currentIndex + 1]);
          }
        } else {
          // Swipe Right -> Previous Tab
          if (currentIndex > 0) {
            haptics.selection();
            onTabChange(TAB_ORDER[currentIndex - 1]);
          }
        }
      }

      touchStartRef.current = null;
      touchMoveRef.current = null;
    };

    // Explicitly pass { passive: true } for all touch event registrations
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [activeTab, onTabChange, enabled]);
}
