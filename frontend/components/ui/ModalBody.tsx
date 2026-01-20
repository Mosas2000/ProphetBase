import { ReactNode } from 'react';

interface ModalBodyProps {
    children: ReactNode;
    className?: string;
}

export default function ModalBody({ children, className = '' }: ModalBodyProps) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}
