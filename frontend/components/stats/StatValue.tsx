import { ReactNode } from 'react';

interface StatValueProps {
    children: ReactNode;
    className?: string;
}

export default function StatValue({ children, className = '' }: StatValueProps) {
    return (
        <div className={`text-2xl font-bold text-gray-900 dark:text-white mt-1 ${className}`}>
            {children}
        </div>
    );
}
