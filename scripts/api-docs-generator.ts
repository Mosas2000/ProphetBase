/**
 * API Documentation Generator for ProphetBase
 * 
 * This script scans the API directory and TypeScript types to generate
 * an OpenAPI specification and documentation files.
 */

import fs from 'fs';
import path from 'path';

interface ApiRoute {
  path: string;
  method: string;
  description: string;
  parameters?: any[];
  responses: any;
}

class DocumentationGenerator {
  private routes: ApiRoute[] = [];

  constructor(private apiDir: string, private outputDir: string) {}

  public async generate() {
    console.log('🚀 Starting API documentation generation...');

    // 1. Scan API routes
    this.scanDirectory(this.apiDir);

    // 2. Generate OpenAPI Spec
    const spec = this.generateOpenApiSpec();
    
    // 3. Write files
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(this.outputDir, 'openapi.json'),
      JSON.stringify(spec, null, 2)
    );

    // 4. Generate Markdown documentation
    const markdown = this.generateMarkdown();
    fs.writeFileSync(path.join(this.outputDir, 'API_REFERENCE.md'), markdown);

    console.log(`✅ Documentation generated in ${this.outputDir}`);
  }

  private scanDirectory(dir: string) {
    // This is a simplified scanner
    // In a real implementation, it would use TypeScript Compiler API
    // to extract JSDoc/TSDoc annotations
    
    // Mocking some discovered routes based on the codebase
    this.routes = [
      {
        path: '/markets',
        method: 'GET',
        description: 'Get all prediction markets',
        parameters: [
          { name: 'status', in: 'query', type: 'string', description: 'Filter by status' },
          { name: 'limit', in: 'query', type: 'integer', description: 'Items per page' }
        ],
        responses: { 200: { description: 'Success' } }
      },
      {
        path: '/markets/{id}',
        method: 'GET',
        description: 'Get a specific market by ID',
        parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        responses: { 200: { description: 'Success' }, 404: { description: 'Not found' } }
      },
      {
        path: '/stats',
        method: 'GET',
        description: 'Get platform statistics',
        responses: { 200: { description: 'Success' } }
      }
    ];
  }

  private generateOpenApiSpec() {
    return {
      openapi: '3.0.0',
      info: {
        title: 'ProphetBase API',
        version: '1.0.0',
        description: 'Prediction market platform API documentation'
      },
      paths: this.routes.reduce((acc: any, route) => {
        const path = route.path;
        if (!acc[path]) acc[path] = {};
        acc[path][route.method.toLowerCase()] = {
          summary: route.description,
          parameters: route.parameters,
          responses: route.responses
        };
        return acc;
      }, {})
    };
  }

  private generateMarkdown() {
    let md = '# ProphetBase API Reference\n\n';
    md += 'Welcome to the formal API documentation for ProphetBase.\n\n';

    this.routes.forEach(route => {
      md += `## ${route.method} \`${route.path}\`\n\n`;
      md += `${route.description}\n\n`;
      
      if (route.parameters && route.parameters.length > 0) {
        md += '### Parameters\n\n';
        md += '| Name | In | Type | Description |\n';
        md += '|------|----|------|-------------|\n';
        route.parameters.forEach(p => {
          md += `| ${p.name} | ${p.in} | ${p.type} | ${p.description || '-'} |\n`;
        });
        md += '\n';
      }

      md += '### Responses\n\n';
      Object.entries(route.responses).forEach(([code, res]: [string, any]) => {
        md += `- **${code}**: ${res.description}\n`;
      });
      md += '\n---\n\n';
    });

    return md;
  }
}

// Execution
const generator = new DocumentationGenerator(
  path.join(process.cwd(), 'frontend/app/api'),
  path.join(process.cwd(), 'docs/generated')
);

// Note: Running in script mode
// generator.generate().catch(console.error);
