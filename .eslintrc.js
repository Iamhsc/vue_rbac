module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    "indent": ["off", 2],
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0,
    'vue/script-indent': 'warning'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
