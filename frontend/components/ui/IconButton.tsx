import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode; // Ideally an SVG or Icon component
    label?: string; // Accessible label
}

export default function IconButton({ children, label, className = '', ...props }: IconButtonProps) {
    return (
        <button
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${className}`}
            aria-label={label}
            {...props}
        >
            {children}
        </button>
    );
}
