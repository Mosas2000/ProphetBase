interface ProgressBarProps {
    value: number; // 0 to 100
    max?: number;
    color?: string; // Tailwind color class e.g. 'bg-blue-600'
    height?: string; // height class
    className?: string;
}

export default function ProgressBar({
    value,
    max = 100,
    color = 'bg-blue-600',
    height = 'h-2.5',
    className = ''
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={`w-full bg-gray-200 rounded-full dark:bg-gray-700 ${height} ${className}`}>
            <div
                className={`${color} ${height} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
