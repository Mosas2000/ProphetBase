const { execSync } = require('child_process');

const url = process.argv[2] || 'http://localhost:3000';
console.log(`Running Lighthouse audit for: ${url}`);

try {
  execSync(`npx lighthouse ${url} --output html --output-path ./lighthouse-report.html --quiet`, { stdio: 'inherit' });
  console.log('Lighthouse report generated: ./lighthouse-report.html');
} catch (err) {
  console.error('Lighthouse audit failed:', err.message);
  process.exit(1);
}
