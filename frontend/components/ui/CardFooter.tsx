import { ReactNode } from 'react';

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export default function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 rounded-b-xl ${className}`}>
            {children}
        </div>
    );
}
