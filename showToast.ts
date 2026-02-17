import { toast } from 'sonner';

/**
 * Standardized toast helper for user-facing messages
 */
export function showToast(message: string) {
  toast(message);
}
