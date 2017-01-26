# Integrating Linting

---

## Javascript Linters

**JSLint**
- Oldest and easiest to use (no configuration)
- Not configurable and not extensible

**JSHint**
- Configurable and supports a configuration file
- Basic ES6 support

**JSCS**
- Configurable and easy to setup with presets
- Only detects coding style violations (doesn't detect errors like accidental globals or unused variables)
- Slowest of the four

---

## Javascript Linters

**ESLint**
- Newest and most popular, best ES6 support, and JSX support

- Highly configurable, more flexible and extensible than others, but can be slow

- Use with React via `eslint-plugin-react`

- Use with `babel-eslint` to lint class properties, decorators and types

- Optional JS comments to embed config info directly into JS file

- Optional JS, JSON or YAML config file
  - Could be `.eslintrc.*` file, `eslintConfig` property in `package.json`, or another config file specified via CLI
  - Generate config file with sensible defaults with `eslint --init`

---
## Javascript Linters

**ESLint**
- Use with webpack via `eslint-loader`
- Can use loader options in `webpack.config.js`, but these options are fed to `CLIEngine` (see [here](http://eslint.org/docs/developer-guide/nodejs-api#cliengine))
- Set as pre-loader to run before other loaders
- Options `emitErrors`, `emitWarnings`, `quiet`, `failOnWarning`, `failOnError`, and `outputReport` determine how warnings and errors are displayed and whether they fail the build

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{ loader: 'eslint-loader', options: { rules: { semi: 0 }, emitErrors: true, failOnError: true }],
      },
      ...
    ],
  }
  ...
};
```

---

## Typescript linters
**TSLint**
- Linter for Typescript, only popular choice
- Use with webpack via `tslint-loader`, use `tslint.json` (or custom) file for options
- Optionally pass loader options in `webpack.config.js` (currently must use the `LoaderOptionsPlugin`)
- Use `configuration.rules`, `configFile`, `emitErrors`, `failOnHint`, and other options (see full list [here](https://github.com/wbuchwalter/tslint-loader))
- Generate config file with sensible defaults with `tslint --init`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [{ loader: 'tslint-loader' }],
      }
    ],
    plugins: [
      new webpack.LoaderOptionsPlugin({ options: { tslint: { emitErrors: true, failOnHint: true } } })
    ]
  }
```

---

## CSS Linters
**CSSLint**
- Older tool for CSS linting

**Stylelint**
- Newer, more popular tool for CSS linting, use config file to enable and configure rules (typically `.stylelintrc`)
- For webpack don't use loader, use with `stylelint-webpack-plugin` instead
- Options via plugin config, `config`, `configFile`, `files`, `failOnError`, `quiet` and others (see full list [here](https://github.com/JaKXz/stylelint-webpack-plugin) and [here](http://stylelint.io/user-guide/node-api/#options))
- If it can't find your css files, try setting the `context` option

```js
module.exports = {
  module: {
    ...
    plugins: [
      new StyleLintPlugin({
        configFile: './.stylelintrc',
        files: ['src/**/*.css'],
        failOnError: false,
      }),
    ...
}
```

---

## Exercise

(Duration: 10 minutes)

Modify the build system in exercise-4 to use ESLint for JS files, TSLint for TS files, and Stylelint for CSS files