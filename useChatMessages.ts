import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ChatContextType, ChatMessage } from '../backend';

function serializeContextForKey(contextType: ChatContextType | null): string | null {
  if (!contextType) return null;
  if (contextType.__kind__ === 'spot') {
    return `spot:${contextType.spot}`;
  } else {
    return `event:${contextType.event.toString()}`;
  }
}

export function useChatMessages(contextType: ChatContextType | null, onNonMember?: () => void) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', serializeContextForKey(contextType)],
    queryFn: async () => {
      // Defensive guard: return empty if prerequisites missing
      if (!actor || !contextType) return [];
      
      try {
        return await actor.getMessages(contextType, null);
      } catch (error: any) {
        // If unauthorized (non-member), signal to clear chat
        if (error.message?.includes('Unauthorized') || error.message?.includes('not a member')) {
          onNonMember?.();
          return [];
        }
        throw error;
      }
    },
    // Defensive guard: only enable when all prerequisites exist
    enabled: !!actor && !isFetching && !!identity && !!contextType,
    refetchInterval: 5000, // Poll every 5 seconds
    retry: false,
  });
}
