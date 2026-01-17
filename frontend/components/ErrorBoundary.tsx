'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

/**
 * Props interface for ErrorBoundary component
 */
interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

/**
 * State interface for ErrorBoundary component
 */
interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

/**
 * ErrorBoundary - React error boundary component with friendly UI
 * Catches JavaScript errors anywhere in the child component tree
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
        }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
        })
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI or default error UI
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                        {/* Error Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-red-100 p-4">
                                <svg
                                    className="h-12 w-12 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Error Message */}
                        <h2 className="mb-3 text-2xl font-bold text-gray-900">
                            Something went wrong
                        </h2>
                        <p className="mb-6 text-gray-600">
                            We encountered an unexpected error. Please try again or contact support if the problem persists.
                        </p>

                        {/* Error Details (in development) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Error Details
                                </summary>
                                <div className="mt-2 rounded-lg bg-gray-50 p-3">
                                    <pre className="text-xs text-red-600 overflow-auto">
                                        {this.state.error.toString()}
                                    </pre>
                                </div>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
