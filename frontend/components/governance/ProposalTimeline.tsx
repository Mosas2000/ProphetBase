'use client';

type StepStatus = 'completed' | 'active' | 'pending' | 'failed';

interface TimelineStep {
  label: string;
  date?: string;
  status: StepStatus;
  description: string;
}

/**
 * Visual timeline for tracking proposal lifecycle stages
 */
export default function ProposalTimeline() {
  const steps: TimelineStep[] = [
    { label: 'Published', date: 'Jan 25, 2026', status: 'completed', description: 'Proposal submitted to the DAO' },
    { label: 'Discussion', date: 'Jan 27, 2026', status: 'completed', description: '48h community review period' },
    { label: 'Voting', date: 'In Progress', status: 'active', description: 'Active voting period (72h remaining)' },
    { label: 'Execution', status: 'pending', description: 'Automatic execution if passed' },
  ];

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">Proposal Status</h3>
      
      <div className="relative space-y-10">
        {/* Continuous Line */}
        <div className="absolute left-4 top-1 bottom-1 w-0.5 bg-gray-100 dark:bg-gray-800" />

        {steps.map((step, index) => (
          <div key={step.label} className="relative flex items-start gap-6 group">
            {/* Status Indicator */}
            <div className={`
              z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 transition-all duration-500
              ${step.status === 'completed' ? 'bg-green-500 border-green-100 dark:border-green-900/30 text-white' : 
                step.status === 'active' ? 'bg-blue-600 border-blue-100 dark:border-blue-900/30 text-white animate-pulse' : 
                'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}
            `}>
              {step.status === 'completed' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <span className="text-xs font-black">{index + 1}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`text-sm font-black uppercase tracking-tight ${
                  step.status === 'active' ? 'text-blue-600' : 
                  step.status === 'completed' ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}>
                  {step.label}
                </h4>
                {step.date && (
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.date}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
         <div className="flex items-center gap-3">
            <span className="p-2 bg-white dark:bg-gray-700 rounded-lg text-lg">💡</span>
            <p className="text-[10px] text-gray-500 font-medium leading-tight uppercase tracking-tight">
              Quorum requires 12.5% of total supply (2.5M VP) for the proposal to be considered valid.
            </p>
         </div>
      </div>
    </div>
  );
}
