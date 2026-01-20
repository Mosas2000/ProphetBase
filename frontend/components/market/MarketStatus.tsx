import Badge from '@/components/ui/Badge';

interface MarketStatusProps {
    status: number; // 0: Open, 1: Resolved, 2: Cancelled
}

export default function MarketStatus({ status }: MarketStatusProps) {
    if (status === 1) return <Badge variant="purple">Resolved</Badge>;
    if (status === 2) return <Badge variant="red">Cancelled</Badge>;

    return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs font-semibold text-green-700 dark:text-green-400">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Active
        </span>
    );
}
