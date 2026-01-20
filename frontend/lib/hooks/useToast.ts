import toast from 'react-hot-toast';

/**
 * Hook to show toast notifications with consistent styling
 * @returns Toast helper functions
 */
export function useToast() {
    const success = (message: string) => {
        toast.success(message);
    };

    const error = (message: string) => {
        toast.error(message);
    };

    const loading = (message: string) => {
        return toast.loading(message);
    };

    const dismiss = (toastId?: string) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    };

    const promise = <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(promise, messages);
    };

    return {
        success,
        error,
        loading,
        dismiss,
        promise,
    };
}
