/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    'next',
    'turbo',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'prettier',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
    ],
    'import/newline-after-import': ['warn', { count: 1 }],
    'import/first': 'warn',
    semi: ['warn', 'never'],
    quotes: ['warn', 'single'],
    'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
    'eol-last': ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
    'import/order': [
      'warn',
      {
        pathGroups: [
          {
            pattern: '@acme/**',
            group: 'internal',
            position: 'before',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],
    'react/jsx-wrap-multilines': [
      'warn',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      },
    ],
    'react/jsx-indent': ['warn', 2, { indentLogicalExpressions: true }],
    'react/jsx-one-expression-per-line': ['warn', { allow: 'literal' }],
    'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],
    'react/jsx-indent-props': ['warn', 2],
    'jsx-quotes': ['warn', 'prefer-double'],
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: false,
      },
    ],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true,
          },
        },
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        overrides: {
          typeLiteral: {
            multiline: {
              delimiter: 'none',
              requireLast: false,
            },
          },
        },
      },
    ],
  },
  ignorePatterns: ['**/*.config.js', '**/*.config.cjs', 'packages/config/**'],
  reportUnusedDisableDirectives: true,
}

module.exports = config
