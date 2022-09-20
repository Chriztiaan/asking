module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    '@nuxtjs/eslint-config-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    '@vue/prettier',
  ],
  // add your custom rules here
  rules: {
    'vue/multi-word-component-names': 0,
    eqeqeq: 'off',
    'no-return-assign': 'off',
    'no-console': 'off',
  },
}
