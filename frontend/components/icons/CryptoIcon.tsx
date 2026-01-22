interface CryptoIconProps {
    className?: string;
}

export default function CryptoIcon({ className = 'w-6 h-6' }: CryptoIconProps) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}
