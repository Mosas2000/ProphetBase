import { InputHTMLAttributes, forwardRef } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ label, className = '', id, ...props }, ref) => {
        const inputId = id || props.value?.toString() || Math.random().toString(36).substring(7);

        return (
            <div className="flex items-center">
                <input
                    type="radio"
                    id={inputId}
                    ref={ref}
                    className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 ${className}`}
                    {...props}
                />
                <label htmlFor={inputId} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    {label}
                </label>
            </div>
        );
    }
);

Radio.displayName = 'Radio';
export default Radio;
