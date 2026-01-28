/**
 * SocialShare - Gamification: social sharing and bragging features
 * Features:
 * - Generate shareable achievement images and links
 * - Integrate with native share APIs (Web Share API)
 */

export class SocialShare {
  static async shareAchievement({ title, description, url, image }: {
    title: string;
    description: string;
    url: string;
    image?: string;
  }) {
    if (navigator.share) {
      await navigator.share({
        title,
        text: description,
        url,
      });
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  }

  static generateShareImage(achievement: {
    name: string;
    description: string;
    icon: string;
  }): string {
    // Placeholder: return a data URL or image path
    // In production, use canvas or a service to generate images
    return `/images/achievements/${achievement.name.replace(/\s+/g, '_').toLowerCase()}.png`;
  }
}
