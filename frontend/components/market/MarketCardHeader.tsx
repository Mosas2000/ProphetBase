import { ReactNode } from 'react';

interface MarketCardHeaderProps {
    children: ReactNode;
}

export default function MarketCardHeader({ children }: MarketCardHeaderProps) {
    return (
        <div className="px-5 py-4 flex items-start justify-between gap-4">
            {children}
        </div>
    );
}
