# Webpack 1 vs 2

---

## Main improvements in v2

- Native ES6 module support (& mixing CommonJS, AMD, ES6 modules, even in same file)

- Tree-shaking

- Configuration simplifications and improvements

- Better performance (maybe/eventually)

---

## Configuration change areas in v2

- Option name/structure changes

- Loader config changes

- Plugin config changes (ExtractTextPlugin, OccurrenceOrderPlugin, UglifyJsPlugin)

- [See webpack 2 docs for full details](https://webpack.js.org/guides/migrating/)

- Webpack 2 docs are a WIP but improving daily, Webpack 1 docs are still a good reference as well [see them here](http://webpack.github.io/docs/)

---

### `resolve.*`:

- Options that determine how modules are resolved (where to look for them)

- No longer need empty string in `resolve.extensions` (use new `resolve.enforceExtension` property instead)

```js
  resolve: {
-   extensions: ["", ".js", ".json"]
+   extensions: [".js", ".json"]
  }
```

- `resolve.root`, `resolve.fallback`, `resolve.modulesDirectories` combined into `resolve.modules`

```js
  resolve: {
-   root: path.join(__dirname, "src")
+   modules: [
+     path.join(__dirname, "src"),
+     "node_modules"
+   ]
  }
```

- See [Resolve property docs](https://webpack.js.org/configuration/resolve/) for full details

---

### `module.loaders`  ->  `module.rules`
- Can still use `module.loaders` for now if desired, though recommended to switch to `module.rules`

```js
// Webpack 1
  module: {
    loaders: [
      {
        test: /\.css$/,
      ...
  // Webpack 2
  module: {
      rules: [ 
        {
          test: /\.css$/,
      ...
``` 

---

### `module.loaders.loaders`  ->  `module.rules.use`

```js
// Webpack 1
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          {
            loader: "style"
          },
      ...
  // Webpack 2
  module: {
      rules: [ 
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
       ...
``` 

---

### `module.rules.loader` is optional shortcut to `module.rules.use.loader` 
 - For optional use if single loader in chain and it has no `options`, or the options are provided in the loader with `?` query string

```js
 module: {
      rules: [ 
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            }
        ...
  module: {
      rules: [ 
        {
          test: /\.css$/,
          loader: "style-loader"
        }
      ...
```

---

### no automatic `-loader`:

```js
// Webpack 1
        loaders: [
          {
            loader: "style"
          },
      ...
  // Webpack 2
        use: [
          {
            loader: "style-loader"
          },
      ...
``` 

- If desired you can still fall back to the auto `-loader` style by setting `resolveLoader.moduleExtensions`:

```js

resolveLoader: {
  moduleExtensions: ["-loader"]
}
```

---

### `json-loader` not required:

- When no loader has been configured for a JSON file, webpack will automatically try to load the JSON file with the `json-loader`

```js
 module: {
    rules: [
-     {
-       test: /\.json/,
-       loader: "json-loader"
-     }
    ]
  }
```

---

### `module.preLoaders` and `module.postLoaders` removed:

- Replaced with `module.rules.enforce` set to "pre" or "post"

```js
  module: {
-   preLoaders: [
    rules: [
      {
        test: /\.js$/,
+       enforce: "pre",
        loader: "eslint-loader"
      }
    ]
  }
```

---

### Loader configuration is through `options`:
- You can no longer configure a loader with a custom property in the top-level. It must be done through the `options`

```js
// Webpack 1
module.exports = { 
  ...
  module: { 
    loaders: [{ 
      test: /\.tsx?$/,
      loader: 'ts'
    }]
  },
  // does not work with webpack 2
  ts: { transpileOnly: false } 
}
```

---

### Loader configuration is through `options`:

```js
// Webpack 2
module.exports = { 
  ...
  module: { 
    rules: [{ 
      test: /\.tsx?$/,
      loader: 'ts-loader?' + JSON.stringify({ transpileOnly: false })
    }]
  }
}
```

or 

```js
module.exports = { 
  ...
  module: { 
    rules: [{ 
      test: /\.tsx?$/,
      loader: 'ts-loader'
      options:  { transpileOnly: false }
    }]
  }
}
```

---

#### `LoaderOptionsPlugin`
- Exists to help move from webpack 1 to webpack 2 (to save loaders from having to change to support Wepback 2)
  - Webpack schema for webpack.config.js is stricter
  - No longer open for extension loaders / plugins
  - Intention is to pass options directly to loaders / plugins. i.e. no shared/global options
  - Until all loaders updated to use options passed directly to them, the `loader-options-plugin` exists to bridge the gap
  - Can configure global/shared loader options with this plugin and all loaders will receive these options
  - In the future this plugin may be removed

```js
new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false,
  options: {
    context: __dirname
  }
})
```

---

### Chaining loaders

```js
// Webpack 1 loader chaining
module: {
  loaders: {
    test: /\.less$/,
    loader: "style-loader!css-loader!less-loader"
  }
}
```

```js
// Webpack 2 loader chaining with loader names
module: {
  rules: [
    {
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        "less-loader"
      ]
    }
  ]
}
```

---

### Chaining loaders

```js
// Webpack 2 loader chaining with configuration objects for each loader
module: {
  rules: [
    {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'less-loader',
          options: {
            noIeCompat: true
          }
        }
      ]
    }
  ]
}
```

---

### `UglifyJsPlugin` `sourceMap`
- The `sourceMap` option of the `UglifyJsPlugin` now defaults to false instead of true. This means that if you are using source maps for minimized code, you need to set `sourceMap: true` for `UglifyJsPlugin`

```js
  devtool: "source-map", // even with this devool option set, you still need the plugin option below
  plugins: [
    new UglifyJsPlugin({
+     sourceMap: true
    })
  ]
```

### `UglifyJsPlugin` minimize loaders
- UglifyJsPlugin no longer switches loaders into minimize mode. The `minimize: true` setting needs to be passed via loader options

---

### `ExtractTextPlugin({options})`

```js
// Webpack 1
plugins: [
  new ExtractTextPlugin("bundle.css", {allChunks: true, disable: false})
]
```

```js
// Webpack 2
plugins: [
 new ExtractTextPlugin({
     filename: "bundle.css",
     disable: false,
     allChunks: true
    })
]
```

---

### `ExtractTextPlugin.extract`

```js
// Webpack 1
module: {
  rules: [
    test: /.css$/,
    loader: ExtractTextPlugin.extract['style-loader', 'css-loader']
  ]
}
```

```js
// Webpack 2
module: {
  rules: [
    test: /.css$/,
    loader: ExtractTextPlugin.extract({
               fallbackLoader: "style-loader",
               loader: "css-loader"
     })
  ]
}
```

---

### `ExtractTextPlugin.extract`

```js
// Webpack 1
module: {
  rules: [
    test: /.css$/,
    loader: ExtractTextPlugin.extract['style-loader', 'css-loader?modules=true!postcss-loader!sass-loader']
  ]
}
```

```js
// Webpack 2
var loaders = [
  { loader: 'css-loader', options: { modules: true } },
  { loader: 'postcss-loader' },
  { loader: 'sass-loader' }
]

module: {
  rules: [
    test: /.css$/,
    loader: ExtractTextPlugin.extract({
               fallbackLoader: "style-loader",
               loader: loaders
     })
  ]
}
```

---

## Exercise

(Duration: 10 minutes)

Modify the build system in exercise-2 from Webpack 1 to Webpack 2