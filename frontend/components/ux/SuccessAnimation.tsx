'use client';

import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  isVisible: boolean;
  type?: 'trade' | 'milestone' | 'achievement';
  message?: string;
  onComplete?: () => void;
}

export function SuccessAnimation({ isVisible, type = 'trade', message, onComplete }: SuccessAnimationProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) {
          onComplete();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!show) return null;

  const getAnimation = () => {
    switch (type) {
      case 'trade':
        return (
          <div className="relative">
            {/* Confetti particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 100}%`,
                  backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
            
            {/* Success checkmark */}
            <div className="relative z-10 w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-scale-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        );

      case 'milestone':
        return (
          <div className="relative">
            {/* Star burst */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-8 bg-gradient-to-t from-yellow-400 to-transparent animate-star-burst"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-50px)`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
            
            {/* Trophy */}
            <div className="relative z-10 text-6xl animate-bounce-slow">
              🏆
            </div>
          </div>
        );

      case 'achievement':
        return (
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            
            {/* Badge */}
            <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-scale-bounce border-4 border-white/20">
              <span className="text-4xl">🎖️</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        {getAnimation()}
        
        {message && (
          <div className="mt-6 animate-fade-in-up">
            <p className="text-2xl font-bold text-white mb-2">
              {type === 'trade' && '🎉 Trade Successful!'}
              {type === 'milestone' && '🌟 Milestone Reached!'}
              {type === 'achievement' && '🎊 Achievement Unlocked!'}
            </p>
            <p className="text-lg text-gray-300">{message}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scale-bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes star-burst {
          0% {
            opacity: 0;
            transform: rotate(var(--rotation)) translateY(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: rotate(var(--rotation)) translateY(-100px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-confetti {
          animation: confetti forwards;
        }

        .animate-scale-bounce {
          animation: scale-bounce 0.6s ease-in-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-star-burst {
          animation: star-burst 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

// Level Up Animation
interface LevelUpProps {
  isVisible: boolean;
  level: number;
  onComplete?: () => void;
}

export function LevelUpAnimation({ isVisible, level, onComplete }: LevelUpProps) {
  return (
    <SuccessAnimation
      isVisible={isVisible}
      type="milestone"
      message={`Level ${level} Trader!`}
      onComplete={onComplete}
    />
  );
}

// Win Celebration
interface WinCelebrationProps {
  isVisible: boolean;
  profit: number;
  onComplete?: () => void;
}

export function WinCelebration({ isVisible, profit, onComplete }: WinCelebrationProps) {
  return (
    <SuccessAnimation
      isVisible={isVisible}
      type="trade"
      message={`You won $${profit.toFixed(2)}!`}
      onComplete={onComplete}
    />
  );
}
