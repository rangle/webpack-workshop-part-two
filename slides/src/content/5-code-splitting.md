# Code-splitting

---

## Introduction

- Intermediate build products (collections of modules) are called **chunks** and final build files (also colletions of modules) are **bundles**
- Two main purposes for code-splitting in Webpack which results in two types of code-splitting
- Resource splitting (to improve Parallel loading and Caching)
  - Specify split points in configuration
  - Split JS code into different bundles (like application and vendor) to aid Caching
  - Portions of the code that don't change much (like vendor code) can be stored in seperate bundle and held in cache longer
  - For multi-page apps can split the JS into multiple bundles, each bundle to be loaded with the appropriate page
  - Split CSS from JS improving cacheability of the CSS and allowing it to be loaded in parallel with the JS
- On-demand splitting
  - Specify split points in application logic to allow on-demand loading of bundles as needed (e.g. load a bundle when routing or on another event)
  - Uses `require.ensure()` or `import()` to specify split-points, webpack splits the modules and dependencies inside into a new chunk
- Both splitting approaches allow splitting code into bundles to improve page load time (a bundle loaded quickly to allow some content to be shown sooner, and another bundle loaded later for less urgent code)
- Can use with `CommonsChunkPlugin` to reduce code-size (reduce code redundancy and move it to single chunk), and/or `DllPlugin`/`DllReferencePlugin` for build-time performance (store/use cached built vendor/library bundles)

---

## Resource splitting (single-page multi-bundle)

- Multiple bundles (helps with Caching) accomplished via multiple entry points (each with own dependency graph)
- In the below case both output bundles will have `moment` code (need to use `CommonsChunkPlugin` to remove this redundancy and allow caching improvement)

```js
// webpack.config.js
        entry: {
            main: './index.js',
            vendor: 'moment'
        },
        output: {
            filename: '[chunkhash].[name].js',
            path: './dist'
        }
    }
};
```

```html
<!-- index.html -->
<script src="vendor.js" charset="utf-8"></script>
<script src="app.js" charset="utf-8"></script>
```

---

## Resource splitting (multi-page single-bundle)

- Multiple-page app has multiple html pages that can each load their own JS

```js
entry: {
    pageOne: './src/pageOne/index.js', // each page has a set of source files in its own folder with entry point index.js
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

```html
<!-- pageOne.html -->
<script src="pageOne.js" charset="utf-8"></script>

<!-- pageTwo.html -->
<script src="pageTwo.js" charset="utf-8"></script>

