import { ReactNode } from 'react';

interface MarketCardBodyProps {
    children: ReactNode;
    className?: string;
}

export default function MarketCardBody({ children, className = '' }: MarketCardBodyProps) {
    return (
        <div className={`px-5 pb-4 ${className}`}>
            {children}
        </div>
    );
}
