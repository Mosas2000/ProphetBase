import { ReactNode } from 'react';
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
    children: ReactNode;
    variant?: AlertVariant;
    title?: string;
    className?: string;
}

export default function Alert({ children, variant = 'info', title, className = '' }: AlertProps) {
    const styles = {
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/10',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-200',
            icon: InformationCircleIcon,
            iconColor: 'text-blue-500',
        },
        success: {
            bg: 'bg-green-50 dark:bg-green-900/10',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-800 dark:text-green-200',
            icon: CheckCircleIcon,
            iconColor: 'text-green-500',
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/10',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-800 dark:text-yellow-200',
            icon: ExclamationTriangleIcon,
            iconColor: 'text-yellow-500',
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/10',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: XCircleIcon,
            iconColor: 'text-red-500',
        },
    };

    const style = styles[variant];
    const Icon = style.icon;

    return (
        <div className={`p-4 rounded-lg border flex gap-3 ${style.bg} ${style.border} ${className}`}>
            <Icon className={`h-5 w-5 flex-shrink-0 ${style.iconColor}`} />
            <div className={`${style.text}`}>
                {title && <h4 className="font-semibold mb-1">{title}</h4>}
                <div className="text-sm">{children}</div>
            </div>
        </div>
    );
}
