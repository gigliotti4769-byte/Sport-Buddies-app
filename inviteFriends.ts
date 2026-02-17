import { ensureReferralCode, incrementInvitesSent } from '@/stores/userStore';
import { toast } from 'sonner';

/**
 * Unified Invite Friends handler
 * - Ensures stable referralCode exists
 * - Uses Web Share API when available
 * - Falls back to clipboard copy with toast
 * - Increments invitesSentCount on each invocation
 */
export async function inviteFriends(): Promise<void> {
  // Ensure referral code exists
  const referralCode = ensureReferralCode();

  // Build share payload
  const origin = window.location.origin;
  const shareUrl = `${origin}/?ref=${referralCode}`;
  const shareTitle = 'Sport Buddies';
  const shareText = `Join me on Sport Buddies. Use my code: ${referralCode}`;

  // Increment invite count
  incrementInvitesSent();

  // Try Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return;
    } catch (error: any) {
      // User cancelled or share failed
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      // Fall through to clipboard fallback
    }
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Invite link copied');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    toast.error('Failed to copy invite link');
  }
}
