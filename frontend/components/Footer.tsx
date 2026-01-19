'use client'

/**
 * Footer Component - Reusable footer for ProphetBase
 */
export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    {/* Left side - Branding */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🔮</span>
                            <span className="text-sm font-semibold text-gray-900">ProphetBase</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            © 2026 ProphetBase
                        </p>
                        <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1">
                            <svg className="h-4 w-4 text-blue-600" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF" />
                            </svg>
                            <span className="text-xs font-medium text-blue-700">Built on Base</span>
                        </div>
                    </div>

                    {/* Right side - Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <a
                            href="https://basescan.org/address/0x27177c0edc143CA33119fafD907e8600deF5Ba74"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                            aria-label="View contract on Basescan"
                        >
                            Contract
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                        <a
                            href="https://docs.base.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Docs
                        </a>
                        <a
                            href="https://github.com/Mosas2000/ProphetBase"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                            aria-label="View source on GitHub"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                            aria-label="Follow on Twitter"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            Twitter
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
