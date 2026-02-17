import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ChatContextType, ChatContextInfo } from '../backend';

export function useChatMembership() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const myContextsQuery = useQuery<Array<[ChatContextType, ChatContextInfo]>>({
    queryKey: ['myChatContexts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyChatContexts();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });

  const joinMutation = useMutation({
    mutationFn: async (contextType: ChatContextType) => {
      if (!actor) throw new Error('Actor not available');
      await actor.joinChatContext(contextType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myChatContexts'] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async (contextType: ChatContextType) => {
      if (!actor) throw new Error('Actor not available');
      await actor.leaveChatContext(contextType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myChatContexts'] });
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });

  return {
    myContextsQuery,
    joinMutation,
    leaveMutation,
  };
}
