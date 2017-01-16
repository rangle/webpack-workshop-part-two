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
- Newest and most popular with best ES6 support, and JSX support
- Highly configurable and more flexible and extensible than others, but can be slow
- Can use with React via `eslint-plugin-react`
- Can use with `babel-eslint` to support Class properties, decorators and types
- Can use JS comments to embed config info directly into a file. (enbale, disable, or configure rules)
- Can use a JS, JSON or YAML config file to specify config info for an entire directory and all of its subdirectories
  - This can be in the form of an `.eslintrc.*` file or an `eslintConfig` field in a `package.json` file, or you can specify a config file on the command line
- Can configure environments (each with it a certain set of predefined global variables), globals, and rules (which rules are enabled and at what error level)

---
## Javascript Linters

**ESLint**
- Use with webpack via `eslint-loader`, can use `.eslintrc.*` (or custom) file or an `eslintConfig` field in a `package.json` to pass options.
- Can also pass loader options in `webpack.config.js`, but these options are fed to `CLIEngine` (see [here](http://eslint.org/docs/developer-guide/nodejs-api#cliengine))
- Setting as pre-loader ensures it is run before other loaders
- Can use `emitErrors`, `emitWarnings`, `quiet`, `failOnWarning`, `failOnError`, and `outputReport` to determine how warnings and errors are displayed and whether they should fail the build

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
- Configurable and extensible linter for Typescript, only popular choice for Typescript linting
- Checks for readability, maintainability, and functionality errors
- Use with webpack via `tslint-loader`, can use `tslint.json` (or custom) file for options
- Can also pass loader options in `webpack.config.js` (currently must use the `LoaderOptionsPlugin`). Can use `configuration.rules`, `configFile`, `emitErrors`, `failOnHint`, and other options (see full list [here](https://github.com/wbuchwalter/tslint-loader)) to configure rules and error output, or fail the build on errors 

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
- Newer, more popular tool for CSS linting with many built in tools, use config file to enable and configure rules (typically `.stylelintrc`)
- To use with webpack use `stylelint-webpack-plugin`, load options via plugin, can use `config`, `configFile`, `files`, `failOnError`, `quiet` and others (see full list [here](https://github.com/JaKXz/stylelint-webpack-plugin) and [here](http://stylelint.io/user-guide/node-api/#options))

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
    ]
  }
}
```

---

## Exercise

(Duration: 10 minutes)

Modify the build system in exercise-4 to use ESLint for JS files, TSLint for TS files, and Stylelint for CSS files