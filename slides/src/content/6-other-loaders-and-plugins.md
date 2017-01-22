# Other loaders and plugins

---

## Some other popular loaders

#### `raw-loader`:
- Allows importing a file to JS `string` by wrapping file content in `"module.exports = " + JSON.stringify(content);`
- Typically used to feed HTML/CSS/TXT files into JS for processing by other loaders

```js
import txt from 'raw-loader!./file.txt'; // txt is a string
```

#### `to-string-loader`:
- Similar to `raw-loader` except it passes input content through `require` and converts the resulting exports object to a `string` (if it isn't already, via `toString()`)
- Typically used after `css-loader` to convert it's output `Array` to string

```js
// Returns CSS as a string (after converting css-loader output exports to a string)
let output = require('to-string-loader!css-loader!./my.css');
```

---

#### `css-loader`:
- Processes CSS files, converting `@import` and `url()` to `require` and loading dependencies through appropriate other loaders
- Optionally performs CSS minification and creates CSS SourceMap  
- Can inject output into DOM via `style-loader` or into `string` (to be further handled by another loader) via `to-string-loader` or `raw-loader`
- Allows for local scoping with `:local` and `:global` (or by default through config option), see [here](https://github.com/webpack/css-loader) for more details
- Use `importLoaders=x` option if any loaders occurring before `css-loader` in chain

```js
// in file if style-loader and css-loader configured in webpack.config.js
import css from 'file.css'; 
// or if not
import css from 'style-loader!css-loader!./file.css';
```

---

#### `style-loader`:
- Adds CSS to the DOM by injecting `<style>` tags into `window.document` (Can control with reference counting API with `style-loader/useable`)
- Typically chained with `css-loader`, though can be chained with `raw-loader` (if CSS doesn't use `@import`, `url`, or scoping with `:local`, or `:global`)
- Can place as CSS string or url (using `style-loader/url`)
- Exports generated class names for local scope CSS (when used with `css-loader`)
- Can configure single or multiple `<style>` tags with `singleton` option
- Can add `<style>` elements at bottom (default) or top of `<head>` with `insertAt` option (see all options [here](https://github.com/webpack/style-loader))

```js
var style = require("style-loader!css-loader!./file.css");
style.localClassName === "z849f98ca812bc0d099a43e0f90184"

require("style-loader/url!file-loader!./file.css"); // Add a <link rel="stylesheet"> to file.css in document

var style = require("style-loader/useable!css-loader!./file.css");
style.use(); // or style.ref(); if equal number of calls to use/unuse then <style> is not added to corresponding document
style.unuse(); // or style.unref();
```

---

#### `postcss-loader`:
- Use postcss plugins to process CSS, chain after `css-loader` (first loader in CSS file loader chain)
- Can configure postcss plugins directly in `webpack.config.js` but recommended to place in `postcss.config.js`
- Set `importLoaders=1` option if used before `css-loader` in chain (or >1 if other loaders before also)

```js
// postcss.config.js
module.exports = { 
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ })
  ]
}
// webpack.config.js
module.exports = { 
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader?importLoaders=1', 'postcss-loader']
      }
    ]
  }
}
```

---

#### `file-loader`:
- Emits file to output folder and returns url to publicPath (file emit can be disabled for server-side packages)
- Can use special placeholders like `[ext]` (extension), `[name]` (basename), `[hash]` (hash of content, md5 by default), etc.. (see full list [here](https://github.com/webpack/file-loader))

```js
var url = require("file-loader!./file.png");
// emits file.png as file in the output directory and returns the public url
var url = require("file-loader?emitFile=false!./file.png");
// returns the public url but does NOT emit a file
require("file-loader?name=js/[hash].script.[ext]!./javascript.js");
// emits javascript.js as js/0dcbbaa701328a3c262cfd45869e351f.script.js
```

#### `url-loader`:
- Works like `file-loader`, but can return a Data Url if the file is smaller than a limit, if larger uses `file-loader` and passes query params

```js
var url = require("url-loader?limit=10000!./file.png");
// DataUrl if "file.png" is smaller that 10kb, if no limit specified then all size returns as DataURL
var url = require("url-loader?mimetype=image/png!./file.png");
// Specify mimetype for the file (otherwise it's inferred from extension) 
var url = require("url-loader?prefix=img/!./file.png");
// Parameters for the file-loader are valid too, they are passed to the file-loader if used. 
```

---

#### `imports-loader`:
- Allows you to use modules that depend on specific global variables

```js
require("imports-loader?$=jquery!./example.js"); 
// prepends var $ = require("jquery"); to example.js
require("imports-loader?$=jquery,angular,config=>{size:50}!./example.js");
// prepends var $ = require("jquery"); var angular = require("angular"); var config = {size:50};
require("imports-loader?this=>window!./example.js");
// wraps code in example.js in (function () { ... }).call(window);
```

#### `exports-loader`:
- Add exports to the source file

```js
require("exports-loader?file,parse=helpers.parse!./file.js");  
// adds: exports["file"] = file; exports["parse"] = helpers.parse; 
require("exports-loader?file!./file.js"); 
// adds following code the the file's source: module.exports = file; 
```

#### `expose-loader`:
- Exposes the exports of a module to the global context (`window` in the browser)

```js
require("expose-loader?libraryName!./file.js"); // exports exposed to global context (window.libraryName in browser)
```

---

#### `babel-loader`:
- Transpile ES6 to ES5 with Babel via `babel-loader`
- Typically use `.babelrc` file to set options but can also set options directly on loader


#### `awesome-typescript-loader`:
- Better performance alternative to `ts-loader` for transpiling Typescript files
- Can fork type-checker into a seperate process to speed up compilation (use `CheckerPlugin` formerly `ForCheckerPlugin`)

```js
const { CheckerPlugin } = require('awesome-typescript-loader')
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [ { test: /\.ts$/, use: 'awesome-typescript-loader' } ]
  },
  plugins: [ new CheckerPlugin() ]
};
```

#### `istanbul-instrumenter-loader`:
- Instrument JS files with `istanbul-lib-instrument` for subsequent code coverage reporting, works with Karma and `karma-webpack`
- Config done in `karma.conf.js`
- Requires creation of a test entry file that creates webpack contexts for all the source and test files (see details [here](https://github.com/deepsweet/istanbul-instrumenter-loader))

---

#### `angular2-router-loader`:
- Loader for Angular that enables string-based module loading with the Angular Router
- Chain with Typescript loader like `awesome-typescript-loader`
- In route config, use `loadChildren` with relative path to lazy-loaded Angular module. The string is delimited with a `#` where the right side of split is the angular module class name
- For sync module loading, add the `sync=true` as a query string, then the module will be included in bundle and not lazy-loaded

```js
rules: [
  {
    test: /\.ts$/,
    use: [ 'awesome-typescript-loader', 'angular2-router-loader' ]
  }
]

import { Routes } from '@angular/router';
 
export const routes: Routes = [
  { path: 'lazy', loadChildren './lazy.module#LazyModule' }
  { path: 'not-lazy', loadChildren './not.lazy.module#NotLazyModule?sync=true' }
];
```

---

#### `angular2-template-loader`:
- Loader for Angular that inlines your templates and stylesheets into angular components.
- Chain with Typescript loader like `awesome-typescript-loader`, also need to pass .html and .css files through another loader (like `raw-loader`) first
- Searches for `templateUrl` and `styleUrls` in Angular Component metadata and replaces with `require` statement
- Generated `require` statements will be handled by the given loader for .html and .css files

```js
module: {
  rules: [
    {
      test: /\.ts$/, 
      use: ['awesome-typescript-loader', 'angular2-template-loader'],
    },
    { 
      test: /\.(html|css)$/, 
      use: 'raw-loader'
    }
  ]
}
```

---

#### `@ngtools/webpack`:
- Use with AotPlugin to AoT compile Angular Typescript, use in place of another Typescript loader when doing AoT
- See list of all AotPlugin options [here](https://www.npmjs.com/package/@ngtools/webpack) 

```js
import {AotPlugin} from '@ngtools/webpack'
 
exports = { /* ... */
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: '@ngtools/webpack',
      }
    ]
  }, 
  plugins: [
    new AotPlugin({
      tsConfigPath: 'path/to/tsconfig.json',
      entryModule: 'path/to/app.module#AppModule'
    })
  ]
}
```

---

## Some other popular plugins

#### `LoaderOptionsPlugin`
- Exists to help move from webpack 1 to webpack 2
  - With webpack 2 the schema for a webpack.config.js became stricter
  - No longer open for extension by other loaders / plugins
  - Intention is that you pass options directly to loaders / plugins. i.e. options are not global / shared
  - Until a loader has been updated to depend upon options being passed directly to them, the loader-options-plugin exists to bridge the gap
  - Can configure global / shared loader options with this plugin and all loaders will receive these options
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

#### `HtmlWebpackPlugin`
- Simplifies creation of HTML files to serve your webpack bundles, see all options [here](https://github.com/ampedandwired/html-webpack-plugin)
- Can either let the plugin generate an HTML file, supply a template using lodash, underscore, or other templates, or use your own loader

```js
new HtmlWebpackPlugin({
  template: './src/index.html', // the template file to base the output file on, if no template will use default 
  // use filename option to set name of output html, default output file is {output.path}/index.html
  inject: 'body',  // can inject in head or body of template
  minify: false, // could minify, but better to use UglifyJsPlugin
  chunksSortMode: (chunk1, chunk2) => {  // functions to determine how bundles are sorted in HTML output
    const order = ['vendor', 'app'];
    const item1 = order.indexOf(chunk1.names[0]);
    const item2 = order.indexOf(chunk2.names[0]);

    if (item1 > item2) {
      return 1;
    } else if (item1 < item2) {
      return -1;
    }

    return 0;
  },
}),
```

---

#### `UglifyJsPlugin`
- Minimize JS with UglifyJs, see all options [here](https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)

```js
new webpack.optimize.UglifyJsPlugin([options])
```

#### `StyleLintPlugin`
- Better CSS linting than with `stylelint-loader` (since the loader doesn't follow @import)
- See all options [here](https://github.com/JaKXz/stylelint-webpack-plugin)

```js
var StyleLintPlugin = require('stylelint-webpack-plugin');
module.exports = {
  // ...
  plugins: [
    new StyleLintPlugin(options),
  ],
  // ...
}
```

---

#### `CopyWebpackPlugin`
- This plugin copies individual files or entire directories to the build directory.
- See all options [here](https://github.com/kevlened/copy-webpack-plugin)

```js
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
module.exports = {
  context: path.join(__dirname, 'app'),
  plugins: [
    new CopyWebpackPlugin([
      { from: 'from/file.txt' }, // {output}/file.txt
      { from: 'from/file.txt', to: 'to/file.txt' }, // {output}/to/file.txt
      { from: 'from/file.txt', to: 'to/directory' }, // {output}/to/directory/file.txt
      { from: 'from/directory' }, // Copy directory contents to {output}/
      { from: 'from/directory', to: 'to/directory' }, // Copy directory contents to {output}/to/directory/
      { from: 'from/directory/**/*', to: '/absolute/path' }, // Copy glob results to /absolute/path/
      { from: { glob:'from/directory/**/*', dot: true }, to: '/absolute/path' }, // Same as above (with dot files)
      { context: 'from/directory', from: '**/*', to: '/absolute/path' }, // Copy glob results, relative to context
    ], { ignore: [    
        '*.txt', // Doesn't copy any files with a txt extension
        '**/*', // Doesn't copy any file, even if they start with a dot
        { glob: '**/*', dot: false } // Doesn't copy any file, except if they start with a dot 
    ]})
  ]
};
```

---

#### `NoEmitOnErrorsPlugin`
- This plugin skips the emitting phase (and recording phase) for assets with compilation errors, it replaces deprecated `NoErrorsPlugin`
- There are no assets emitted that include errors. The emitted flag in the stats is false for all assets

```js
new webpack.NoEmitOnErrorsPlugin() // no options
```

#### `SourceMapDevToolPlugin`
- Can be used when more control over source map generation is desired than using `devtool` option (if this plugin is included can leave out `devtool` option)
- See all options [here](https://webpack.js.org/plugins/source-map-dev-tool-plugin/)

#### `ProvidePlugin`
- Automatically loads modules
- Whenever the identifier is encountered as free variable in a module, the module is loaded automatically and the identifier is filled with the exports of the loaded module

```js
new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' })
// In a module, $ and jQuery is automatically set to the exports of module "jquery"
$('#item'); // just works
jQuery('#item'); // just works
```




