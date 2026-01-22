import toast from 'react-hot-toast'

/**
 * Toast utility functions for ProphetBase
 * Provides consistent toast notifications across the app
 */

/**
 * Show a success toast notification
 */
export const showSuccess = (message: string) => {
    return toast.success(message, {
        duration: 4000,
        position: 'bottom-right',
        style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
        },
    })
}

/**
 * Show an error toast notification
 */
export const showError = (message: string) => {
    return toast.error(message, {
        duration: 5000,
        position: 'bottom-right',
        style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
        },
    })
}

/**
 * Show a loading toast notification
 */
export const showLoading = (message: string) => {
    return toast.loading(message, {
        position: 'bottom-right',
        style: {
            background: '#3b82f6',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px',
        },
    })
}

/**
 * Show an info toast notification
 */
export const showInfo = (message: string) => {
    return toast(message, {
        duration: 4000,
        position: 'bottom-right',
        icon: 'ℹ️',
        style: {
            background: '#6366f1',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px',
        },
    })
}

/**
 * Show a promise toast with loading, success, and error states
 */
export const showPromise = <T,>(
    promise: Promise<T>,
    messages: {
        loading: string
        success: string
        error: string
    }
) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        {
            position: 'bottom-right',
            style: {
                fontWeight: '600',
                borderRadius: '12px',
                padding: '16px',
            },
            success: {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: '#fff',
                },
            },
            error: {
                duration: 5000,
                style: {
                    background: '#ef4444',
                    color: '#fff',
                },
            },
            loading: {
                style: {
                    background: '#3b82f6',
                    color: '#fff',
                },
            },
        }
    )
}

/**
 * Dismiss a specific toast by ID
 */
export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId)
}

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
    toast.dismiss()
}
