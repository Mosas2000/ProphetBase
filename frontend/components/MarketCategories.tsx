'use client'

interface Category {
    id: number
    name: string
    icon: string
    description: string
    color: string
}

const categories: Category[] = [
    { id: 0, name: 'DeFi', icon: '🏦', description: 'Decentralized Finance', color: 'blue' },
    { id: 1, name: 'Crypto', icon: '₿', description: 'Cryptocurrency Prices', color: 'orange' },
    { id: 2, name: 'Politics', icon: '🗳️', description: 'Political Events', color: 'purple' },
    { id: 3, name: 'Sports', icon: '⚽', description: 'Sports Outcomes', color: 'green' },
    { id: 4, name: 'Other', icon: '📌', description: 'Miscellaneous', color: 'gray' },
]

interface MarketCategoriesProps {
    selectedCategory?: number | null
    onSelectCategory: (categoryId: number | null) => void
    showAll?: boolean
}

export default function MarketCategories({
    selectedCategory,
    onSelectCategory,
    showAll = true,
}: MarketCategoriesProps) {
    const getColorClasses = (color: string, isSelected: boolean) => {
        const colors = {
            blue: isSelected
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300',
            orange: isSelected
                ? 'bg-orange-100 border-orange-500 text-orange-700'
                : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100 hover:border-orange-300',
            purple: isSelected
                ? 'bg-purple-100 border-purple-500 text-purple-700'
                : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300',
            green: isSelected
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300',
            gray: isSelected
                ? 'bg-gray-100 border-gray-500 text-gray-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300',
        }
        return colors[color as keyof typeof colors] || colors.gray
    }

    return (
        <div className="space-y-4">
            <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Filter by Category</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
                    {showAll && (
                        <button
                            onClick={() => onSelectCategory(null)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${selectedCategory === null
                                    ? 'border-gray-900 bg-gray-100 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <span className="text-3xl">🌐</span>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900">All</p>
                                <p className="text-xs text-gray-500">All Markets</p>
                            </div>
                        </button>
                    )}

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${getColorClasses(
                                category.color,
                                selectedCategory === category.id
                            )}`}
                        >
                            <span className="text-3xl">{category.icon}</span>
                            <div className="text-center">
                                <p className="text-sm font-semibold">{category.name}</p>
                                <p className="text-xs opacity-75">{category.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Export category badge component for use in MarketCard
export function CategoryBadge({ categoryId }: { categoryId: number }) {
    const category = categories.find((c) => c.id === categoryId) || categories[4]

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700 border-blue-200',
            orange: 'bg-orange-100 text-orange-700 border-orange-200',
            purple: 'bg-purple-100 text-purple-700 border-purple-200',
            green: 'bg-green-100 text-green-700 border-green-200',
            gray: 'bg-gray-100 text-gray-700 border-gray-200',
        }
        return colors[color as keyof typeof colors] || colors.gray
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getColorClasses(
                category.color
            )}`}
        >
            <span>{category.icon}</span>
            <span>{category.name}</span>
        </span>
    )
}

// Export helper to get category name
export function getCategoryName(categoryId: number): string {
    return categories.find((c) => c.id === categoryId)?.name || 'Other'
}