<!-- pageThree.html -->
<script src="pageThree.js" charset="utf-8"></script>
```

---

## `CommonsChunkPlugin`

- Extracts all common modules from source chunks and puts them in a common chunk. If it doesn't already exist, then creates a new one
- Webpack creates runtime and manifest code, and when `CommonsChunkPlugin` is used this code is placed in the common chunk.  
- To enable long-term caching, add another common chunk so this code is stored in a seperate chunk and doesn't cause the primary common chunk to change with every build.  An alternative is to have the manifest output to a seperate file via a plugin like `ChunkManifestPlugin`

```js
var webpack = require('webpack');
module.exports = function(env) {
    return {
        entry: {
            main: './index.js',
            vendor: 'moment'
        },
        output: {
            filename: '[chunkhash].[name].js',
            path: './dist'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'] // Specify the common bundle and add a second to store webpack runtime code
            })                                // the plugin is run once for each entry, 
        ]                                     // and the runtime/manifest will be stored in the final entry
    }
}
```

---

## `CommonsChunkPlugin`

- The Common chunk(s) become the parent chunks of the source chunks
- Use options (full list [here](https://webpack.js.org/plugins/commons-chunk-plugin/)) to tailor to use-case (see plugin source [here](https://github.com/webpack/webpack/blob/master/lib/optimize/CommonsChunkPlugin.js))
- `name` or `names` specify the name(s) of common chunk(s)
    - If matches existing chunk(s), then that chunk(s) will be the common chunk(s) (multiple `names` result in multiple runs of the plugin)
    - If the `name` doesn't match an existing chunk then a new chunk will be created with matching name(s)
    - If omitted and `children` or `async` is set then all chunks are used
- `filename` specifies the filename to use for the common bundle(s)
    - If omitted then the original output.filename or output.chunkFilename is used
    - Can contain the same placeholders as output.filename
- `minChunks` specifies how many modules must share a common chunk before that chunk is pulled into the common chunk (can be `number`, `Infinity`, or `(module, count) => boolean`). Set to `Infinity` to create a common chunk but prevent any other chunks added to it
- `minSize` specifies the minimum size that the combination of common modules must be before a common chunk is created to contain them
- `chunks` the array of source chunks (if omitted all entry chunks are used)
- `children` if set to `true`, overrides `chunks`, and all children of the common chunk are sources (common modules moved up to parent common chunk)
- `async` if set to `true`, a seperate chunk is created as a child of the common chunk, this async chunk will contain all the common modules and will be loaded in parallel, set to a `string` to name that async bundle

---

## On-demand splitting (with `require.ensure()`, AMD `require()`, or `import()`)

- Webpack parses for `require.ensure()`, the AMD `require()`, or ES6 `import()` in the code while building and adds the modules into a separate chunk
- This new chunk is loaded on demand by webpack through Jsonp (when `target` is `web`).

```js
require.ensure(dependencies: String[], callback: function(require), chunkName: String) // Standard Webpack v1 approach
require(dependencies: String[], callback: function(depedency-exports))                 // AMD require approach
import(dependency : String) : Promise                                                  // ES6 System.import approach
```

- The dependencies are placed in a different chunk (can be another existing chunk for `require.ensure()`)
- When using `require.ensure()` 
    - The dependencies are loaded first (but not executed), then the callback is executed
    - Callback is passed implementation of `require` (still need to `require` modules from depedencies to evaluate and use exports)
    - The split chunk can be named by the optional 3rd parameter (if existing then same instance is used).  This is the only approach that allows that
- When using `require()` (AMD)
    - The dependencies are loaded and executed and their exports are then passed to the optional callback
- When using `import()`
    - The function loads the module and returns a `Promise`.  Allows load failure to be handled
    - Can load multiple modules in parallel via `Promise.all()`

---

## On-demand splitting (with `require.ensure()`, AMD `require()`, or `import()`)

```js
require.ensure(["module-a", "module-b"], function() {
  var a = require("module-a");
  ...
});
```
- `module-a` and `module-b` are loaded asynchronously (but not executed) then the callback function is called, within callback module-a is executed

```js
// AMD require
require(["module-a", "module-b"], function(a, b) {
  ...
});
```
- `module-a` and `module-b` are loaded and executed asynchronously then the callback function is called and passed the exports of both modules

```js
import("./module-a").then(module => {
    return module.default;
}).catch(err => {
    console.log("Chunk loading failed");
});
```
- `module-a` is loaded and executed asynchronously and a `Promise` is returned

---

## CSS splitting (with `ExtractTextPlugin`)

Advantages:
- Fewer style tags (older IE has a limit)
- CSS SourceMap (with `devtool: "source-map"` and `css-loader?sourceMap`)
- CSS requested in parallel
- CSS cached separate
- Faster runtime (less code and DOM operations)

Caveats:
- Additional HTTP request
- Longer compilation time
- More complex configuration
- No runtime public path modification
- No Hot Module Replacement

---

## CSS splitting (with `ExtractTextPlugin`)

```js
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: './main.js',
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract({ loader: 'css-loader' })
        }]
    },
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin({ filename: 'bundle.css', disable: false, allChunks: true })
    ]
}
```

---

## CSS splitting (with `ExtractTextPlugin`)

```js
new ExtractTextPlugin(options: filename | object) // plugin
```

- `options.filename: string` (required) the filename of the result file. May contain `[name]`, `[id]` and `[contenthash]`
    - `[contenthash]`: a hash of the content of the extracted file
- `options.allChunks: boolean` extract from all additional chunks too (by default it extracts only from the initial chunk(s))
- `options.disable: boolean` disables the plugin
- `options.id: string` Unique ident for this plugin instance. (For advanced usage only, by default automatically generated)

```js
ExtractTextPlugin.extract(options: loader | object) // loader
```
- Creates an extracting loader from an existing loader. Supports loaders of type `{ loader: string; query: object }`
- `options.loader: string | object | loader[]` (required) the loader(s) to use for converting the resource to a css exporting module
- `options.fallbackLoader: string | object | loader[]` the loader(s) to use when the css is not extracted (i.e. in an additional chunk when `allChunks: false`)
- `options.publicPath: string` override the `publicPath` setting for this loader

---

## CSS splitting (with `ExtractTextPlugin`)

- There is also an `extract()` method on the instance which can be used for multiple plugin usage

```js
let ExtractTextPlugin = require('extract-text-webpack-plugin');

// multiple extract instances
let extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
let extractLESS = new ExtractTextPlugin('stylesheets/[name].less');

module.exports = {
  ...
  module: {
    loaders: [
      { test: /\.scss$/i, loader: extractCSS.extract(['css','sass']) },
      { test: /\.less$/i, loader: extractLESS.extract(['css','less']) },
      ...
    ]
  },
  plugins: [
    extractCSS,
    extractLESS
  ]
};
```

---

## `DllPlugin` and `DllReferencePlugin`

- Provides another approach to resource code-splitting for improved caching and faster build times
- Build vendor code into library bundle(s) (basically a mapping function that loads the appropriate vendor module from an id), on subsequent rebuilds where vendor code hasn't changed, the library bundle(s) is reused and the build is faster
- Library bundle(s) can be long-term cached
- Use two webpack config files, one for building library bundle(s) and other for building application
- Use `DllPlugin` in webpack config to build library bundle and `DllReferencePlugin` in application bundle to reference it

```js
// app.webpack.config.js
var webpack = require('webpack');
module.exports = {
  entry: {
    app: ['./app'],
  },
  output: {
    filename: 'app.bundle.js',
    path: 'build/',
  },
  plugins: [new webpack.DllReferencePlugin({
    context: '.',
    manifest: require('./build/vendor-manifest.json'),
  })]
};
```

---

## `DllPlugin` and `DllReferencePlugin`

```js
// vendor.webpack.config.js
var webpack = require('webpack');
module.exports = {
  entry: { vendor: ['./vendor'] },
  output: {
    filename: 'vendor.bundle.js',
    path: 'build/',
    library: 'vendor_lib',
  },
  plugins: [new webpack.DllPlugin({
    name: 'vendor_lib',
    path: 'build/vendor-manifest.json',
  })]
};
```
- `manifest`: manifest file contains mapping from library bundle ids to actual module
- `path`: absolute path to the manifest json file
- `name`: name of the exposed dll function (keep consistent with output.library)
- `context` (optional): context of requests in the manifest file, defaults to the webpack context
- vs `CommonsChunkPlugin` the vendor code doesn't need to be recompiled every build
- Which is better?  Depends on priorities.  Easy to experiment


