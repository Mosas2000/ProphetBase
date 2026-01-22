import { ReactNode } from 'react';

interface MarketCardFooterProps {
    children: ReactNode;
}

export default function MarketCardFooter({ children }: MarketCardFooterProps) {
    return (
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 rounded-b-xl flex justify-between items-center group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
            {children}
        </div>
    );
}
