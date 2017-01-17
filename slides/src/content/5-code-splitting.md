# Code-splitting

---

## Introduction

- Two main purposes for code-splitting in Webpack which results in two types of code-splitting
- Resource splitting (to improve Parallel loading and Caching)
  - Specify split points in configuration
  - Split JS code into different chunks (like application and vendor) to aid Caching
  - Portions of the code that don't change much (like vendor code) can be stored in seperate chunk and held in cache longer
  - For multi-page apps can split the JS into multiple chunks, each chunk to be loaded with the appropriate page
  - Split CSS from JS improving cacheability of the CSS and allowing it to be loaded in parallel with the JS
- On demand splitting
  - Specify split points in application logic to allow on-demand loading of assets as needed (e.g. load a module when routing or on an another event)
  - Uses `require.ensure()` or `import()` to specify split-points
- Both splitting approaches allow splitting code into chunks to improve page load time (a chunk loaded quickly to allow some content to be shown sooner, and another chunk loaded later for less urgent functionality)
- Can use with `CommonsChunkPlugin` to reduce code-size (reduce redundancy and move it to single module), and/or `DllPlugin`/`DllReferencePlugin` for build-time performance (store/use cached built vendor/library chunks)

---

## 