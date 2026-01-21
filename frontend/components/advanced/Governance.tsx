'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextArea } from '@/components/ui/TextArea';
import { useState } from 'react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  endDate: string;
  category: 'PLATFORM' | 'TREASURY' | 'MARKET' | 'PARAMETER';
}

export function Governance() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: 'Reduce Trading Fees to 0.3%',
      description: 'Proposal to reduce platform trading fees from 0.5% to 0.3% to increase competitiveness and trading volume.',
      proposer: '0x1234...5678',
      status: 'ACTIVE',
      votesFor: 12500,
      votesAgainst: 3200,
      totalVotes: 15700,
      quorum: 10000,
      endDate: '2024-01-25',
      category: 'PARAMETER',
    },
    {
      id: 2,
      title: 'Add Sports Category',
      description: 'Enable sports prediction markets on the platform with appropriate moderation and resolution mechanisms.',
      proposer: '0xabcd...efgh',
      status: 'PASSED',
      votesFor: 18900,
      votesAgainst: 2100,
      totalVotes: 21000,
      quorum: 10000,
      endDate: '2024-01-20',
      category: 'PLATFORM',
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'PLATFORM' as Proposal['category'],
  });

  const [userTokens] = useState(5000); // User's governance token balance
  const [votedProposals, setVotedProposals] = useState<Set<number>>(new Set());

  const handleCreateProposal = () => {
    const proposal: Proposal = {
      id: proposals.length + 1,
      title: newProposal.title,
      description: newProposal.description,
      proposer: '0x1234...5678', // Current user
      status: 'ACTIVE',
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorum: 10000,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: newProposal.category,
    };

    setProposals([proposal, ...proposals]);
    setIsCreating(false);
    setNewProposal({ title: '', description: '', category: 'PLATFORM' });
  };

  const vote = (proposalId: number, support: boolean) => {
    if (votedProposals.has(proposalId)) {
      alert('You have already voted on this proposal');
      return;
    }

    setProposals(proposals.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votesFor: support ? p.votesFor + userTokens : p.votesFor,
          votesAgainst: !support ? p.votesAgainst + userTokens : p.votesAgainst,
          totalVotes: p.totalVotes + userTokens,
        };
      }
      return p;
    }));

    setVotedProposals(new Set([...votedProposals, proposalId]));
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'PASSED': return 'success';
      case 'REJECTED': return 'error';
      case 'EXECUTED': return 'success';
    }
  };

  const getCategoryIcon = (category: Proposal['category']) => {
    switch (category) {
      case 'PLATFORM': return '🏛️';
      case 'TREASURY': return '💰';
      case 'MARKET': return '📊';
      case 'PARAMETER': return '⚙️';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Platform Governance</h3>
              <p className="text-sm text-gray-400 mt-1">Vote on proposals and shape the future of ProphetBase</p>
            </div>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              + New Proposal
            </Button>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
              <p className="text-sm text-gray-400">Your Voting Power</p>
              <p className="text-2xl font-bold">{userTokens.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">PROPHET tokens</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Votes Cast</p>
              <p className="text-2xl font-bold">{votedProposals.size}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Active Proposals</p>
              <p className="text-2xl font-bold">{proposals.filter(p => p.status === 'ACTIVE').length}</p>
            </div>
          </div>

          {/* Create Proposal Form */}
          {isCreating && (
            <Card className="mb-6 border border-blue-500">
              <div className="p-4 space-y-4">
                <h4 className="font-semibold">Create Proposal</h4>

                <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 text-sm">
                  <p className="text-blue-400">💡 Requires 1,000 PROPHET tokens to create a proposal</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['PLATFORM', 'TREASURY', 'MARKET', 'PARAMETER'] as const).map(cat => (
                      <label
                        key={cat}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          newProposal.category === cat
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={newProposal.category === cat}
                          onChange={() => setNewProposal({ ...newProposal, category: cat })}
                          className="w-4 h-4"
                        />
                        <span>{getCategoryIcon(cat)} {cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    placeholder="e.g., Reduce trading fees to 0.3%"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <TextArea
                  label="Description"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  placeholder="Provide a detailed description of your proposal..."
                  rows={4}
                />

                <div className="flex gap-2">
                  <Button onClick={handleCreateProposal} disabled={!newProposal.title || !newProposal.description}>
                    Submit Proposal
                  </Button>
                  <Button variant="secondary" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Proposals List */}
          <div className="space-y-4">
            {proposals.map(proposal => {
              const forPercent = proposal.totalVotes > 0 
                ? (proposal.votesFor / proposal.totalVotes) * 100 
                : 0;
              const againstPercent = proposal.totalVotes > 0 
                ? (proposal.votesAgainst / proposal.totalVotes) * 100 
                : 0;
              const quorumReached = proposal.totalVotes >= proposal.quorum;
              const hasVoted = votedProposals.has(proposal.id);

              return (
                <Card key={proposal.id}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getCategoryIcon(proposal.category)}</span>
                          <h4 className="font-semibold">{proposal.title}</h4>
                          <Badge variant={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{proposal.description}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Proposed by {proposal.proposer}</span>
                          <span>Ends {new Date(proposal.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-400">For: {proposal.votesFor.toLocaleString()}</span>
                        <span className="text-red-400">Against: {proposal.votesAgainst.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="flex h-full">
                          <div
                            className="bg-green-500"
                            style={{ width: `${forPercent}%` }}
                          />
                          <div
                            className="bg-red-500"
                            style={{ width: `${againstPercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{forPercent.toFixed(1)}% For</span>
                        <span>{againstPercent.toFixed(1)}% Against</span>
                      </div>
                    </div>

                    {/* Quorum */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Quorum Progress</span>
                        <span className={quorumReached ? 'text-green-400' : 'text-gray-400'}>
                          {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${quorumReached ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min((proposal.totalVotes / proposal.quorum) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    {proposal.status === 'ACTIVE' && (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => vote(proposal.id, true)}
                          disabled={hasVoted}
                        >
                          {hasVoted ? 'Voted' : `Vote For (${userTokens.toLocaleString()})`}
                        </Button>
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => vote(proposal.id, false)}
                          disabled={hasVoted}
                        >
                          {hasVoted ? 'Voted' : `Vote Against (${userTokens.toLocaleString()})`}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Token Holder Benefits */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Token Holder Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">🗳️</div>
              <h5 className="font-medium mb-1">Governance Rights</h5>
              <p className="text-sm text-gray-400">Vote on platform decisions and proposals</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">💰</div>
              <h5 className="font-medium mb-1">Fee Sharing</h5>
              <p className="text-sm text-gray-400">Earn a share of platform trading fees</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">🎁</div>
              <h5 className="font-medium mb-1">Exclusive Access</h5>
              <p className="text-sm text-gray-400">Early access to new features and markets</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">📊</div>
              <h5 className="font-medium mb-1">Advanced Analytics</h5>
              <p className="text-sm text-gray-400">Premium analytics and insights tools</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
