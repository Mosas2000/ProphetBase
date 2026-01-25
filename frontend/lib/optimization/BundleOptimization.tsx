'use client';

import { useEffect, useState } from 'react';
import { Package, TrendingDown, FileCode, Gauge } from 'lucide-react';

// Bundle analysis data structures
export interface BundleChunk {
  name: string;
  size: number;
  gzipSize?: number;
  modules: string[];
}

export interface BundleAnalysis {
  totalSize: number;
  gzipSize: number;
  chunks: BundleChunk[];
  treeShakenSize: number;
  unusedCode: string[];
}

// Tree shaking analyzer
export class TreeShakingAnalyzer {
  private unusedExports: Map<string, string[]> = new Map();

  analyzeModule(modulePath: string, exports: string[], usedExports: string[]): void {
    const unused = exports.filter((exp) => !usedExports.includes(exp));
    if (unused.length > 0) {
      this.unusedExports.set(modulePath, unused);
    }
  }

  getUnusedExports(): Map<string, string[]> {
    return this.unusedExports;
  }

  getUnusedCount(): number {
    let count = 0;
    this.unusedExports.forEach((exports) => {
      count += exports.length;
    });
    return count;
  }

  getReport() {
    return Array.from(this.unusedExports.entries()).map(([path, exports]) => ({
      module: path,
      unusedExports: exports,
      count: exports.length,
    }));
  }
}

// Dead code detection
export class DeadCodeDetector {
  private deadCodeBlocks: Array<{
    file: string;
    line: number;
    code: string;
    reason: string;
  }> = [];

  detectUnreachableCode(code: string, file: string): void {
    // Simplified detection
    const lines = code.split('\n');
    let inDeadCode = false;

    lines.forEach((line, index) => {
      if (line.includes('return') && !line.trim().startsWith('//')) {
        inDeadCode = true;
      } else if (inDeadCode && line.trim() && !line.trim().startsWith('//')) {
        this.deadCodeBlocks.push({
          file,
          line: index + 1,
          code: line.trim(),
          reason: 'Unreachable code after return',
        });
      }

      if (line.includes('}')) {
        inDeadCode = false;
      }
    });
  }

  detectUnusedVariables(code: string, file: string): void {
    // Simplified detection - look for declared but unused variables
    const varDeclarations = code.match(/(?:const|let|var)\s+(\w+)/g) || [];
    varDeclarations.forEach((decl) => {
      const varName = decl.split(/\s+/)[1];
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      const matches = code.match(regex) || [];

      if (matches.length === 1) {
        // Only declared, never used
        this.deadCodeBlocks.push({
          file,
          line: 0,
          code: decl,
          reason: 'Unused variable',
        });
      }
    });
  }

  getDeadCode() {
    return this.deadCodeBlocks;
  }

  getDeadCodeCount(): number {
    return this.deadCodeBlocks.length;
  }
}

// Minification analyzer
export class MinificationAnalyzer {
  calculateSavings(originalSize: number, minifiedSize: number): {
    savedBytes: number;
    savedPercentage: number;
  } {
    const savedBytes = originalSize - minifiedSize;
    const savedPercentage = (savedBytes / originalSize) * 100;

    return {
      savedBytes,
      savedPercentage,
    };
  }

  analyzeMinification(files: Array<{ path: string; original: number; minified: number }>) {
    let totalOriginal = 0;
    let totalMinified = 0;

    const analyzed = files.map((file) => {
      totalOriginal += file.original;
      totalMinified += file.minified;

      return {
        ...file,
        ...this.calculateSavings(file.original, file.minified),
      };
    });

    return {
      files: analyzed,
      total: this.calculateSavings(totalOriginal, totalMinified),
    };
  }
}

// Compression analyzer
export class CompressionAnalyzer {
  analyzeCompression(files: Array<{ path: string; size: number; gzipSize: number }>) {
    return files.map((file) => ({
      ...file,
      compressionRatio: ((file.size - file.gzipSize) / file.size) * 100,
      savings: file.size - file.gzipSize,
    }));
  }

  recommendCompression(file: { path: string; size: number; gzipSize?: number }): string {
    if (!file.gzipSize) return 'Enable gzip compression';

    const ratio = ((file.size - file.gzipSize) / file.size) * 100;

    if (ratio < 50) return 'Consider using Brotli compression';
    if (file.gzipSize > 100000) return 'File still large after compression, consider code splitting';
    return 'Compression is optimal';
  }
}

