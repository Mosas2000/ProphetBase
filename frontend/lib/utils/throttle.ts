/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param func - Function to throttle
 * @param wait - Milliseconds to wait between invocations
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
}
