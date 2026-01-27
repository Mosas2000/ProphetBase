'use client';

import { Eye, Focus, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ARIA live region types
type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

// Live region announcer
export class LiveRegionAnnouncer {
  private liveRegion: HTMLDivElement | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      this.createLiveRegion();
    }
  }

  private createLiveRegion(): void {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    `;
    document.body.appendChild(this.liveRegion);
  }

  announce(message: string, politeness: LiveRegionPoliteness = 'polite'): void {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', politeness);

    // Clear and set with slight delay for screen reader to pick up
    this.liveRegion.textContent = '';
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
      }
    }, 100);
  }

  clear(): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
    }
  }
}

// Screen reader only text component
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
      {children}
    </span>
  );
}

// Skip links component
export function SkipLinks() {
  const links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ];

  return (
    <div className="skip-links">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

// Focus management hook
export function useFocusManagement(enabled: boolean = true) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const trapFocus = (event: KeyboardEvent) => {
    if (!enabled || !containerRef.current) return;

    const focusableElements =
      containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  const lockFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const firstFocusable = containerRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  };

  const restoreFocus = () => {
    previousFocusRef.current?.focus();
  };

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', trapFocus);
      return () => document.removeEventListener('keydown', trapFocus);
    }
  }, [enabled]);

  return {
    containerRef,
    lockFocus,
    restoreFocus,
  };
}

// ARIA label generator
export function generateAriaLabel(
  element: string,
  context?: Record<string, any>
): string {
  const labels: Record<string, string> = {
    closeButton: 'Close',
    menuButton: 'Open menu',
    searchButton: 'Search',
    nextButton: 'Next',
    previousButton: 'Previous',
    submitButton: 'Submit form',
    cancelButton: 'Cancel',
  };

  let label = labels[element] || element;

  if (context) {
    Object.entries(context).forEach(([key, value]) => {
      label = label.replace(`{${key}}`, String(value));
    });
  }

  return label;
}

// Semantic HTML wrapper
export function SemanticSection({
  as = 'section',
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
}: {
  as?: 'section' | 'article' | 'aside' | 'nav' | 'main' | 'header' | 'footer';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const Component = as;

  return (
    <Component
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
    >
      {children}
    </Component>
  );
}

// Accessible button component
export function AccessibleButton({
  children,
  onClick,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      disabled={disabled}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}

// Live region hook
export function useLiveRegion() {
  const announcerRef = useRef<LiveRegionAnnouncer | null>(null);

  useEffect(() => {
    announcerRef.current = new LiveRegionAnnouncer();
    return () => {
      announcerRef.current?.clear();
    };
  }, []);

  const announce = (message: string, politeness?: LiveRegionPoliteness) => {
    announcerRef.current?.announce(message, politeness);
  };

  return { announce };
}

// Accessible form field
export function AccessibleFormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required,
  ariaDescribedBy,
  className,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  ariaDescribedBy?: string;
  className?: string;
}) {
  const errorId = `${id}-error`;
  const describedBy = [ariaDescribedBy, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <label htmlFor={id} className="block mb-2 font-medium">
        {label}
        {required && <span aria-label="required"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {error && (
        <div id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

// Screen reader support dashboard
export function ScreenReaderDashboard() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const { announce } = useLiveRegion();

  const makeAnnouncement = (message: string) => {
    announce(message);
    setAnnouncements((prev) => [...prev, message]);
  };

  return (
    <div
      className="p-6 bg-slate-800 rounded-xl"
      role="region"
      aria-label="Screen Reader Support"
    >
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">Screen Reader Support</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-green-400" />
            <h3 className="font-bold">ARIA Labels</h3>
          </div>
          <p className="text-sm text-slate-300">
            All interactive elements include proper ARIA labels for screen
            readers
          </p>
        </div>

        <div className="p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Focus className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">Focus Management</h3>
          </div>
          <p className="text-sm text-slate-300">
            Proper focus handling for modals, dropdowns, and navigation
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold">Live Announcements</h3>
        <button
          onClick={() => makeAnnouncement('Test announcement')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          aria-label="Make test announcement"
        >
          Test Live Region
        </button>

        {announcements.length > 0 && (
          <div className="mt-4 p-4 bg-slate-700 rounded">
            <h4 className="font-medium mb-2">Recent Announcements:</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              {announcements.slice(-5).map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Export singleton
export const liveAnnouncer =
  typeof window !== 'undefined' ? new LiveRegionAnnouncer() : null;
