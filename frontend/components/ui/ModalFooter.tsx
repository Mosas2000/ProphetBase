import { ReactNode } from 'react';

interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export default function ModalFooter({ children, className = '' }: ModalFooterProps) {
    return (
        <div className={`px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 ${className}`}>
            {children}
        </div>
    );
}
