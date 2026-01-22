import { ReactNode } from 'react';
import Card from '@/components/ui/Card';

interface StatCardProps {
    children: ReactNode;
    className?: string;
}

export default function StatCard({ children, className = '' }: StatCardProps) {
    return (
        <Card className={`p-6 flex items-start justify-between ${className}`}>
            {children}
        </Card>
    );
}
