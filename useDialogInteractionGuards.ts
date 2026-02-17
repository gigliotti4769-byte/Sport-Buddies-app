import { useRef, useCallback } from 'react';

interface UseDialogInteractionGuardsOptions {
  /**
   * Whether the form has unsaved changes
   */
  isDirty: boolean;
  /**
   * Container ref to check if interactions are inside the form
   */
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Hook to prevent dialog close during form interaction
 * Blocks outside-click and escape-key close when form is dirty or focused
 */
export function useDialogInteractionGuards({ isDirty, containerRef }: UseDialogInteractionGuardsOptions) {
  const focusedRef = useRef(false);

  // Track focus state within the container
  const handleFocusIn = useCallback(() => {
    focusedRef.current = true;
  }, []);

  const handleFocusOut = useCallback((e: React.FocusEvent) => {
    // Only mark as unfocused if focus is leaving the container entirely
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      focusedRef.current = false;
    }
  }, [containerRef]);

  /**
   * Handler for Radix Dialog onInteractOutside
   * Prevents close when clicking inside the form or when form is dirty/focused
   */
  const handleInteractOutside = useCallback((e: Event) => {
    // Always prevent if form is dirty or any input is focused
    if (isDirty || focusedRef.current) {
      e.preventDefault();
      return;
    }

    // Check if the interaction target is inside our container
    if (containerRef.current && e.target instanceof Node) {
      if (containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    }
  }, [isDirty, containerRef]);

  /**
   * Handler for Radix Dialog onPointerDownOutside
   * Prevents close when clicking inside the form or when form is dirty/focused
   */
  const handlePointerDownOutside = useCallback((e: Event) => {
    // Always prevent if form is dirty or any input is focused
    if (isDirty || focusedRef.current) {
      e.preventDefault();
      return;
    }

    // Check if the pointer down target is inside our container
    if (containerRef.current && e.target instanceof Node) {
      if (containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    }
  }, [isDirty, containerRef]);

  /**
   * Handler for Radix Dialog onEscapeKeyDown
   * Prevents close when any input/textarea is focused
   */
  const handleEscapeKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if an input or textarea is currently focused
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement
    ) {
      e.preventDefault();
    }
  }, []);

  return {
    handleFocusIn,
    handleFocusOut,
    handleInteractOutside,
    handlePointerDownOutside,
    handleEscapeKeyDown,
  };
}
