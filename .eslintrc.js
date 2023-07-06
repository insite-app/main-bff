module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        "browser": true,
        "es2021": true,
        "node": true,
        "jest": true,
    },
    extends: [
        "standard-with-typescript",
        "plugin:react/recommended",
        "eslint:recommended",
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
    plugins: [
        "react"
    ],
    rules: {
        "semi": ["error", "always"],
        "@typescript-eslint/semi": ["error", "always"],
    },
    settings: {
        "react": {
            "version": "detect"
        }
    },
    root: true,
}
