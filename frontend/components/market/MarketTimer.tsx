import { formatDistanceToNow } from 'date-fns';
import { ClockIcon } from '@heroicons/react/24/outline';

interface MarketTimerProps {
    endTime: bigint | number;
}

export default function MarketTimer({ endTime }: MarketTimerProps) {
    const end = Number(endTime) * 1000;
    const isExpired = Date.now() > end;
    const timeLeft = isExpired ? 'Ended' : formatDistanceToNow(end, { addSuffix: true });

    return (
        <div className={`flex items-center gap-1 text-xs font-medium ${isExpired ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            <ClockIcon className="w-4 h-4" />
            <span>{isExpired ? 'Ended' : 'Ends'} {timeLeft}</span>
        </div>
    );
}
