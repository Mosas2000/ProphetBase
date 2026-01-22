'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Mentorship() {
  const mentors = [
    { id: '1', name: 'CryptoKing', specialty: 'Crypto Markets', students: 12, rating: 4.9, price: 'Free' },
    { id: '2', name: 'TradeQueen', specialty: 'Risk Management', students: 8, rating: 4.8, price: '100 XP/month' },
  ];

  const myMentees = [
    { name: 'Newbie1', progress: 75, trades: 45, profit: 450 },
    { name: 'Learner2', progress: 60, trades: 32, profit: 280 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Mentorship Program</h3>
          <p className="text-gray-400">Learn from experienced traders or become a mentor</p>
        </div>
      </Card>

      {/* Find Mentors */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Available Mentors</h4>
          
          <div className="space-y-3">
            {mentors.map(mentor => (
              <div key={mentor.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{mentor.name}</p>
                    <p className="text-sm text-gray-400">{mentor.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400">⭐ {mentor.rating}</span>
                      <span className="text-sm text-gray-400">• {mentor.students} students</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-2">{mentor.price}</p>
                    <Button size="sm">Request</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* My Mentees */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">My Mentees</h4>
            <Badge variant="success">+500 XP earned</Badge>
          </div>
          
          <div className="space-y-3">
            {myMentees.map((mentee, idx) => (
              <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">{mentee.name}</p>
                  <span className="text-green-400">+${mentee.profit}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span>{mentee.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${mentee.progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-400">{mentee.trades} trades completed</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Success Stories */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Success Stories</h4>
          
          <div className="space-y-3">
            {[
              { mentee: 'Alice', mentor: 'CryptoKing', achievement: 'Turned $100 into $1,000 in 3 months' },
              { mentee: 'Bob', mentor: 'TradeQueen', achievement: 'Achieved 70% win rate' },
            ].map((story, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500 rounded-lg">
                <p className="font-medium mb-1">{story.achievement}</p>
                <p className="text-sm text-gray-400">{story.mentee} mentored by {story.mentor}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Become a Mentor */}
      <Card>
        <div className="p-6 text-center">
          <h4 className="font-semibold mb-2">Become a Mentor</h4>
          <p className="text-gray-400 mb-4">Share your knowledge and earn rewards</p>
          <Button>Apply Now</Button>
        </div>
      </Card>
    </div>
  );
}
