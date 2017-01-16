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
- Newest and most popular
- Best ES6 support and also has JSX support
- Highly configurable and more flexible and extensible than others
- Can be slow
- Can use with React via `eslint-plugin-react`
- Can use with `babel-eslint` to support Class properties, decorators and types
- Configuration Comments - use JavaScript comments to embed configuration information directly into a file.
- Configuration Files - use a JavaScript, JSON or YAML file to specify configuration information for an entire directory and all of its subdirectories. This can be in the form of an .eslintrc.* file or an eslintConfig field in a package.json file, both of which ESLint will look for and read automatically, or you can specify a configuration file on the command line.
There are several pieces of information that can be configured:

- Environments - which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.
- Globals - the additional global variables your script accesses during execution.
- Rules - which rules are enabled and at what error level.

---

## Typescript linters
**TSLint**
- Configurable and extensible linter for Typescript
- Only popular choice for Typescript linting
- Checks for readability, maintainability, and functionality errors
- Can use with 

---

## CSS Linters
**CSSLint**
- Older tool for CSS linting

**Stylelint**
- Newer, more popular tool for CSS linting