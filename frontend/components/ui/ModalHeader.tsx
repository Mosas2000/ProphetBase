import { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Assuming you have heroicons installed or an equivalent

interface ModalHeaderProps {
    children: ReactNode;
    onClose?: () => void;
    className?: string;
}

export default function ModalHeader({ children, onClose, className = '' }: ModalHeaderProps) {
    return (
        <div className={`px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center ${className}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {children}
            </h3>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
