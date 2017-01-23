# Webpack 1 vs 2

---

## Main improvements in v2

- Native ES6 module support (& mixing CommonJS, AMD, ES6 modules, even in same file)
- Tree-shaking
- Configuration simplifications and improvements
- Better performance (maybe/eventually)

----

## Configuration change areas in v2

- Some property name/structure changes
- Loader config changes
- Plugin config changes (ExtractTextPlugin, OccurrenceOrderPlugin, UglifyJsPlugin)
- [See webpack 2 docs for full details](https://webpack.js.org/guides/migrating/)

---

### `resolve.*`:

- new `resolve.enforceExtension` property that when true requires imports to include file extension (defaults to false).  No longer need to add empty string to `resolve.extensions` to accomplish this
- `resolve.root`, `resolve.fallback`, `resolve.modulesDirectories` are combined into `resolve.modules`
- see [Resolve property docs](https://webpack.js.org/configuration/resolve/) for full details

---

### `module.loaders`  ->  `module.rules` and no automatic `-loader`:

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
          {
            loader: "css",
            query: {
              modules: true
            }
          }
        ]
      }
    ]
  }
``` 

---

### `module.loaders`  ->  `module.rules` and no automatic `-loader`:
- Can still use `module.loaders` for now if desired, though recommended to switch to `module.rules`
  - If using `module.loaders` can still use `!` chain for multiple loaders, if using `module.rules` must chain loaders as shown below
- `module.rules[i].loader` is optional shortcut to `module.rules[i].use.loader` 
  - For optional use if single loader in chain and it has no `options`, or the options are provided in the loader with `?` query string

```js
// Webpack 2
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
```

---

### `module.loaders`  ->  `module.rules` and no automatic `-loader`:

- If desired you can still fall back to the auto `-loader` style:

```js
resolveLoader: {
  moduleExtensions: ["-loader"]
}
```

### `json-loader` not required:

- When no loader has been configured for a JSON file, webpack will automatically try to load the JSON file with the `json-loader`

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
  devtool: "source-map",
  plugins: [
    new UglifyJsPlugin({
+     sourceMap: true
    })
  ]
```

### `UglifyJsPlugin` minimize loaders
- UglifyJsPlugin no longer switches loaders into minimize mode. The `minimize: true` setting needs to be passed via loader options

### `OccurrenceOrderPlugin` is now on by default
- It's no longer necessary to specify it in configuration

---

### `new ExtractTextPlugin({options})`

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
    loader: ExtractTextPlugin.extract['style-loader', 'css-loader?modules-true!postcss-loader!sass-loader-loader']
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