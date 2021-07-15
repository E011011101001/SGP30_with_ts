module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  globals: {
    window: true,
    module: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'never',
      {
        beforeStatementContinuationChars: 'any'
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',                                                   
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': [
      'warn',
      { 
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_'
      } 
    ],  
    'quote-props': ['warn', 'as-needed'],
    indent: ['warn', 2],
    'no-console': [
      'warn'
    ],  
    'no-debugger': [
      'warn'
    ],  
    'no-useless-constructor': ['warn'],
    'space-before-function-paren': ['warn', 'always'],
    'space-before-blocks': ['warn', 'always'],
    'space-infix-ops': 'warn',
    'key-spacing': [
      'warn',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict'
      }
    ], 
    'comma-spacing': [
      'warn',
      {
        before: false,
        after: true
      }
    ], 
    'arrow-spacing': [
      'warn',
      {
        before: true,
        after: true
      }
    ], 
    'object-curly-spacing': ['warn', 'always'],
    'eol-last': ['warn', 'always']
  }
}
