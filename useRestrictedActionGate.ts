import { useNavigate } from '@tanstack/react-router';
import { useAppState } from '@/context/AppStateContext';
import { useProfileGate } from '@/hooks/useProfileGate';
import { buildAuthPath } from '@/lib/authReturnTo';
import { setPendingNav, clearPendingNav, type PendingNav } from '@/lib/pendingNavStore';

interface GateActionOptions {
  route?: string;
  params?: Record<string, string>;
}

/**
 * Hook for gating restricted actions behind authentication and profile completion.
 * Stores pending navigation intent when redirecting through Profile Gate.
 */
export function useRestrictedActionGate() {
  const navigate = useNavigate();
  const { limitedMode, profileStatus } = useAppState();
  const { openProfileGate } = useProfileGate();

  /**
   * Execute an action with authentication and profile completion gates.
   * If user needs to complete profile, stores the pending navigation intent.
   * 
   * @param action - The action to execute if gates pass
   * @param options - Optional pending navigation to store if profile gate opens
   */
  const gateAction = (action: () => void, options?: GateActionOptions) => {
    // Check limited mode (unauthenticated)
    if (limitedMode) {
      const authPath = buildAuthPath(window.location.pathname);
      navigate({ to: authPath as any });
      return;
    }

    // Check profile completion
    if (profileStatus !== 'complete') {
      // Store pending navigation if provided
      if (options?.route) {
        const pending: PendingNav = {
          route: options.route,
          params: options.params,
        };
        setPendingNav(pending);
      }
      
      // Open profile gate
      openProfileGate();
      return;
    }

    // Clear any stale pending nav when action executes successfully
    clearPendingNav();
    
    // Execute the action
    action();
  };

  return { gateAction };
}
