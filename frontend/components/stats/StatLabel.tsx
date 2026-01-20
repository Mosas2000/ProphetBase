import { ReactNode } from 'react';

interface StatLabelProps {
    children: ReactNode;
    className?: string;
}

export default function StatLabel({ children, className = '' }: StatLabelProps) {
    return (
        <div className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${className}`}>
            {children}
        </div>
    );
}
