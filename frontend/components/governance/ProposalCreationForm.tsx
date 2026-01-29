'use client';

import { useState } from 'react';

type ProposalType = 'parameter_change' | 'feature_request' | 'treasury_allocation' | 'dispute_resolution';

/**
 * Interface for creating protocol governance proposals
 */
export default function ProposalCreationForm() {
  const [type, setType] = useState<ProposalType>('parameter_change');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="p-10 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
          Create Proposal
        </h2>
        <p className="text-gray-500 font-medium font-inter">
          Submit a new initiative to the ProphetBase DAO. Requires 5,000 VP to publish.
        </p>
      </header>

      <div className="space-y-8">
        {/* Proposal Type Selection */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Select Category</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'parameter_change', label: 'Protocol Settings', icon: '⚙️' },
              { id: 'feature_request', label: 'Development', icon: '🚀' },
              { id: 'treasury_allocation', label: 'Treasury/Grants', icon: '💰' },
              { id: 'dispute_resolution', label: 'Dispute Mgmt', icon: '⚖️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setType(item.id as ProposalType)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  type === item.id 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                    : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-blue-200'
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className={`text-[10px] font-black uppercase tracking-tight ${type === item.id ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Proposal Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Increase maximum market duration to 1 year"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Rationale & Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why this change is beneficial for the protocol..."
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600 h-64 resize-none transition-shadow"
            />
          </div>
        </div>

        {/* Warning / Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/50 p-6 rounded-2xl">
          <div className="flex gap-3">
             <span className="text-xl">⚠️</span>
             <div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1">Notice</p>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 font-medium">
                  Once submitted, the proposal will enter a 48-hour discussion period before voting begins. 
                  Ensure all technical details are accurate as the title cannot be modified later.
                </p>
             </div>
          </div>
        </div>

        <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:scale-[1.01] transition-all">
          Publish Proposal
        </button>
      </div>
    </div>
  );
}
