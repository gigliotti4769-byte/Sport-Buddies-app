import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ChatContextType } from '../backend';

function serializeContextForKey(contextType: ChatContextType | null): string | null {
  if (!contextType) return null;
  if (contextType.__kind__ === 'spot') {
    return `spot:${contextType.spot}`;
  } else {
    return `event:${contextType.event.toString()}`;
  }
}

export function useSendChatMessage(contextType: ChatContextType | null, onNonMember?: () => void) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      // Defensive guard: fail gracefully if prerequisites missing
      if (!actor || !contextType) {
        throw new Error('Chat is not available');
      }
      
      const trimmedContent = content.trim();
      if (!trimmedContent) {
        throw new Error('Message cannot be empty');
      }

      try {
        await actor.sendMessage(contextType, trimmedContent);
      } catch (error: any) {
        // If unauthorized (non-member due to timeout), signal to clear chat
        if (error.message?.includes('Unauthorized') || error.message?.includes('not a member')) {
          onNonMember?.();
          throw new Error('You are no longer a member of this chat');
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Defensive guard: only invalidate if context exists
      if (contextType) {
        queryClient.invalidateQueries({ queryKey: ['chatMessages', serializeContextForKey(contextType)] });
      }
    },
  });
}
