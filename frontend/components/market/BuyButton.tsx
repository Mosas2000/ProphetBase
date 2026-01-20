'use client';

import { MouseEventHandler } from 'react';

interface BuyButtonProps {
    isYes: boolean;
    percent: number;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function BuyButton({ isYes, percent, onClick }: BuyButtonProps) {
    const baseClass = isYes
        ? 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-none'
        : 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none';

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className={`
                ${baseClass}
                flex-1 min-w-[80px] py-2 px-3 rounded-lg text-white text-sm font-semibold 
                shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0
            `}
        >
            Buy {isYes ? 'YES' : 'NO'} {percent}¢
        </button>
    );
}
