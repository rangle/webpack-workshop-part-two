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
- To enable long-term caching, add another common chunk so this code is stored in a seperate chunk and doesn't cause the primary common chunk to change with every build

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
- Use options (full list [here](https://webpack.js.org/plugins/commons-chunk-plugin/)) to tailor to use-case
- `name` or `names` specify the name(s) of common chunk(s)
    - If they match an existing chunk(s), then that/those chunk(s) will be used as the common chunk(s) (multiple `names` result in multiple runs of the plugin)
    - If the `name` doesn't match an existing chunk then a new chunk will be created with matching name(s)
    - If omitted and `children` or `async` is set then all chunks are used, otherwise the `filename` is used as the common chunk name
- `filename` specifies the filename to use for the common bundle(s)
    - If omitted then the original output.filename or output.chunkFilename is used
    - Can contain the same placeholders as output.filename
- `minChunks` specifies how many modules must share a common chunk before that chunk is pulled into the common chunk (can be `number`, `Infinity`, or `(module, count) => boolean`). Set to `Infinity` to create a common chunk but prevent any other chunks added to it
- `minSize` specifies the minimum size that the combination of common modules must be before a common chunk is created to contain them
- `chunks` the array of source chunks (if omitted all entry chunks are used)
- `children` if set to `true` then all children of the common chunk are also sources (common modules moved up to parent common chunk)
- `async` if set to `true` then a seperate chunk is created as a child of the common chunk, this async chunk will contain all the common modules and will be loaded in parallel, set to a `string` to name that async chunk

---

## On-demand splitting (with `require.ensure()` AMD `require()` or `import()`)

- Webpack parses for `require.ensure()`, the AMD `require()`, or ES6 `import()` in the code while building and adds the modules into a separate chunk
- This new chunk is loaded on demand by webpack through Jsonp (when `target` is `web`).

```js
require.ensure(dependencies: String[], callback: function(require), chunkName: String) // Standard Webpack v1 approach
require(dependencies: String[], callback: function(depedency-exports))                 // AMD async require approach
import(dependency : String) : Promise                                                  // ES6 async import approach
```

- When using `require.ensure()` 
    - The dependencies are loaded first (but not executed), then the callback is executed
    - Callback is passed implementation of `require` to allow tracking synchronous dependencies in callback
    - The dependencies and any others inside the callback are all added to a different chunk
    - The different chunk can be named by the optional 3rd parameter (if existing then same instance is used)
- When using `require()` (AMD)
    - The dependencies are loaded and executed and their exports are passed to the callback

---

## CSS splitting

- When using `css-loader` to bundle CSS with the JS the disadvantage is that CSS can't be loaded async and in parallel, no styling until the full bundle is loaded
- Instead could use `ExtractTextPlugin` to extract the CSS into a seperate bundle to be injected into the index.html and loaded in parallel

---

## `DllPlugin` and `DllReferencePlugin`

- Provides another approach to code-splitting where 

