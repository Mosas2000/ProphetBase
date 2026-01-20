import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', id, ...props }, ref) => {
        const inputId = id || props.name || Math.random().toString(36).substring(7);

        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={inputId}
                    ref={ref}
                    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 ${className}`}
                    {...props}
                />
                <label htmlFor={inputId} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    {label}
                </label>
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
