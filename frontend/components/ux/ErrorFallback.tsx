'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  type?: '404' | '500' | 'network' | 'wallet' | 'generic';
}

export function ErrorFallback({ error, resetError, type = 'generic' }: ErrorFallbackProps) {
  const getErrorContent = () => {
    switch (type) {
      case '404':
        return {
          emoji: '🔍',
          title: 'Page Not Found',
          description: 'The page you\'re looking for doesn\'t exist or has been moved.',
          suggestions: [
            'Check the URL for typos',
            'Go back to the homepage',
            'Browse our markets',
          ],
        };

      case '500':
        return {
          emoji: '⚠️',
          title: 'Server Error',
          description: 'Something went wrong on our end. We\'re working to fix it.',
          suggestions: [
            'Try refreshing the page',
            'Check our status page',
            'Contact support if the issue persists',
          ],
        };

      case 'network':
        return {
          emoji: '📡',
          title: 'Network Error',
          description: 'Unable to connect to the blockchain network.',
          suggestions: [
            'Check your internet connection',
            'Verify your wallet is connected',
            'Try switching networks',
          ],
        };

      case 'wallet':
        return {
          emoji: '👛',
          title: 'Wallet Connection Failed',
          description: 'We couldn\'t connect to your wallet.',
          suggestions: [
            'Make sure your wallet extension is installed',
            'Check if your wallet is unlocked',
            'Try connecting again',
          ],
        };

      default:
        return {
          emoji: '😕',
          title: 'Something Went Wrong',
          description: error?.message || 'An unexpected error occurred.',
          suggestions: [
            'Try refreshing the page',
            'Clear your browser cache',
            'Contact support if the problem continues',
          ],
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <Card className="max-w-2xl w-full">
        <div className="p-8 text-center">
          {/* Error Icon */}
          <div className="text-8xl mb-6 animate-bounce-slow">
            {content.emoji}
          </div>

          {/* Error Title */}
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>

          {/* Error Description */}
          <p className="text-xl text-gray-400 mb-8">{content.description}</p>

          {/* Error Details (if available) */}
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mb-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 mb-2">
                Technical Details
              </summary>
              <div className="bg-gray-800 rounded-lg p-4 overflow-auto">
                <pre className="text-xs text-red-400">{error.stack || error.message}</pre>
              </div>
            </details>
          )}

          {/* Recovery Suggestions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">What you can do:</h3>
            <div className="space-y-3">
              {content.suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {resetError && (
              <Button onClick={resetError}>
                Try Again
              </Button>
            )}
            <Button variant="secondary" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>

          {/* Support Links */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-4">Need help?</p>
            <div className="flex gap-4 justify-center text-sm">
              <a href="/docs" className="text-blue-400 hover:text-blue-300 transition-colors">
                📚 Documentation
              </a>
              <a href="/support" className="text-blue-400 hover:text-blue-300 transition-colors">
                💬 Support
              </a>
              <a href="https://twitter.com/prophetbase" className="text-blue-400 hover:text-blue-300 transition-colors">
                🐦 Twitter
              </a>
              <a href="https://discord.gg/prophetbase" className="text-blue-400 hover:text-blue-300 transition-colors">
                💬 Discord
              </a>
            </div>
          </div>
        </div>
      </Card>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Specific error components
export function NotFoundError() {
  return <ErrorFallback type="404" />;
}

export function ServerError() {
  return <ErrorFallback type="500" />;
}

export function NetworkError({ resetError }: { resetError?: () => void }) {
  return <ErrorFallback type="network" resetError={resetError} />;
}

export function WalletError({ resetError }: { resetError?: () => void }) {
  return <ErrorFallback type="wallet" resetError={resetError} />;
}
