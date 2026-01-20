'use client';

import Input from '@/components/ui/Input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { forwardRef } from 'react';

interface SearchInputProps extends React.ComponentProps<typeof Input> { }

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                    type="search"
                    className={`pl-10 rounded-full ${className}`}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;
