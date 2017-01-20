# Other loaders and plugins

---

## Some other popular loaders

#### `raw-loader`:

#### `css-loader`:
#### `postcss-loader`:
#### `style-loader`:
#### `to-string-loader`:
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

```js
rules: [
  {
    test: /\.ts$/,
    use: [ 'awesome-typescript-loader', 'angular2-router-loader' ]
  }
]
```

---

#### `angular2-template-loader`:
- Loader for Angular that inlines your templates and stylesheets into angular components.
- Chain with Typescript loader like `awesome-typescript-loader`, also pass .html and .css files through another loader (like `raw-loader`) first

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




