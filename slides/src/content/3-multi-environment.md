# The DefinePlugin and multi-environment builds

---

## `DefinePlugin`

- The `DefinePlugin` allows you to create global constants which can be configured at compile time. This can be very useful for allowing different behaviour between builds for different environments

```js
// webpack.config.js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1",
  "typeof window": JSON.stringify("object")
})
```

- Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with alternate quotes, such as `'"production"'`, or by using `JSON.stringify('production')`
- Each key passed into `DefinePlugin` is an identifier or multiple identifiers joined with `.`
- If the value is a string it will be used as a code fragment.
- If the value isn't a string, it will be stringified (including functions).
- If the value is an object all keys are defined the same way.
- If you prefix `typeof` to the key, it's only defined for `typeof` calls.

---

## `DefinePlugin`

- The values will be inlined allowing a minification pass to remove redundant conditionals.

```js
// any js source file with webpack.config.js as defined in previous slide
if (!PRODUCTION) {
  console.log('Debug info')
}
if (PRODUCTION) {
  console.log('Production log')
}
```

- After minification the above becomes:

```js
console.log('Production log')
```

---

## Passing environment variables

- You can set environment variables in your npm scripts (in package.json):

```js
// package.json
...
"scripts": {
  "build": "cross-env NODE_ENV=production webpack --config webpack-aot.config.js",
  "build:jit": "cross-env NODE_ENV=production webpack",
  "start": "cross-env NODE_ENV=production http-server ./dist",
}
...
```

-  Then you can use these in your web.config.js and forward them into your source-code via `DefinePlugin`

```js
// webpack.config.js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1",
  "typeof window": JSON.stringify("object")
})
```