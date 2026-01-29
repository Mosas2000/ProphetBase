'use client';

import { useState } from 'react';

/**
 * Component for configuring market visibility and access control
 */
export default function MarketAccessSettings() {
  const [visibility, setVisibility] = useState<'public' | 'private' | 'group'>('public');
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [newInvite, setNewInvite] = useState('');

  const addInvite = () => {
    if (newInvite && !invitedUsers.includes(newInvite)) {
      setInvitedUsers([...invitedUsers, newInvite]);
      setNewInvite('');
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">
        Access Control
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { id: 'public', label: 'Public', icon: '🌐', desc: 'Anyone can see and trade' },
          { id: 'private', label: 'Private', icon: '🔒', desc: 'Only invited participants' },
          { id: 'group', label: 'Group', icon: '👥', desc: 'Specific trading groups' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setVisibility(type.id as any)}
            className={`p-4 text-left rounded-2xl border transition-all ${
              visibility === type.id 
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10 ring-2 ring-blue-600/20' 
                : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-blue-200'
            }`}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <div className={`font-bold text-sm ${visibility === type.id ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
              {type.label}
            </div>
            <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
              {type.desc}
            </div>
          </button>
        ))}
      </div>

      {(visibility === 'private' || visibility === 'group') && (
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Invite Participants
          </label>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newInvite}
              onChange={(e) => setNewInvite(e.target.value)}
              placeholder="Username or Wallet Address"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
            <button 
              onClick={addInvite}
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-sm"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {invitedUsers.map((user) => (
              <div key={user} className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{user}</span>
                <button 
                  onClick={() => setInvitedUsers(invitedUsers.filter(u => u !== user))}
                  className="text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
        Note: Private markets still record settlement values on-chain, but metadata is only visible to authorized participants.
      </div>
    </div>
  );
}
