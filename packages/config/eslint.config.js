// Shared ESLint flat config for every workspace. The repo root re-exports it, and ESLint finds the
// root file from any package, so one config covers the whole monorepo.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/.turbo/**', '**/node_modules/**'],
  },

  js.configs.recommended,

  // Type-aware rules catch bugs plain linting cannot, e.g. a forgotten `await` on a DB call.
  tseslint.configs.recommendedTypeChecked,
  { languageOptions: { parserOptions: { projectService: true } } },

  {
    rules: {
      // CLAUDE.md: no `any`, no `@ts-ignore`.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-expect-error': 'allow-with-description',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Use the Pino logger on the server; console output skips redaction.
      'no-console': 'error',
    },
  },

  // React: rules of hooks (no hooks inside conditions/loops, complete effect dependencies).
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat['recommended-latest']],
    languageOptions: { globals: globals.browser },
  },

  // Plain JS config files are not part of any tsconfig, so type-aware rules cannot run on them.
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },

  // Last: turn off style rules that Prettier owns.
  prettier,
);
