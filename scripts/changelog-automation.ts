/**
 * Changelog Automation for ProphetBase
 * 
 * Automatically generates a CHANGELOG.md file by parsing git commit
 * messages since the last release tag.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function generateChangelog() {
  console.log('📝 Generating changelog...');

  try {
    // Get commit logs since last tag or all if no tag
    let gitLog: string;
    try {
      const lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
      gitLog = execSync(`git log ${lastTag}..HEAD --pretty=format:"%s|%b|%h"`).toString();
    } catch {
      gitLog = execSync('git log --pretty=format:"%s|%b|%h"').toString();
    }

    const commits = gitLog.split('\n');
    const categories: Record<string, string[]> = {
      feat: [],
      fix: [],
      docs: [],
      style: [],
      refactor: [],
      perf: [],
      test: [],
      chore: [],
    };

    commits.forEach(line => {
      const [subject, body, hash] = line.split('|');
      const match = subject.match(/^(\w+)(?:\(.+\))?: (.+)/);
      
      if (match) {
        const type = match[1];
        const content = match[2];
        if (categories[type]) {
          categories[type].push(`- ${content} ([${hash}](https://github.com/prophetbase/repo/commit/${hash}))`);
        }
      }
    });

    let newContent = `# Changelog - ${new Date().toLocaleDateString()}\n\n`;

    const sectionTitles: Record<string, string> = {
      feat: '🚀 Features',
      fix: '🐛 Bug Fixes',
      docs: '📚 Documentation',
      perf: '⚡ Performance',
      chore: '🔧 Maintenance',
    };

    Object.entries(sectionTitles).forEach(([key, title]) => {
      if (categories[key].length > 0) {
        newContent += `## ${title}\n\n${categories[key].join('\n')}\n\n`;
      }
    });

    fs.writeFileSync(path.join(process.cwd(), 'CHANGELOG.md'), newContent);
    console.log('✅ CHANGELOG.md updated successfully.');

  } catch (error) {
    console.error('❌ Failed to generate changelog:', error);
  }
}

// generateChangelog();
