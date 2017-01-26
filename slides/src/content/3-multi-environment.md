# The DefinePlugin and multi-environment builds

---

## `DefinePlugin`

- The `DefinePlugin` allows you to create global constants which can be configured at compile time. 

```js
// webpack.config.js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1"
})
```

Notes:

- Each key is an identifier or multiple identifiers joined with `.`
- If the value is a string it will be used as a code fragment.
- If the value isn't a string, it will be stringified (including functions).

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
- Use `devtool` option

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
- Very fast. Doesn't display line numbers correctly (mapped to transpiled code instead of original code).

`inline-source-map` 
- SourceMap added as DataUrl to the bundle (makes it much larger). Slow

`eval-source-map` 
- Initially slow, fast rebuild speed. Larger bundles (uses DataUrl). Line numbers are correctly mapped since it gets mapped to the original code.

`cheap-module-eval-source-map`
- Like `eval-source-map`, but faster and smaller because it doesn't have column mappings, it only maps line numbers.

---

## Source maps

### For production

`source-map` 
- SourceMap as a separate file. Adds a reference comment to the bundle (to link to file).

`hidden-source-map` 
- Same as source-map, but doesn't add a reference comment to the bundle (needs to be manually added to debug).

`cheap-source-map` 
- A SourceMap without column-mappings and ignoring loaded Source Maps.

`cheap-module-source-map` 
- A SourceMap without column-mappings, loaded Source Maps are single mapping per line

`nosources-source-map` 
- A SourceMap without the sourcesContent in it. Can be used to map stack traces on the client without exposing source code.

---

## Exercise

(Duration: 10 minutes)

Modify the build system in exercise-3 to have a development and production build (via seperate npm scripts) with appropriate source maps, plugins, and other relevant webpack config. 

Also the development build logs errors to console but production should post them to API, make API URLs configurable in webpack config.