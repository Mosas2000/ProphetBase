'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function Avatar({
    src,
    alt = 'Avatar',
    fallback = '?',
    size = 'md',
    className = ''
}: AvatarProps) {
    const [error, setError] = useState(false);

    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-xl',
    };

    if (!src || error) {
        return (
            <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300 ${className}`}>
                {fallback.substring(0, 2).toUpperCase()}
            </div>
        );
    }

    return (
        <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                onError={() => setError(true)}
            />
        </div>
    );
}
