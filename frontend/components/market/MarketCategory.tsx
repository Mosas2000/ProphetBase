import Badge from '@/components/ui/Badge';

interface MarketCategoryProps {
    category: string;
}

export default function MarketCategory({ category }: MarketCategoryProps) {
    // Map categories to colors if needed
    const variantMap: Record<string, any> = {
        'Crypto': 'blue',
        'Politics': 'red',
        'Sports': 'green',
        'Pop Culture': 'purple',
    };

    return (
        <Badge variant={variantMap[category] || 'gray'}>
            {category}
        </Badge>
    );
}
