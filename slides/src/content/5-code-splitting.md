# Code-splitting

---

## Introduction

- Two main purposes for code-splitting in Webpack which results in two types of code-splitting
- Resource splitting (to improve Parallel loading and Caching)
  - Specify split points in configuration
  - Split JS code into different bundles (like application and vendor) to aid Caching
  - Portions of the code that don't change much (like vendor code) can be stored in seperate bundle and held in cache longer
  - For multi-page apps can split the JS into multiple bundles, each bundle to be loaded with the appropriate page
  - Split CSS from JS improving cacheability of the CSS and allowing it to be loaded in parallel with the JS
- On demand splitting
  - Specify split points in application logic to allow on-demand loading of bundles as needed (e.g. load a bundle when routing or on an another event)
  - Uses `require.ensure()` or `import()` to specify split-points
- Both splitting approaches allow splitting code into bundles to improve page load time (a bundle loaded quickly to allow some content to be shown sooner, and another bundle loaded later for less urgent functionality)
- Can use with `CommonsChunkPlugin` to reduce code-size (reduce redundancy and move it to single module), and/or `DllPlugin`/`DllReferencePlugin` for build-time performance (store/use cached built vendor/library bundles)

---

## `CommonsChunkPlugin`

- Allows extraction all the common modules from different bundles and add them to a common bundle. If a common bundle does not exist, then it creates a new one.
- Webpack creates runtime code, and when CommonsChunkPlugin is used this code is placed in the common bundle.  To improve cache behaviour, add another common bundle so this code is stored in a seperate bundle and doesn't cause the primary common bundle to change with every build

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
            })                               // the plugin is run once for each entry
        ]
    }
}
```

---

## `CommonsChunkPlugin`

- Use options (full list [here](https://webpack.js.org/plugins/commons-chunk-plugin/)) to tailor to use-case
- `minChunks` specifies how many modules must share a common chunk before that chunk is pulled into the common chunk (can be `number`, `Infinity`, or `(module, count) => boolean`). Set to `Infinity` to create a common chunk but prevent any other chunks added to it
- `chunks` the array of source chunks (if omitted all entry chunks are used)
- `minSize` specifies the minimum size that the combination of common modules must be before a common chunk is created to contain them