/**
 * Bundle Size Analyzer
 * Analyzes bundle size, dependency tree, and provides optimization reports
 */

interface BundleInfo {
  name: string;
  size: number;
  gzipSize?: number;
  modules: ModuleInfo[];
}

interface ModuleInfo {
  name: string;
  size: number;
  chunks: string[];
}

interface DependencyNode {
  name: string;
  version: string;
  size: number;
  dependencies: DependencyNode[];
}

interface OptimizationReport {
  totalSize: number;
  gzipSize: number;
  largestModules: ModuleInfo[];
  duplicates: string[];
  suggestions: string[];
  score: number;
}

class BundleAnalyzer {
  private bundles: Map<string, BundleInfo> = new Map();

  /**
   * Analyze bundle
   */
  analyzeBundle(bundleName: string, stats: any): BundleInfo {
    const modules = this.extractModules(stats);
    const size = this.calculateTotalSize(modules);

    const bundle: BundleInfo = {
      name: bundleName,
      size,
      modules,
    };

    this.bundles.set(bundleName, bundle);
    return bundle;
  }

  /**
   * Extract modules from stats
   */
  private extractModules(stats: any): ModuleInfo[] {
    if (!stats || !stats.modules) return [];

    return stats.modules.map((mod: any) => ({
      name: mod.name || mod.identifier,
      size: mod.size || 0,
      chunks: mod.chunks || [],
    }));
  }

  /**
   * Calculate total size
   */
  private calculateTotalSize(modules: ModuleInfo[]): number {
    return modules.reduce((total, mod) => total + mod.size, 0);
  }

  /**
   * Find largest modules
   */
  findLargestModules(limit: number = 10): ModuleInfo[] {
    const allModules: ModuleInfo[] = [];

    this.bundles.forEach((bundle) => {
      allModules.push(...bundle.modules);
    });

    return allModules
      .sort((a, b) => b.size - a.size)
      .slice(0, limit);
  }

  /**
   * Find duplicate modules
   */
  findDuplicates(): string[] {
    const moduleCount = new Map<string, number>();

    this.bundles.forEach((bundle) => {
      bundle.modules.forEach((mod) => {
        const count = moduleCount.get(mod.name) || 0;
        moduleCount.set(mod.name, count + 1);
      });
    });

    const duplicates: string[] = [];
    moduleCount.forEach((count, name) => {
      if (count > 1) {
        duplicates.push(name);
      }
    });

    return duplicates;
  }

  /**
   * Generate optimization report
   */
  generateReport(): OptimizationReport {
    const largestModules = this.findLargestModules(10);
    const duplicates = this.findDuplicates();
    const totalSize = this.getTotalSize();
    const gzipSize = Math.floor(totalSize * 0.3); // Estimate

    const suggestions = this.generateSuggestions(largestModules, duplicates, totalSize);
    const score = this.calculateOptimizationScore(totalSize, duplicates.length);

    return {
      totalSize,
      gzipSize,
      largestModules,
      duplicates,
      suggestions,
      score,
    };
  }

  /**
   * Get total bundle size
   */
  private getTotalSize(): number {
    let total = 0;
    this.bundles.forEach((bundle) => {
      total += bundle.size;
    });
    return total;
  }

  /**
   * Generate optimization suggestions
   */
  private generateSuggestions(
    largestModules: ModuleInfo[],
    duplicates: string[],
    totalSize: number
  ): string[] {
    const suggestions: string[] = [];

    // Size-based suggestions
    if (totalSize > 500000) {
      suggestions.push('Bundle size is large. Consider code splitting.');
    }

    if (totalSize > 1000000) {
      suggestions.push('Bundle size exceeds 1MB. Implement lazy loading for routes.');
    }

    // Duplicate suggestions
    if (duplicates.length > 0) {
      suggestions.push(`Found ${duplicates.length} duplicate modules. Use module federation or dedupe.`);
    }

    // Large module suggestions
    largestModules.slice(0, 3).forEach((mod) => {
      if (mod.size > 100000) {
        suggestions.push(`${mod.name} is ${this.formatSize(mod.size)}. Consider lazy loading or finding alternatives.`);
      }
    });

    // General suggestions
    if (suggestions.length === 0) {
      suggestions.push('Bundle size is optimized. Good job!');
    }

    return suggestions;
  }

  /**
   * Calculate optimization score
   */
  private calculateOptimizationScore(totalSize: number, duplicateCount: number): number {
    let score = 100;

    // Penalize large bundles
    if (totalSize > 500000) score -= 20;
    if (totalSize > 1000000) score -= 30;

    // Penalize duplicates
    score -= duplicateCount * 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Format size for display
   */
  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Build dependency tree
   */
  buildDependencyTree(packageJson: any): DependencyNode {
    const dependencies = packageJson.dependencies || {};

    return {
      name: packageJson.name,
      version: packageJson.version,
      size: 0,
      dependencies: Object.entries(dependencies).map(([name, version]) => ({
        name,
        version: version as string,
        size: 0,
        dependencies: [],
      })),
    };
  }

  /**
   * Get bundle statistics
   */
  getStats() {
    const totalSize = this.getTotalSize();
    const bundleCount = this.bundles.size;
    const moduleCount = this.findLargestModules(1000).length;

    return {
      totalSize: this.formatSize(totalSize),
      bundleCount,
      moduleCount,
      duplicates: this.findDuplicates().length,
    };
  }

  /**
   * Clear analysis data
   */
  clear(): void {
    this.bundles.clear();
  }
}

// Export singleton
export const bundleAnalyzer = new BundleAnalyzer();

// Webpack plugin integration helper
export function createBundleAnalyzerPlugin() {
  return {
    name: 'bundle-analyzer-plugin',
    apply: (compiler: any) => {
      compiler.hooks.emit.tapAsync('BundleAnalyzerPlugin', (compilation: any, callback: any) => {
        const stats = compilation.getStats().toJson({
          all: false,
          modules: true,
          chunks: true,
        });

        bundleAnalyzer.analyzeBundle('main', stats);
        const report = bundleAnalyzer.generateReport();

        console.log('\n📊 Bundle Analysis Report:');
        console.log(`Total Size: ${bundleAnalyzer.formatSize(report.totalSize)}`);
        console.log(`Gzip Size: ${bundleAnalyzer.formatSize(report.gzipSize)}`);
        console.log(`Optimization Score: ${report.score}/100`);
        console.log('\n💡 Suggestions:');
        report.suggestions.forEach((s) => console.log(`  - ${s}`));

        callback();
      });
    },
  };
}
