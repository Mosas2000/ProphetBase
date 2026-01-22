import { ReactNode } from 'react';

interface CardBodyProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export default function CardBody({ children, className = '', noPadding = false }: CardBodyProps) {
    return (
        <div className={`${noPadding ? '' : 'p-4'} ${className}`}>
            {children}
        </div>
    );
}
