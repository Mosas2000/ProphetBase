import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variantClasses = {
        default: 'badge',
        blue: 'badge-blue',
        green: 'badge-green',
        red: 'badge-red',
        yellow: 'badge-yellow',
        purple: 'badge-purple',
        gray: 'badge-gray',
    };

    return (
        <span className={`${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
}
