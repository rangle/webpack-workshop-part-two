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
- You can no longer configure a loader with a custom property in the top-level. It must be done through the `options`

```js
// Webpack 2
module.exports = { 
  ...
  module: { 
    use: [{ 
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
    use: [{ 
      test: /\.tsx?$/,
      loader: 'ts-loader'
      options:  { transpileOnly: false }
    }]
  }
}
```

---

