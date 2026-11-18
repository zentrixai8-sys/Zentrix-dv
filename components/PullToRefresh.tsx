import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
  isLight?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  isLight = false
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const THRESHOLD = 70;
  const MAX_PULL = 110;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only initiate pull when scroll position is at the very top
      if (window.scrollY <= 2) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || refreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && window.scrollY <= 2) {
        // Apply resistance curve
        const pull = Math.min(diff * 0.42, MAX_PULL);
        setPullDistance(pull);
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (pullDistance >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        setPullDistance(THRESHOLD * 0.85);

        try {
          if (onRefresh) {
            await onRefresh();
          } else {
            // Default global fallback: reload current page
            await new Promise((r) => setTimeout(r, 600));
            window.location.reload();
          }
        } catch (_) {
        } finally {
          setTimeout(() => {
            setRefreshing(false);
            setPullDistance(0);
          }, 400);
        }
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, refreshing, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div className="relative w-full">
      {/* Pull-To-Refresh Top Indicator Bubble */}
      <div
        className="fixed top-2 inset-x-0 z-50 flex items-center justify-center pointer-events-none transition-transform duration-200"
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 20)}px)`,
          opacity: pullDistance > 10 || refreshing ? 1 : 0
        }}
      >
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-2xl border backdrop-blur-md transition-all ${
            isLight
              ? 'bg-white/95 border-[#EDE2D3] text-[#2A2118]'
              : 'bg-[#0E1526]/95 border-white/15 text-white'
          }`}
        >
          {refreshing ? (
            <>
              <Loader2 className={`w-4 h-4 animate-spin ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
              <span className="text-[11px] font-mono font-bold tracking-wider">Refreshing...</span>
            </>
          ) : (
            <>
              <ArrowDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  pullDistance >= THRESHOLD ? 'rotate-180 text-emerald-500' : isLight ? 'text-[#EA552E]' : 'text-cyan-400'
                }`}
              />
              <span className="text-[11px] font-mono font-bold tracking-wider">
                {pullDistance >= THRESHOLD ? 'Release to Refresh' : 'Pull down to refresh'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Page Content with gentle translateY during pull */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance * 0.3}px)` : 'none',
          transition: isPulling.current ? 'none' : 'transform 0.25s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
