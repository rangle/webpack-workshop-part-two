# Other loaders and plugins

---

## Some other popular loaders

- `file-loader`:
- `to-string-loader`:
- `css-loader`:
- `postcss-loader`:
- `style-loader`:
- `raw-loader`:
- `istanbul-instrumenter-loader`:
- `angular2-router-loader`:
- `angular2-template-loader`:
- `awesome-typescript-loader`:
- `@ngtools/webpack`:
- `babel-loader`:
- `react-hot-loader`:
- `url-loader`:
- `imports-loader`:
- `exports-loader`:

---

#### `expose-loader`:

- Exposes the exports of a module to the global context (`window` in the browser)

```js
require("expose?libraryName!./file.js"); // file.js exports exposed to global context (window.libraryName in browser)

module: {
  loaders: [
    { test: require.resolve("react"), loader: "expose?React" }
  ]
}

```

---

## Some other popular plugins

- ``



