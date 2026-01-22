'use client';

import { MouseEventHandler } from 'react';

interface SellButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function SellButton({ onClick }: SellButtonProps) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
            Sell Position
        </button>
    );
}
