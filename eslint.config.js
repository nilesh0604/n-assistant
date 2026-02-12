import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        chrome: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // General rules
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        chrome: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // General rules for TypeScript
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // TypeScript handles this
    },
  },
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      'vite.config.*',
      'tailwind.config.*',
    ],
  },
];
