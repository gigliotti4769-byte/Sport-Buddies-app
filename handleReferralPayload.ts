import { getSnapshot, updateUserStore, addCoins, ensureReferralCode } from '@/stores/userStore';
import { showToast } from '@/lib/showToast';

/**
 * Parse and extract referral code from various payload formats:
 * 1. URL with ?ref=CODE
 * 2. Raw code: CODE
 * 3. JSON: {"ref":"CODE"} or {"token":"CODE"}
 */
function extractCode(payload: string): string | null {
  const trimmed = payload.trim();
  
  // Try URL format
  try {
    const url = new URL(trimmed);
    const refParam = url.searchParams.get('ref');
    if (refParam) {
      return refParam;
    }
  } catch {
    // Not a valid URL, continue
  }
  
  // Try JSON format
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'object' && parsed !== null) {
      if (parsed.ref) return String(parsed.ref);
      if (parsed.token) return String(parsed.token);
    }
  } catch {
    // Not valid JSON, continue
  }
  
  // Treat as raw code
  return trimmed;
}

/**
 * Sanitize and validate code:
 * - Trim whitespace
 * - Uppercase
 * - Allow only A-Z and 0-9
 * - Length 4-24
 */
function sanitizeAndValidate(code: string): string | null {
  const sanitized = code.trim().toUpperCase();
  
  // Check length
  if (sanitized.length < 4 || sanitized.length > 24) {
    return null;
  }
  
  // Check characters (A-Z, 0-9 only)
  if (!/^[A-Z0-9]+$/.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}

export interface HandleReferralPayloadOptions {
  onSuccess?: () => void;
}

/**
 * Shared handler for referral payload processing
 * Handles all supported formats, validation, and local-only join effects
 */
export function handleReferralPayload(
  payload: string,
  options?: HandleReferralPayloadOptions
): void {
  const state = getSnapshot();
  
  // Extract code from payload
  const extractedCode = extractCode(payload);
  if (!extractedCode) {
    showToast('Invalid code');
    return;
  }
  
  // Sanitize and validate
  const validCode = sanitizeAndValidate(extractedCode);
  if (!validCode) {
    showToast('Invalid code');
    return;
  }
  
  // Update last scanned info
  updateUserStore({
    lastScannedRefCode: validCode,
    lastScannedAt: Date.now(),
  });
  
  // Show acceptance toast
  showToast(`Code accepted: ${validCode}`);
  
  // Check if user is trying to use their own code
  const userReferralCode = ensureReferralCode();
  if (validCode === userReferralCode) {
    showToast("You can't use your own code");
    return;
  }
  
  // Check if already joined
  if (state.joinedViaRefCode !== null) {
    showToast('Already joined');
    return;
  }
  
  // Apply local-only join effect
  // Set joinedViaRefCode and award +25 coins (only once)
  updateUserStore({
    joinedViaRefCode: validCode,
  });
  addCoins(25);
  
  // Call success callback if provided
  if (options?.onSuccess) {
    options.onSuccess();
  }
}
