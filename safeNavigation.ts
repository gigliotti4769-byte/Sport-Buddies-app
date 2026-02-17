import { useNavigate } from '@tanstack/react-router';

/**
 * Safe navigation helpers with error handling and fallbacks
 */

export function useSafeNavigation() {
  const navigate = useNavigate();

  const safeNavigateHome = () => {
    try {
      navigate({ to: '/' });
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        window.location.href = '/';
      } catch (fallbackError) {
        console.error('Fallback navigation failed:', fallbackError);
      }
    }
  };

  const safeGoBackOrHome = () => {
    try {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigate({ to: '/' });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        window.location.href = '/';
      } catch (fallbackError) {
        console.error('Fallback navigation failed:', fallbackError);
      }
    }
  };

  return { safeNavigateHome, safeGoBackOrHome };
}

/**
 * Navigate to an arbitrary route string with error handling
 * @param navigate - TanStack Router navigate function
 * @param route - Route string to navigate to (e.g., '/map?sport=paragliding&panel=people')
 */
export function safeNavigateToRoute(navigate: ReturnType<typeof useNavigate>, route: string) {
  try {
    // Parse route into path and search params
    const url = new URL(route, window.location.origin);
    const path = url.pathname;
    const searchParams: Record<string, string> = {};
    
    url.searchParams.forEach((value, key) => {
      searchParams[key] = value;
    });

    // Navigate with parsed route
    navigate({ 
      to: path as any,
      search: searchParams as any,
    });
  } catch (error) {
    console.error('Safe navigation error:', error);
    // Fallback to direct window navigation
    try {
      window.location.href = route;
    } catch (fallbackError) {
      console.error('Fallback navigation failed:', fallbackError);
    }
  }
}
