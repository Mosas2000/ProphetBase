import { ReactNode } from 'react';

interface FooterProps {
    children: ReactNode;
    className?: string;
}

export default function Footer({ children, className = '' }: FooterProps) {
    return (
        <footer className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto ${className}`}>
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </div>
        </footer>
    );
}
