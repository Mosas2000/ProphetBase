import { ReactNode } from 'react';

interface StatIconProps {
    children: ReactNode;
    color?: string; // e.g. 'bg-blue-100 text-blue-600'
}

export default function StatIcon({ children, color = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' }: StatIconProps) {
    return (
        <div className={`p-3 rounded-xl ${color}`}>
            {children}
        </div>
    );
}
