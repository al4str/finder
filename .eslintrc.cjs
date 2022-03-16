const basicOptions = {
  ecmaVersion: 2021,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const basicPlugins = [
  'import',
  'react',
  'react-hooks',
];

const basicExtends = [
  'eslint-config-airbnb-base',
  'plugin:react/recommended',
];

const basicRules = {
  'arrow-body-style': 'off',
  'arrow-parens': [
    'error',
    'always',
  ],
  'brace-style': [
    'error',
    'stroustrup',
  ],
  'camelcase': [
    'off',
    {
      'properties': 'always',
    },
  ],
  'consistent-return': 'warn',
  'func-names': [
    'error',
    'never',
  ],
  'function-paren-newline': [
    'error',
    'consistent',
  ],
  'import/extensions': [
    'error',
    {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
      json: true,
    },
  ],
  'import/order': 'off',
  'import/no-extraneous-dependencies': 'warn',
  'import/no-named-as-default': 'off',
  'import/no-unresolved': [
    'error',
    {
      'ignore': [
        '^@',
      ],
    },
  ],
  'import/prefer-default-export': 'off',
  'lines-between-class-members': 'off',
  'linebreak-style': [
    'error',
    'unix',
  ],
  'max-len': 'off',
  'max-classes-per-file': 'off',
  'no-console': [
    'warn',
    {
      'allow': [
        'warn',
        'error',
      ],
    },
  ],
  'no-extend-native': 'error',
  'no-global-assign': 'error',
  'no-param-reassign': [
    'error',
    {
      props: false,
    },
  ],
  'no-underscore-dangle': 'off',
  'no-use-before-define': [
    'error',
    {
      'functions': false,
      'classes': false,
    },
  ],
  'no-unused-vars': [
    'error',
    {
      ignoreRestSiblings: true,
    },
  ],
  'object-curly-newline': 'off',
  'quote-props': [
    'error',
    'consistent-as-needed',
  ],
  'operator-linebreak': [
    'error',
    'before',
  ],
  'prefer-destructuring': 'off',
  'radix': 'off',
  'react/destructuring-assignment': 'off',
  'react/display-name': 'off',
  'react/jsx-filename-extension': [
    'warn',
    {
      'extensions': ['.js', '.jsx', '.tsx'],
    },
  ],
  'react/jsx-props-no-spreading': 'off',
  'react/jsx-uses-react': 'off',
  'react/prop-types': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/require-default-props': 'off',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'space-before-function-paren': [
    'error',
    {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always',
    },
  ],
  'spaced-comment': 'off',
};

const basicSettings = {
  'import/parser': '@typescript-eslint/parser',
  'import/resolver': {
    webpack: {
      config: 'webpack.config.cjs',
    },
  },
  react: {
    version: 'detect',
  },
};

const basicGlobals = {
  'process': 'readonly',
  'window': 'readonly',
  'self': 'readonly',
  'document': false,
  'navigator': false,
};

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parserOptions: basicOptions,
      plugins: [...basicPlugins],
      extends: [...basicExtends],
      settings: basicSettings,
      globals: basicGlobals,
      rules: basicRules,
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        ...basicOptions,
        tsconfigRootDir: process.cwd(),
        project: './tsconfig.json',
      },
      plugins: [...basicPlugins, '@typescript-eslint'],
      extends: [
        ...basicExtends,
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
      ],
      settings: basicSettings,
      globals: basicGlobals,
      rules: {
        ...basicRules,
        'no-shadow': ['off'],
        'no-unused-vars': ['off'],
        'no-use-before-define': ['off'],
        'no-void': ['off'],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unsafe-call': ['off'],
        '@typescript-eslint/no-unsafe-return': ['off'],
        '@typescript-eslint/no-unsafe-assignment': ['off'],
        '@typescript-eslint/no-unsafe-member-access': ['off'],
        '@typescript-eslint/restrict-template-expressions': ['off'],
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-cycle': ['off'],
      },
    },
  ],
};
