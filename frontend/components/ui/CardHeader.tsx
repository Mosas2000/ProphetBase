import { ReactNode } from 'react';

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export default function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 ${className}`}>
            {children}
        </div>
    );
}
