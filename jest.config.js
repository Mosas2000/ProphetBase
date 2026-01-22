module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/frontend'],
    testMatch: ['**/__tests__/**/*.test.ts?(x)'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/frontend/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/frontend/jest.setup.ts'],
    collectCoverageFrom: [
        'frontend/**/*.{ts,tsx}',
        '!frontend/**/*.d.ts',
        '!frontend/**/*.stories.tsx',
        '!frontend/**/__tests__/**',
        '!frontend/node_modules/**',
        '!frontend/.next/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                },
            },
        ],
    },
};
