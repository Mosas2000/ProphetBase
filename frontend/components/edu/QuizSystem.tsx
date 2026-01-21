'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function QuizSystem() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      question: 'What does a share price of 65¢ represent in a prediction market?',
      options: [
        'The share costs 65 cents',
        'The market thinks there\'s a 65% chance of YES',
        'You get 65 cents if you win',
        'The market has 65 participants',
      ],
      correct: 1,
      explanation: 'Share prices represent probability. A 65¢ price means the market collectively estimates a 65% chance of the YES outcome.',
      difficulty: 'easy',
    },
    {
      id: '2',
      question: 'What happens to your shares if you\'re wrong?',
      options: [
        'You get a partial refund',
        'They become worthless',
        'You can trade them later',
        'They convert to the winning side',
      ],
      correct: 1,
      explanation: 'If your prediction is incorrect, your shares become worthless and you lose your investment.',
      difficulty: 'easy',
    },
    {
      id: '3',
      question: 'What is the recommended position size for beginners?',
      options: [
        '50% of portfolio',
        '25% of portfolio',
        '2-5% of portfolio',
        '100% of portfolio',
      ],
      correct: 2,
      explanation: 'Beginners should risk only 2-5% of their portfolio per trade to manage risk effectively.',
      difficulty: 'medium',
    },
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const percentage = Math.round((score / questions.length) * 100);

  if (quizCompleted) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
            
            <div className="inline-block bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-8 mb-6">
              <span className="text-6xl font-bold text-white">{percentage}%</span>
            </div>

            <p className="text-xl mb-2">You scored {score} out of {questions.length}</p>
            <p className="text-gray-400 mb-6">
              {percentage >= 80 ? 'Excellent work! 🎉' : percentage >= 60 ? 'Good job! Keep learning 📚' : 'Keep practicing! 💪'}
            </p>

            {percentage >= 80 && (
              <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 mb-6">
                <p className="font-semibold text-yellow-400 mb-2">🏆 Reward Earned!</p>
                <p className="text-sm">+500 XP for completing the quiz</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={handleRestart} className="flex-1">Retake Quiz</Button>
              <Button variant="secondary" className="flex-1">View Leaderboard</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Knowledge Quiz</h3>
            <Badge variant="default" className="capitalize">{questions[currentQuestion].difficulty}</Badge>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">Question {currentQuestion + 1} of {questions.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
            <span className="text-sm text-gray-400">Potential Reward: +500 XP</span>
          </div>
        </div>
      </Card>

      {/* Question */}
      <Card>
        <div className="p-6">
          <h4 className="text-xl font-bold mb-6">{questions[currentQuestion].question}</h4>
          
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  showResult
                    ? index === questions[currentQuestion].correct
                      ? 'bg-green-500/20 border-green-500'
                      : index === selectedAnswer
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-gray-800 border-gray-700'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showResult && index === questions[currentQuestion].correct
                      ? 'border-green-500 bg-green-500'
                      : showResult && index === selectedAnswer
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-600'
                  }`}>
                    {showResult && index === questions[currentQuestion].correct && '✓'}
                    {showResult && index === selectedAnswer && index !== questions[currentQuestion].correct && '✗'}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-4">
              <p className="text-sm">
                <span className="font-semibold text-blue-400">Explanation:</span> {questions[currentQuestion].explanation}
              </p>
            </div>
          )}

          {showResult && (
            <Button onClick={handleNext} className="w-full">
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </Card>

      {/* Leaderboard Preview */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-4">Top Scorers</h4>
          
          <div className="space-y-2">
            {[
              { rank: 1, name: 'CryptoKing', score: 100 },
              { rank: 2, name: 'TradeQueen', score: 95 },
              { rank: 3, name: 'MarketMaster', score: 90 },
            ].map(entry => (
              <div key={entry.rank} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">#{entry.rank}</span>
                  <span>{entry.name}</span>
                </div>
                <span className="font-bold">{entry.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
