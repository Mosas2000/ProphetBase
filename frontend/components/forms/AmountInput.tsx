'use client';

import Input from '@/components/ui/Input';
import { forwardRef } from 'react';

interface AmountInputProps extends React.ComponentProps<typeof Input> {
    currency?: string;
}

const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
    ({ currency = 'USDC', className = '', ...props }, ref) => {
        return (
            <div className="relative">
                <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`pr-16 text-lg font-mono ${className}`}
                    ref={ref}
                    {...props}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 font-medium">{currency}</span>
                </div>
            </div>
        );
    }
);

AmountInput.displayName = 'AmountInput';
export default AmountInput;
