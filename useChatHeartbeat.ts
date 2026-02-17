import { useEffect, useRef } from 'react';
import { useActor } from './useActor';
import type { ChatContextType } from '../backend';

const HEARTBEAT_INTERVAL = 60000; // 1 minute

export function useChatHeartbeat(
  contextType: ChatContextType | null,
  onError?: (error: any) => void
) {
  const { actor } = useActor();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendHeartbeat = async () => {
    // Defensive guard: do nothing if prerequisites missing
    if (!actor || !contextType) return;

    try {
      await actor.updateChatActivity(contextType);
    } catch (error: any) {
      // If unauthorized (timed out), notify parent
      if (error.message?.includes('Unauthorized') || error.message?.includes('not a member')) {
        onError?.(error);
      }
    }
  };

  useEffect(() => {
    // Defensive guard: clear interval if context is null
    if (!contextType || !actor) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Send initial heartbeat
    sendHeartbeat();

    // Set up periodic heartbeat
    intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Send heartbeat on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [contextType, actor]);
}
