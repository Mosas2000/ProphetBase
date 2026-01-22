import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    fullWidth?: boolean;
}

export default function SecondaryButton({ children, fullWidth = false, className = '', ...props }: SecondaryButtonProps) {
    return (
        <button
            className={`btn-secondary ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
