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

```js
// in file if style-loader and css-loader configured in webpack.config.js
import css from 'file.css'; 
// or if not
import css from 'style-loader!css-loader!./file.css';
```

#### `style-loader`:
- Adds CSS to the DOM by injecting a `<style>` tag into `window.document`
- Typically chained with `css-loader`, though can be chained with `raw-loader` if CSS doesn't use `@import`, `url`, or scoping with `:local`, or `:global`

```js
```

#### `postcss-loader`:

#### `babel-loader`:
#### `awesome-typescript-loader`:
#### `istanbul-instrumenter-loader`:



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
require("expose-loader?libraryName!./file.js"); // file.js exports exposed to global context (window.libraryName in browser)
```

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

#### `HtmlWebpackPlugin`

#### `UglifyJsPlugin`

#### `StyleLintPlugin`

#### `NoErrorsPlugin`
#### `CopyWebpackPlugin`
#### `SourceMapDevToolPlugin`
#### `ProvidePlugin`
#### `CompressionPlugin`




