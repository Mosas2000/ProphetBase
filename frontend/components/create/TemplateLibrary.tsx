'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface MarketTemplate {
  id: string;
  name: string;
  category: string;
  questionFormat: string;
  description: string;
  exampleQuestion: string;
  popularity: number;
}

const templates: MarketTemplate[] = [
  {
    id: '1',
    name: 'Price Prediction',
    category: 'Crypto',
    questionFormat: 'Will [ASSET] reach $[PRICE] by [DATE]?',
    description: 'Predict if a cryptocurrency will reach a specific price target',
    exampleQuestion: 'Will Bitcoin reach $100,000 by December 31, 2024?',
    popularity: 95,
  },
  {
    id: '2',
    name: 'Event Outcome',
    category: 'Technology',
    questionFormat: 'Will [EVENT] happen by [DATE]?',
    description: 'Predict whether a specific event will occur',
    exampleQuestion: 'Will Ethereum 2.0 fully launch by Q2 2024?',
    popularity: 88,
  },
  {
    id: '3',
    name: 'Product Launch',
    category: 'Technology',
    questionFormat: 'Will [COMPANY] launch [PRODUCT] before [DATE]?',
    description: 'Predict product or feature release dates',
    exampleQuestion: 'Will Apple launch Vision Pro before March 2024?',
    popularity: 82,
  },
  {
    id: '4',
    name: 'Sports Match',
    category: 'Sports',
    questionFormat: 'Will [TEAM] win against [OPPONENT] on [DATE]?',
    description: 'Predict the outcome of sporting events',
    exampleQuestion: 'Will Lakers win against Warriors on January 25, 2024?',
    popularity: 90,
  },
  {
    id: '5',
    name: 'Market Cap Milestone',
    category: 'Crypto',
    questionFormat: 'Will [TOKEN] market cap exceed $[AMOUNT] by [DATE]?',
    description: 'Predict if a token will reach a market cap milestone',
    exampleQuestion: 'Will Solana market cap exceed $50B by June 2024?',
    popularity: 78,
  },
  {
    id: '6',
    name: 'Governance Vote',
    category: 'Crypto',
    questionFormat: 'Will [DAO] proposal #[NUMBER] pass?',
    description: 'Predict DAO governance vote outcomes',
    exampleQuestion: 'Will Uniswap proposal #42 pass?',
    popularity: 65,
  },
  {
    id: '7',
    name: 'Network Metric',
    category: 'Crypto',
    questionFormat: 'Will [NETWORK] have more than [NUMBER] active addresses by [DATE]?',
    description: 'Predict blockchain network growth metrics',
    exampleQuestion: 'Will Base have more than 1M daily active addresses by March 2024?',
    popularity: 72,
  },
  {
    id: '8',
    name: 'Token Listing',
    category: 'Crypto',
    questionFormat: 'Will [TOKEN] be listed on [EXCHANGE] by [DATE]?',
    description: 'Predict exchange listing announcements',
    exampleQuestion: 'Will PEPE be listed on Coinbase by February 2024?',
    popularity: 85,
  },
];

interface TemplateLibraryProps {
  onSelectTemplate?: (template: MarketTemplate) => void;
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: MarketTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      // Copy to clipboard or navigate to wizard
      alert(`Using template: ${template.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Market Templates</h2>
            <p className="text-gray-400">Start with a proven template and customize it to your needs</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="hover:border-blue-500 transition-colors">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="default">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    </div>
                  </div>

                  {/* Popularity */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Popularity</span>
                      <span className="font-medium">{template.popularity}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${template.popularity}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Format */}
                  <div className="bg-gray-800 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-400 mb-1">Format</p>
                    <code className="text-sm text-blue-400">{template.questionFormat}</code>
                  </div>

                  {/* Example */}
                  <div className="bg-gray-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Example</p>
                    <p className="text-sm">{template.exampleQuestion}</p>
                  </div>

                  <Button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full"
                  >
                    Use Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No templates found matching your criteria</p>
              <p className="text-sm mt-2">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </Card>

      {/* Popular Formats */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Popular Question Formats</h3>
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Binary Outcome</h4>
              <p className="text-sm text-gray-400 mb-2">Simple yes/no questions</p>
              <code className="text-xs text-blue-400">Will [X] happen by [DATE]?</code>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Threshold Prediction</h4>
              <p className="text-sm text-gray-400 mb-2">Predict if a metric will exceed a value</p>
              <code className="text-xs text-blue-400">Will [METRIC] exceed [VALUE] by [DATE]?</code>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Comparative</h4>
              <p className="text-sm text-gray-400 mb-2">Compare two outcomes</p>
              <code className="text-xs text-blue-400">Will [A] outperform [B] by [DATE]?</code>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold mb-4">Template Customization Tips</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>Replace placeholders with specific values (e.g., [ASSET] → Bitcoin)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>Set realistic and verifiable resolution criteria</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>Choose appropriate end dates based on the event timeline</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p>Add detailed descriptions to clarify edge cases</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
