/**
 * ESLint 配置文件
 * @see https://eslint.org/docs/user-guide/configuring/configuration-files
 */
import globals from 'globals';
import js from '@eslint/js';

export default [
  // 忽略目录
  {
    ignores: ['dist', 'node_modules', '*.min.js', '*.min.css']
  },

  // JavaScript 基础配置
  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node,
        // 项目全局变量
        FlowToolkit: 'readonly',
        FT: 'readonly',
        oa: 'readonly',
        $: 'readonly',
        jQuery: 'readonly'
      }
    },

    rules: {
      // 错误级别
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-undef': ['error', {
        typeof: true
      }],

      // 风格规则
      'prefer-const': 'error',
      'no-var': 'error',
      'arrow-spacing': ['error', { before: true, after: true }],
      'comma-dangle': ['error', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: { parameters: 1 },
        FunctionExpression: { parameters: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
        ignoreComments: false
      }],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'no-trailing-spaces': ['error', { skipBlankLines: false }],
      'eol-last': ['error', 'always'],
      'newline-per-chained-call': ['off', { ignoreChainWithDepth: 4 }],

      // 最佳实践
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
      'no-alert': 'warn',
      'no-debugger': 'warn',

      // 模块规则
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type'
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }],

      // Prettier 兼容
      ...js.configs.recommended.rules
    }
  }
];
