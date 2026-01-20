'use client';

import Select from '@/components/ui/Select';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { forwardRef } from 'react';

interface FilterDropdownProps extends React.ComponentProps<typeof Select> { }

const FilterDropdown = forwardRef<HTMLSelectElement, FilterDropdownProps>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <div className="relative min-w-[150px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FunnelIcon className="h-4 w-4 text-gray-500" />
                </div>
                <Select
                    ref={ref}
                    className={`pl-9 ${className}`}
                    {...props}
                >
                    {children}
                </Select>
            </div>
        );
    }
);

FilterDropdown.displayName = 'FilterDropdown';
export default FilterDropdown;
