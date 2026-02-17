import { useRef, useCallback } from 'react';

export interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
}

export interface UseLongPressHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
}

/**
 * Hook to detect long-press interactions (~1000ms) across pointer/touch/mouse,
 * with cancellation on pointer up/move/leave and suppression of click after long-press.
 */
export function useLongPress({
  onLongPress,
  onClick,
  delay = 1000,
}: UseLongPressOptions): UseLongPressHandlers {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggeredRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      longPressTriggeredRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };

      clear();
      timeoutRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        onLongPress();
      }, delay);
    },
    [onLongPress, delay, clear]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      clear();
      
      // Only trigger click if long-press was not triggered
      if (!longPressTriggeredRef.current && onClick) {
        onClick();
      }
      
      startPosRef.current = null;
    },
    [onClick, clear]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Cancel if pointer moves too far (more than 10px)
      if (startPosRef.current) {
        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) {
          clear();
          startPosRef.current = null;
        }
      }
    },
    [clear]
  );

  const onPointerLeave = useCallback(() => {
    clear();
    startPosRef.current = null;
  }, [clear]);

  return {
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerLeave,
  };
}
