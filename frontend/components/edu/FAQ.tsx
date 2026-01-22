'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How do prediction markets work?',
      answer: 'Prediction markets allow you to buy and sell shares representing outcomes of future events. Each share pays $1 if the outcome occurs. Prices reflect the market\'s collective probability estimate.',
      category: 'basics',
      helpful: 245,
    },
    {
      question: 'What happens if I\'m wrong?',
      answer: 'If your prediction is incorrect, your shares become worthless. For example, if you bought YES shares and the market resolves to NO, you lose your investment. This is why it\'s important to only risk what you can afford to lose.',
      category: 'basics',
      helpful: 189,
    },
    {
      question: 'How are markets resolved?',
      answer: 'Markets are resolved based on objective, verifiable outcomes. We use trusted oracles and data sources to determine the correct outcome. The resolution process is transparent and can be verified on-chain.',
      category: 'trading',
      helpful: 156,
    },
    {
      question: 'What fees does ProphetBase charge?',
      answer: 'We charge a small trading fee (typically 1-2%) on each transaction. There are no deposit or withdrawal fees. Higher-level users may receive fee discounts.',
      category: 'fees',
      helpful: 234,
    },
    {
      question: 'Can I sell my shares before resolution?',
      answer: 'Yes! You can sell your shares at any time before the market resolves. The price you receive depends on current market conditions and may be higher or lower than your purchase price.',
      category: 'trading',
      helpful: 178,
    },
    {
      question: 'Is my wallet safe?',
      answer: 'ProphetBase never has custody of your funds. Your assets remain in your wallet at all times. We use industry-standard security practices and smart contract audits.',
      category: 'security',
      helpful: 201,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'basics', name: 'Basics' },
    { id: 'trading', name: 'Trading' },
    { id: 'fees', name: 'Fees' },
    { id: 'security', name: 'Security' },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
          
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq, idx) => (
          <Card key={idx}>
            <div className="p-6">
              <button
                onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{faq.question}</h4>
                      <Badge variant="default" className="capitalize text-xs">{faq.category}</Badge>
                    </div>
                  </div>
                  <span className="text-2xl ml-4">{expandedId === idx ? '−' : '+'}</span>
                </div>
              </button>

              {expandedId === idx && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-300 mb-4">{faq.answer}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="text-sm text-gray-400 hover:text-green-400">
                        👍 Helpful ({faq.helpful})
                      </button>
                      <button className="text-sm text-gray-400 hover:text-red-400">
                        👎 Not helpful
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Helpful Resources */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Helpful Resources</h4>
          
          <div className="space-y-2">
            {[
              { title: 'Getting Started Guide', link: '/edu/getting-started' },
              { title: 'Trading Academy', link: '/edu/academy' },
              { title: 'Video Tutorials', link: '/edu/videos' },
              { title: 'Join Discord Community', link: 'https://discord.gg/prophetbase' },
            ].map((resource, idx) => (
              <a
                key={idx}
                href={resource.link}
                className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <p className="font-medium text-blue-400">{resource.title} →</p>
              </a>
            ))}
          </div>
        </div>
      </Card>

      {/* Contact Support */}
      <Card>
        <div className="p-6 text-center">
          <p className="text-gray-400 mb-4">Can't find what you're looking for?</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Contact Support
          </button>
        </div>
      </Card>
    </div>
  );
}
