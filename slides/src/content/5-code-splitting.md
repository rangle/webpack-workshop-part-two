# Code-splitting

---

## Introduction

- Two types of code-splitting in webpack
- Resource splitting (to improve Parallel loading and Caching), done via config
- On-demand splitting, done in logic
  - Specify split-points in app logic for on-demand loading, webpack splits the modules and dependencies inside into a new chunk
- Both splitting approaches allow splitting code into bundles to improve page load time (a bundle loaded quickly to allow some content to be shown sooner, and another bundle loaded later for less urgent code)
- Can use with `CommonsChunkPlugin` to reduce code-size (reduce code redundancy and move it to single chunk)
- Or can use `DllPlugin`/`DllReferencePlugin` for better build-time performance (store/cache built vendor library bundles)

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
- Use options (full list [here](https://webpack.js.org/plugins/commons-chunk-plugin/)) to tailor to use-case (see plugin source [here](https://github.com/webpack/webpack/blob/master/lib/optimize/CommonsChunkPlugin.js))

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

Notes:

- To enable long-term caching, add another common chunk so this code is stored in a seperate chunk and doesn't cause the primary common chunk to change with every build.  An alternative is to have the manifest output to a seperate file via a plugin like `ChunkManifestPlugin`
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

## Long-term Caching

- See [here](https://webpack.js.org/guides/caching/) for detailed notes about long-term caching

- Use `[chunkhash]` to add a content-dependent cache-buster to each bundle
- Extract the webpack manifest into a separate file with `chunk-manifest-webpack-plugin`
- Help make hashes more deterministic by file content (via more deterministic generated internal ids), use `NamedModulesPlugin` (recommended for development) and `HashedModuleIdsPlugin` (recommended for production)
- Use better hash algorithm via `webpack-chunk-hash` or `webpack-md5-hash` plugins
- Try to ensure that the entry point chunk (with the bootstrapping code) doesn’t change hash over time for the same set of dependencies

For even more optimized setup:

- Use compiler stats to get the file names when requiring resources in HTML or use `html-webpack-plugin` to place them automatically
- Generate the chunk manifest JSON and inline it into the HTML page before loading resources (by using  `html-webpack-plugin` with `script-ext-html-webpack-plugin` or `inline-manifest-webpack-plugin`)



---

## On-demand splitting (with `require.ensure()`, or `import()`)

- Webpack parses for `require.ensure()`, or ES6 `import()` in the code while building and adds the modules into a separate chunk
- This new chunk is loaded on demand (and async) by webpack through Jsonp (when `target` is `web`).

```js
require.ensure(dependencies: String[], callback: function(require), chunkName: String) // Standard Webpack v1 approach
import(dependency : String) : Promise                                                  // ES6 System.import approach
```

Notes:

- The dependencies are placed in a different chunk (can be another existing chunk for `require.ensure()`)
- When using `require.ensure()` 
    - The dependencies are loaded first (but not executed) when `require.ensure` is executed, then when loading complete the callback is executed
    - The split chunk can be named by the optional 3rd parameter (if existing then same instance is used).  This is the only approach that allows that
    - Everything `require`'d in the callback is also put in same other chunk
- When using `import()`
    - The function loads the module and returns a `Promise`.  Allows load failure to be handled
    - Can load multiple modules in parallel via `Promise.all()`

---

## On-demand splitting (with `require.ensure()`, or `import()`)

```js
require.ensure(["module-a", "module-b"], function() {
  var a = require("module-a");
  ...
});
```
- `module-a` and `module-b` are loaded asynchronously (but not executed) then the callback function is called, within callback module-a is executed
- Not necessary to put modules in dependency array, but is recommended

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
- CSS requested in parallel and cached separate
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
new ExtractTextPlugin(options: string | object) // plugin
```

- `filename: string` (required) the filename of the result file. May contain `[name]`, `[id]` and `[contenthash]`
    - `[contenthash]`: a hash of the content of the extracted file
- `allChunks: boolean` extract from all additional chunks too (by default it extracts only from the initial chunk(s))
- `disable: boolean` disables the plugin
- `id: string` Unique ident for this plugin instance. (For advanced usage only, by default automatically generated)

---

## CSS splitting (with `ExtractTextPlugin`)

```js
ExtractTextPlugin.extract(options: string | object) // loader
```
- Creates an extracting loader from an existing loader. Supports loaders of type `{ loader: string; query: object }`
- `loader: string | object | loader[]` (required) the loader(s) to use for converting the resource to a css exporting module
- `fallbackLoader: string | object | loader[]` the loader(s) to use when the css is not extracted (i.e. in an additional chunk when `allChunks: false`)
- `publicPath: string` override the `publicPath` setting for this loader

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

## Exercise

(Duration: 15 minutes)

Modify exercise-5 for vendor code splitting with `CommonsChunkPlugin` (and compare sizes of the bundles before and after).

Also, use `require.ensure` to set an on-demand split point to load `bore-most.js` from a seperate chunk (hint: the `require.ensure` should be in `bore-more.js`) 


