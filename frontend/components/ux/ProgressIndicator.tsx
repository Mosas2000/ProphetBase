'use client';


interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  estimatedTime?: number;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  variant?: 'horizontal' | 'vertical';
}

export function ProgressIndicator({ steps, currentStep, variant = 'horizontal' }: ProgressIndicatorProps) {
  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const isError = step.status === 'error';

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    isError
                      ? 'bg-red-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isError ? '✕' : isCompleted ? '✓' : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <p
                  className={`font-medium ${
                    isActive ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {step.estimatedTime && isActive && (
                  <p className="text-sm text-gray-400 mt-1">~{step.estimatedTime}s</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const isError = step.status === 'error';

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    isError
                      ? 'bg-red-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isError ? '✕' : isCompleted ? '✓' : idx + 1}
                </div>
                <p
                  className={`text-sm mt-2 text-center ${
                    isActive ? 'text-white font-medium' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Transaction Progress Component
interface TransactionProgressProps {
  stage: 'preparing' | 'signing' | 'confirming' | 'completed' | 'error';
  error?: string;
}

export function TransactionProgress({ stage, error }: TransactionProgressProps) {
  const steps: ProgressStep[] = [
    { id: 'prepare', label: 'Preparing', status: 'pending', estimatedTime: 2 },
    { id: 'sign', label: 'Sign Transaction', status: 'pending', estimatedTime: 5 },
    { id: 'confirm', label: 'Confirming', status: 'pending', estimatedTime: 15 },
    { id: 'complete', label: 'Complete', status: 'pending' },
  ];

  const stageMap = {
    preparing: 0,
    signing: 1,
    confirming: 2,
    completed: 3,
    error: -1,
  };

  const currentStep = stageMap[stage];

  if (stage === 'error') {
    steps[currentStep === -1 ? 0 : currentStep].status = 'error';
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Transaction Progress</h3>
      <ProgressIndicator steps={steps} currentStep={currentStep} />
      
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

// Loading Bar
interface LoadingBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
}

export function LoadingBar({ progress, label, showPercentage = true }: LoadingBarProps) {
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm mb-2">
          {label && <span className="text-gray-400">{label}</span>}
          {showPercentage && <span className="font-medium">{Math.round(progress)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Circular Progress
interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function CircularProgress({ progress, size = 120, strokeWidth = 8, label }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-blue-500 transition-all duration-300"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
      {label && <p className="text-sm text-gray-400 mt-2">{label}</p>}
    </div>
  );
}

// Spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin`} />
  );
}
