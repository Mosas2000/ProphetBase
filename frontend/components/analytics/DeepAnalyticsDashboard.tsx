'use client';

import AIMarketDiscovery from './AIMarketDiscovery';
import AISentimentAnalysis from './AISentimentAnalysis';
import ArbitrageDetector from './ArbitrageDetector';
import LiquidityDepthChart from './LiquidityDepthChart';
import MarketCorrelationMap from './MarketCorrelationMap';
import PredictiveProbabilityChart from './PredictiveProbabilityChart';
import SocialSignalAggregator from './SocialSignalAggregator';
import VolumeHeatmap from './VolumeHeatmap';
import WhaleActivityTracker from './WhaleActivityTracker';

/**
 * The "Command Center" - Integrated Deep Analytics Dashboard
 */
export default function DeepAnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Neural Network Active</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
            Command <span className="text-blue-600">Center</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2">ProphetBase Deep Intelligence Layer</p>
        </div>
        
        <div className="flex bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm gap-2">
           <button className="px-6 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">Global Overview</button>
           <button className="px-6 py-2 text-gray-400 hover:text-gray-900 dark:hover:text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-colors">Sector Specific</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Core Signals */}
        <div className="lg:col-span-8 space-y-8">
          <AISentimentAnalysis />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PredictiveProbabilityChart />
            <LiquidityDepthChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <MarketCorrelationMap />
             <VolumeHeatmap />
          </div>
        </div>

        {/* Right Column - Real-time Intelligence */}
        <div className="lg:col-span-4 space-y-8">
           <div className="sticky top-8 space-y-8">
              <WhaleActivityTracker />
              <SocialSignalAggregator />
              <ArbitrageDetector />
              <AIMarketDiscovery />
           </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
         <div>
            <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">Compute Capacity: 98.4 TFLOPS</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Decentralized AI Nodes Online: 1,242</div>
         </div>
         <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Documentation</a>
            <a href="#" className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">API Status</a>
            <a href="#" className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Network Map</a>
         </div>
      </footer>
    </div>
  );
}
