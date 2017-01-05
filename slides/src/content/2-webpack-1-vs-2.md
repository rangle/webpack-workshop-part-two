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

---

## Property name/structure changes

### resolve.*:  
- new enforceExtension property that when true requires imports to include file extension (defaults to false)
- resolve.root, resolve.fallback, resolve.modulesDirectories are combined into resolve.modules

