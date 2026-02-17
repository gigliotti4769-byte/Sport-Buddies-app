/**
 * Reward Feedback System
 * Provides audio and visual feedback for coin rewards with restrained, premium motion
 */

// Play coin reward sound effect with calmer timing
export function playRewardSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Create a pleasant "ching" sound with smooth envelope
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1100, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.debug('Audio feedback not available');
  }
}

// Show coin fly-to-balance animation with restrained motion
export function showCoinFlyAnimation(): void {
  try {
    const coin = document.createElement('div');
    coin.innerHTML = '🪙';
    coin.style.position = 'fixed';
    coin.style.fontSize = '28px';
    coin.style.zIndex = '9999';
    coin.style.pointerEvents = 'none';
    coin.style.transition = 'all 0.8s ease-out';
    
    coin.style.left = '50%';
    coin.style.top = '50%';
    coin.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
    coin.style.opacity = '1';

    document.body.appendChild(coin);

    requestAnimationFrame(() => {
      setTimeout(() => {
        coin.style.left = '85%';
        coin.style.top = '10%';
        coin.style.transform = 'translate(-50%, -50%) scale(0.5) rotate(360deg)';
        coin.style.opacity = '0';
      }, 50);
    });

    setTimeout(() => {
      document.body.removeChild(coin);
    }, 900);
  } catch (error) {
    console.debug('Visual feedback not available');
  }
}

// Play congratulations sound for milestone achievements with calm melody
export function playCongratulationsSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Create a celebratory ascending tone with smooth transitions
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.debug('Audio feedback not available');
  }
}

// Show milestone confirmation animation with restrained visual effects
export function showMilestoneAnimation(message: string): void {
  try {
    const milestone = document.createElement('div');
    milestone.textContent = message;
    milestone.style.position = 'fixed';
    milestone.style.left = '50%';
    milestone.style.top = '40%';
    milestone.style.transform = 'translate(-50%, -50%) scale(0.9)';
    milestone.style.fontSize = '20px';
    milestone.style.fontWeight = 'bold';
    milestone.style.color = '#D4AF37';
    milestone.style.backgroundColor = 'rgba(30, 10, 20, 0.95)';
    milestone.style.padding = '18px 28px';
    milestone.style.borderRadius = '12px';
    milestone.style.zIndex = '9999';
    milestone.style.pointerEvents = 'none';
    milestone.style.transition = 'all 0.4s ease-out';
    milestone.style.opacity = '0';
    milestone.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
    milestone.style.border = '1px solid rgba(212, 175, 55, 0.3)';

    document.body.appendChild(milestone);

    requestAnimationFrame(() => {
      setTimeout(() => {
        milestone.style.transform = 'translate(-50%, -50%) scale(1)';
        milestone.style.opacity = '1';
      }, 50);
    });

    setTimeout(() => {
      milestone.style.transform = 'translate(-50%, -50%) scale(0.95)';
      milestone.style.opacity = '0';
    }, 2200);

    setTimeout(() => {
      document.body.removeChild(milestone);
    }, 2600);
  } catch (error) {
    console.debug('Visual feedback not available');
  }
}

// Show free membership unlock celebration with restrained confetti and sound
export function showFreeMembershipUnlock(): void {
  playCongratulationsSound();
  showMilestoneAnimation('🎉 Free Membership Unlocked!');
  
  try {
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉';
    celebration.style.position = 'fixed';
    celebration.style.fontSize = '48px';
    celebration.style.zIndex = '9999';
    celebration.style.pointerEvents = 'none';
    celebration.style.left = '50%';
    celebration.style.top = '30%';
    celebration.style.transform = 'translate(-50%, -50%) scale(0.8)';
    celebration.style.transition = 'all 0.5s ease-out';
    celebration.style.opacity = '0';

    document.body.appendChild(celebration);

    requestAnimationFrame(() => {
      setTimeout(() => {
        celebration.style.transform = 'translate(-50%, -50%) scale(1.2)';
        celebration.style.opacity = '1';
      }, 50);
    });

    setTimeout(() => {
      celebration.style.transform = 'translate(-50%, -50%) scale(0.9)';
      celebration.style.opacity = '0';
    }, 1800);

    setTimeout(() => {
      document.body.removeChild(celebration);
    }, 2300);
  } catch (error) {
    console.debug('Visual feedback not available');
  }
}
