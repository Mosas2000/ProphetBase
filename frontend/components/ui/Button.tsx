import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    fullWidth?: boolean;
}

export default function Button({ children, fullWidth = false, className = '', ...props }: ButtonProps) {
    return (
        <button
            className={`btn-primary ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
