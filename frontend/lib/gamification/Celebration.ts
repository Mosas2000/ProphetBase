/**
 * Celebration - Mobile celebration animations and feedback for gamification
 * Features:
 * - Trigger confetti animation
 * - Badge pop animation
 * - Haptic feedback on achievement
 */

export class Celebration {
  static confetti() {
    // Simple confetti using canvas-confetti (if available)
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }

  static badgePop(elementId: string) {
    const el = document.getElementById(elementId);
    if (el) {
      el.classList.add('animate-bounce');
      setTimeout(() => el.classList.remove('animate-bounce'), 1000);
    }
  }

  static haptic() {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
  }

  static celebrateAchievement(elementId?: string) {
    Celebration.confetti();
    if (elementId) Celebration.badgePop(elementId);
    Celebration.haptic();
  }
}