// Bundle size monitor
export class BundleSizeMonitor {
  private sizeLimit: number;
  private currentSize: number = 0;
  private chunks: Map<string, number> = new Map();

  constructor(sizeLimit: number = 244000) {
    // Default 244KB (mobile 3G budget)
    this.sizeLimit = sizeLimit;
  }

  recordChunk(name: string, size: number): void {
    this.chunks.set(name, size);
    this.updateTotalSize();
  }

  private updateTotalSize(): void {
    this.currentSize = 0;
    this.chunks.forEach((size) => {
      this.currentSize += size;
    });
  }

  isOverBudget(): boolean {
    return this.currentSize > this.sizeLimit;
  }

  getBudgetUsage(): number {
    return (this.currentSize / this.sizeLimit) * 100;
  }

  getReport() {
    return {
      currentSize: this.currentSize,
      sizeLimit: this.sizeLimit,
      remaining: Math.max(0, this.sizeLimit - this.currentSize),
      overBudget: this.isOverBudget(),
      usage: this.getBudgetUsage(),
      chunks: Array.from(this.chunks.entries())
        .map(([name, size]) => ({
          name,
          size,
          percentage: (size / this.currentSize) * 100,
        }))
        .sort((a, b) => b.size - a.size),
    };
  }

  setSizeLimit(limit: number): void {
    this.sizeLimit = limit;
  }
}

// Size analysis utilities
export const SizeAnalysis = {
  // Format bytes to human-readable
  formatBytes: (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  },

  // Calculate gzip size estimate
  estimateGzipSize: (size: number): number => {
    // Rough estimate: gzip typically achieves 70-80% compression
    return Math.round(size * 0.3);
  },

  // Calculate load time on different connections
  estimateLoadTime: (bytes: number, connection: '3g' | '4g' | '5g' | 'wifi'): number => {
    const speeds = {
      '3g': 750000, // 750 KB/s
      '4g': 3000000, // 3 MB/s
      '5g': 10000000, // 10 MB/s
      wifi: 5000000, // 5 MB/s
    };

    return (bytes / speeds[connection]) * 1000; // Return in ms
  },
};

// Bundle optimization dashboard
export function BundleOptimizationDashboard() {
  const [analysis, setAnalysis] = useState<{
    totalSize: number;
    gzipSize: number;
    chunks: number;
    unusedCode: number;
  } | null>(null);

  useEffect(() => {
    // Simulate bundle analysis
    const monitor = new BundleSizeMonitor(244000);
    monitor.recordChunk('main', 150000);
    monitor.recordChunk('vendor', 80000);
    monitor.recordChunk('runtime', 10000);

    const report = monitor.getReport();

    setAnalysis({
      totalSize: report.currentSize,
      gzipSize: SizeAnalysis.estimateGzipSize(report.currentSize),
      chunks: report.chunks.length,
      unusedCode: 0,
    });
  }, []);

  if (!analysis) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-slate-800 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">Bundle Optimization</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FileCode className="w-5 h-5 text-blue-400" />}
          label="Total Size"
          value={SizeAnalysis.formatBytes(analysis.totalSize)}
          subtext="Uncompressed"
        />
        <StatCard
          icon={<TrendingDown className="w-5 h-5 text-green-400" />}
          label="Gzip Size"
          value={SizeAnalysis.formatBytes(analysis.gzipSize)}
          subtext="Compressed"
        />
        <StatCard
          icon={<Package className="w-5 h-5 text-purple-400" />}
          label="Chunks"
          value={analysis.chunks.toString()}
          subtext="Code splits"
        />
        <StatCard
          icon={<Gauge className="w-5 h-5 text-amber-400" />}
          label="Load Time"
          value={`${SizeAnalysis.estimateLoadTime(analysis.gzipSize, '3g').toFixed(0)}ms`}
          subtext="3G Network"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="p-4 bg-slate-700 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-slate-500">{subtext}</div>
    </div>
  );
}

// Export singleton instances
export const treeShakingAnalyzer = new TreeShakingAnalyzer();
export const deadCodeDetector = new DeadCodeDetector();
export const minificationAnalyzer = new MinificationAnalyzer();
export const compressionAnalyzer = new CompressionAnalyzer();
export const bundleSizeMonitor = new BundleSizeMonitor();
