'use client';

import { useState } from 'react';

type Language = 'typescript' | 'python' | 'go' | 'rust';

export default function SDKGenerator() {
  const [language, setLanguage] = useState<Language>('typescript');
  const [copied, setCopied] = useState(false);

  const sdkCode: Record<Language, string> = {
    typescript: `// ProphetBase TypeScript SDK
import { ProphetBase } from '@prophetbase/sdk';

// Initialize the client
const client = new ProphetBase({
  apiKey: 'your-api-key',
  network: 'base-mainnet'
});

// Get all markets
const markets = await client.markets.list({
  limit: 50,
  category: 'crypto'
});

// Place a trade
const trade = await client.trading.buy({
  marketId: '42',
  outcome: 'YES',
  amount: 100 // USDC
});

// Get user portfolio
const portfolio = await client.user.getPortfolio();

// Subscribe to market updates
client.markets.subscribe('42', (update) => {
  console.log('Market updated:', update);
});

// Get market analytics
const analytics = await client.analytics.getMarket('42');
console.log('Volume:', analytics.volume);
console.log('Probability:', analytics.probability);`,

    python: `# ProphetBase Python SDK
from prophetbase import ProphetBase

# Initialize the client
client = ProphetBase(
    api_key='your-api-key',
    network='base-mainnet'
)

# Get all markets
markets = client.markets.list(
    limit=50,
    category='crypto'
)

# Place a trade
trade = client.trading.buy(
    market_id='42',
    outcome='YES',
    amount=100  # USDC
)

# Get user portfolio
portfolio = client.user.get_portfolio()

# Subscribe to market updates
def on_update(update):
    print('Market updated:', update)

client.markets.subscribe('42', on_update)

# Get market analytics
analytics = client.analytics.get_market('42')
print(f'Volume: {analytics.volume}')
print(f'Probability: {analytics.probability}')`,

    go: `// ProphetBase Go SDK
package main

import (
    "fmt"
    "github.com/prophetbase/go-sdk"
)

func main() {
    // Initialize the client
    client := prophetbase.NewClient(&prophetbase.Config{
        APIKey:  "your-api-key",
        Network: "base-mainnet",
    })

    // Get all markets
    markets, err := client.Markets.List(&prophetbase.MarketsListParams{
        Limit:    50,
        Category: "crypto",
    })
    if err != nil {
        panic(err)
    }

    // Place a trade
    trade, err := client.Trading.Buy(&prophetbase.BuyParams{
        MarketID: "42",
        Outcome:  "YES",
        Amount:   100, // USDC
    })

    // Get user portfolio
    portfolio, err := client.User.GetPortfolio()

    // Get market analytics
    analytics, err := client.Analytics.GetMarket("42")
    fmt.Printf("Volume: %f\\n", analytics.Volume)
    fmt.Printf("Probability: %f\\n", analytics.Probability)
}`,

    rust: `// ProphetBase Rust SDK
use prophetbase::{ProphetBase, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the client
    let client = ProphetBase::new(Config {
        api_key: "your-api-key".to_string(),
        network: "base-mainnet".to_string(),
    });

    // Get all markets
    let markets = client.markets().list(
        Some(50),
        Some("crypto".to_string())
    ).await?;

    // Place a trade
    let trade = client.trading().buy(
        "42",
        "YES",
        100 // USDC
    ).await?;

    // Get user portfolio
    let portfolio = client.user().get_portfolio().await?;

    // Get market analytics
    let analytics = client.analytics().get_market("42").await?;
    println!("Volume: {}", analytics.volume);
    println!("Probability: {}", analytics.probability);

    Ok(())
}`,
  };

  const installCommands: Record<Language, string> = {
    typescript: 'npm install @prophetbase/sdk',
    python: 'pip install prophetbase',
    go: 'go get github.com/prophetbase/go-sdk',
    rust: 'cargo add prophetbase',
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sdkCode[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SDK Generator</h2>
        <p className="text-sm text-gray-600">
          Production-ready client libraries for ProphetBase integration
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex space-x-2 mb-6">
        {(['typescript', 'python', 'go', 'rust'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-6 py-3 rounded-lg font-medium capitalize transition-colors ${
              language === lang
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {lang === 'typescript'
              ? 'TypeScript'
              : lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      {/* Installation */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Installation</h3>
        <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm flex items-center justify-between">
          <span>{installCommands[language]}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(installCommands[language]);
            }}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Code Example */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Example Usage</h3>
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
        <pre className="bg-gray-900 text-gray-300 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed">
          {sdkCode[language]}
        </pre>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">✨ Features</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Full TypeScript support</li>
            <li>• Automatic retry logic</li>
            <li>• Built-in error handling</li>
            <li>• WebSocket subscriptions</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h4 className="font-semibold text-gray-900 mb-2">📦 Includes</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Markets API</li>
            <li>• Trading API</li>
            <li>• User API</li>
            <li>• Analytics API</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-2">🔒 Security</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• API key authentication</li>
            <li>• Rate limit handling</li>
            <li>• Request signing</li>
            <li>• Secure by default</li>
          </ul>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-2">📚 Resources</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• API Documentation</li>
            <li>• Code Examples</li>
            <li>• Video Tutorials</li>
            <li>• Community Support</li>
          </ul>
        </div>
      </div>

      {/* Links */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-6 text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            📖 Full Documentation
          </a>
          <a href="#" className="text-blue-600 hover:underline">
            💬 Discord Community
          </a>
          <a href="#" className="text-blue-600 hover:underline">
            🐛 Report Issues
          </a>
          <a href="#" className="text-blue-600 hover:underline">
            ⭐ GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
}
