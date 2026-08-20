# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

- Update Babel toolchain to v8 and pin the preset-env `modules` option to `commonjs`
- Update dependencies to resolve known security advisories
- Ship `CHANGELOG.md` in the published package

## [2.0.3] - 2023-02-09

### Changed
- Bump transitive dependencies: `minimatch`, `minimist`, `path-parse`, `browserslist` and `lodash`

## [2.0.2] - 2020-08-12

### Changed
- Bump `lodash` from 4.17.15 to 4.17.19

## [2.0.1] - 2020-06-03

### Changed
- Update readme

## [2.0.0] - 2020-06-03

### Added
- `mods` parameter to set modifiers directly on the `bem()` call
- Modifier inheritance, so modifiers are passed down the chain to child elements
- `glue` option to customise the element (`__`), modifier (`--`) and key-value (`-`) separators
- `module` entry point exposing the untranspiled ES module source

### Changed
- **Breaking:** the signature is now `bem(classNames, mods, classNameMap, strict, glue)`, moving `classNameMap` and `strict` from the second and third positions
- Ship a transpiled CommonJS build in `dist` alongside the ES module source in `src`

### Removed
- Mocha test suite

## [1.1.4] - 2020-06-03

### Changed
- Final 1.x release, published for legacy use. The 1.x API is not compatible with 2.x

## [1.1.3] - 2020-06-03

### Fixed
- Replace `Array.prototype.flat` with a reducer to support Edge

### Changed
- Add a 2.x upgrade notice to the readme

## [1.1.2] - 2019-11-23

### Fixed
- Correct the `main` path in package.json

## [1.1.1] - 2019-11-23

### Added
- LICENSE file

### Changed
- New Babel dependencies and build script
- Move the source to `src/better-bem.js`

## [1.1.0] - 2019-11-21

### Changed
- Drop the build step and publish `index.js` directly

## [1.0.3] - 2019-11-12

### Fixed
- Make sure outputted classnames are unique

## [1.0.2] - 2019-11-05

### Changed
- Add package-lock.json back to the repository

## [1.0.1] - 2019-11-05

### Fixed
- Typos in the readme

## [1.0.0] - 2019-09-12

### Added
- First stable release of the chainable BEM classname generator with CSS Modules classname map support
- Prop-value modifiers (`--{prop}-{value}`)
- Basic usage documentation
