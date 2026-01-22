'use client';

import IconButton from '@/components/ui/IconButton';
import { ShareIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
    onClick: () => void;
}

export default function ShareButton({ onClick }: ShareButtonProps) {
    return (
        <IconButton
            onClick={(e) => {
                e.preventDefault(); // Prevent link event if in a card
                onClick();
            }}
            label="Share Market"
            className="hover:text-blue-600 dark:hover:text-blue-500"
        >
            <ShareIcon className="w-5 h-5" />
        </IconButton>
    );
}
