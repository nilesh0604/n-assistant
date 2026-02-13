import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

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
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        performance: 'readonly',
        fetch: 'readonly',
        crypto: 'readonly',
        URL: 'readonly',
        // DOM globals
        Node: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        ShadowRoot: 'readonly',
        HTMLIFrameElement: 'readonly',
        getEventListeners: 'readonly',
        // Node.js globals (for background scripts)
        __dirname: 'readonly',
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
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // project: ['./chrome-extension/tsconfig.json', './packages/*/tsconfig.json', './pages/*/tsconfig.json'],
      },
      globals: {
        chrome: 'readonly',
        console: 'readonly',
        process: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        performance: 'readonly',
        fetch: 'readonly',
        crypto: 'readonly',
        URL: 'readonly',
        // DOM globals
        Node: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        ShadowRoot: 'readonly',
        HTMLIFrameElement: 'readonly',
        getEventListeners: 'readonly',
        // Node.js globals (for background scripts)
        __dirname: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // General rules for TypeScript
      'no-console': 'off',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // TypeScript handles this
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
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
