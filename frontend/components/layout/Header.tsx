import { ReactNode } from 'react';

interface HeaderProps {
    children: ReactNode;
    className?: string;
}

export default function Header({ children, className = '' }: HeaderProps) {
    return (
        <header className={`sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {children}
            </div>
        </header>
    );
}
