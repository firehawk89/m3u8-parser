import js from '@eslint/js';
import eslintConfigPrettierFlat from 'eslint-config-prettier/flat';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{
		ignores: ['.wrangler', '**/*.d.ts', 'dist', 'node_modules'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js, perfectionist },
		extends: ['js/recommended', eslintConfigPrettierFlat],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.serviceworker,
				fetch: 'readonly',
				Request: 'readonly',
				Response: 'readonly',
				Headers: 'readonly',
				caches: 'readonly',
			},
		},
	},
	tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'prefer-const': 'error',
			'no-useless-catch': 'warn',
			'no-useless-escape': 'error',
			curly: ['error', 'all'],
			'max-lines-per-function': [
				'warn',
				{
					max: 120,
					skipBlankLines: true,
					skipComments: true,
				},
			],
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'natural',
					order: 'asc',
				},
			],
		},
	},
]);
