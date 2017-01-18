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
  "build": "cross-env NODE_ENV=production webpack",
  "build:dev": "cross-env NODE_ENV=development webpack",
  "start:dev": "cross-env NODE_ENV=development webpack-dev-server",
  "start": "cross-env NODE_ENV=production http-server ./dist",
}
...
```

-  Then you can use these in your web.config.js and forward them into your source-code via `DefinePlugin`

```js
// webpack.config.js
...
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
  DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === 'development')
})
...
```

---

## Passing environment variables

-  You can also have different webpack configuration based on build type

```js
const devPlugins = [
  new StyleLintPlugin({
    configFile: './.stylelintrc',
    files: ['src/**/*.css']
  }),
];
const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
  }),
];

module.exports = {
 ... 
 output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.env.NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js',
    sourceMapFilename: process.env.NODE_ENV === 'production' ? '[name].[chunkhash].js.map' : '[name].js.map',
  plugins: 
    process.env.NODE_ENV === 'production' ? prodPlugins : devPlugins;
```

- Note: [chunkhash] slows down build time and is only useful to improve caching so only use it for production builds

---

## Source maps

| devtool |	build |	rebuild |	production | quality |
|---------|-------|---------|------------|---------|
| `eval` | +++ | +++ | no |	generated code |
| `cheap-eval-source-map` |	+ |	++ | no |	transformed code (lines only) |
| `cheap-source-map` | + | o | yes | transformed code (lines only) |
| `cheap-module-eval-source-map` | o | ++ |	no | original source (lines only) |
| `cheap-module-source-map` |	o |	-	 | yes | original source (lines only) |
| `eval-source-map` |	-- | + | no |	original source |
| `source-map` | -- |	--	| yes |	original source |
| `nosources-source-map` | -- |	-- | yes |	without source content |

---

## Source maps

### For development

`eval` 
- Each module is executed with `eval()` and `//@ sourceURL`. This is very fast. The main disadvantage is that it doesn't display line numbers correctly since it gets mapped to transpiled code instead of the original code.

`inline-source-map` 
- A SourceMap is added as DataUrl to the bundle.

`eval-source-map` 
- Each module is executed with `eval()` and a SourceMap is added as DataUrl to the `eval()`. Initially it is slow, but it provides fast rebuild speed and yields real files. Line numbers are correctly mapped since it gets mapped to the original code.

`cheap-module-eval-source-map`
- Like `eval-source-map`, each module is executed with `eval()` and a SourceMap is added as DataUrl to the `eval()`. It is "cheap" because it doesn't have column mappings, it only maps line numbers.

---

## Source maps

### For production

`source-map` 
- A full SourceMap is emitted as a separate file. It adds a reference comment to the bundle so development tools know where to find it.

`hidden-source-map` 
- Same as source-map, but doesn't add a reference comment to the bundle. Useful if you only want SourceMaps to map error stack traces from error reports, but don't want to expose your SourceMap for the browser development tools.

`cheap-source-map` 
- A SourceMap without column-mappings ignoring loaded Source Maps.

`cheap-module-source-map` 
- A SourceMap without column-mappings that simplifies loaded Source Maps to a single mapping per line.

`nosources-source-map` 
- A SourceMap is created without the sourcesContent in it. It can be used to map stack traces on the client without exposing all of the source code.

---

## Exercise

(Duration: 10 minutes)

Modify the build system in exercise-3 to have a development and production build with appropriate source maps, and plugins