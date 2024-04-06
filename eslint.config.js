import globals from "globals";

export default {
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.mocha,
      it: "readonly",
      describe: "readonly"
    }
  },
  rules: {
    complexity: [1, {"max": 25}],
    curly: [1, "multi-line"],
    "default-case": 1,
    "dot-notation": 1,
    eqeqeq: [1, "smart"],
    "guard-for-in": 1,
    "no-alert": 2,
    "no-caller": 2,
    "no-case-declarations": 2,
    "no-div-regex": 2,
    "no-else-return": 2,
    "no-empty-pattern": 2,
    "no-eq-null": 0,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-extra-label": 1,
    "no-fallthrough": 1,
    "no-floating-decimal": 1,
    "no-global-assign": 2,
    "no-implicit-globals": 1,
    "no-implied-eval": 2,
    "no-invalid-this": 2,
    "no-iterator": 2,
    "no-labels": 2,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-magic-numbers": "off",
    "no-multi-spaces": 1,
    "no-multi-str": 2,
    "no-native-reassign": 2,
    "no-new": 2,
    "no-new-func": 2,
    "no-new-wrappers": 2,
    "no-octal": 1,
    "no-octal-escape": 1,
    "no-param-reassign": 0,
    "no-process-env": "off",
    "no-proto": 2,
    "no-redeclare": 2,
    "no-return-assign": 1,
    "no-script-url": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-throw-literal": 2,
    "no-unused-expressions": 2,
    "no-unused-labels": 2,
    "no-useless-call": 2,
    "no-useless-concat": 2,
    "no-void": 2,
    "no-with": 2,
    "prefer-promise-reject-errors": 1,
    "radix": 2,
    "wrap-iife": [1, "any"],
    yoda: [2, "never", {"onlyEquality": true}],
    "comma-dangle": 0,
    "no-cond-assign": 2,
    "no-console": "off",
    "no-constant-condition": 2,
    "no-control-regex": 2,
    "no-debugger": 2,
    "no-dupe-args": 2,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-empty": 2,
    "no-empty-character-class": 2,
    "no-ex-assign": 2,
    "no-extra-boolean-cast": 2,
    "no-extra-parens": "off",
    "no-extra-semi": 2,
    "no-func-assign": 2,
    "no-inner-declarations": 2,
    "no-invalid-regexp": 2,
    "no-irregular-whitespace": 2,
    "no-obj-calls": 2,
    "no-regex-spaces": 2,
    "no-sparse-arrays": 2,
    "no-template-curly-in-string": 2,
    "no-unexpected-multiline": 2,
    "no-unreachable": 2,
    "no-unsafe-finally": 2,
    "no-unsafe-negation": 2,
    "use-isnan": 2,
    "valid-jsdoc": 0,
    "valid-typeof": 2,
    "strict": "off",
    "no-catch-shadow": 2,
    "no-delete-var": 2,
    "no-label-var": 2,
    "no-shadow": 2,
    "no-shadow-restricted-names": 1,
    "no-undef": 2,
    "no-undef-init": 2,
    "no-undefined": "off",
    "no-unused-vars": 1,
    "no-use-before-define": [2, {"functions": false}]
  }
};