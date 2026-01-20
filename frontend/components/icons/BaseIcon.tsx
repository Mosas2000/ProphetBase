interface BaseIconProps {
    className?: string;
}

export default function BaseIcon({ className = 'w-6 h-6' }: BaseIconProps) {
    return (
        <svg
            viewBox="0 0 1000 1000"
            fill="#0052FF"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M500 1000c276.142 0 500-223.858 500-500S776.142 0 500 0 0 223.858 0 500s223.858 500 500 500z" />
            <path fill="#FFF" d="M375 750V250h250v500H375z" />
        </svg>
    );
}
