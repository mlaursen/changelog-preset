# @mlaursen/changelog-preset

This is a custom standard-changelog preset that is based off of the [angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) that logs a bit more in the changelog.

The default behavior of this template will:

- convert each commit type of:
  - `feat` -> `Features`
  - `fix` -> `Bug Fixes`
  - `perf` -> `Performance Improvements`
  - `docs` -> `Documentation`
  - `revert` -> `Reverts` (or if commit message has `revert`)
  - everything else -> `Other Internal Changes`
- sort the commit types by:
  1. `Bug Fixes`
  2. `Features`
  3. `Documentation`
  4. `Reverts`
  5. `Performance Improvements`
  6. `Other Internal Changes`
  7. If none match, alpha-numeric sort by title.

## Examples

- this repo
  - [CHANGELOG.md](./CHANGELOG.md)
- [react-md](https://github.com/mlaursen/react-md)
  - https://github.com/mlaursen/react-md/tree/main/CHANGELOG.md
  - https://github.com/mlaursen/react-md/tree/main/changelog.config.js
- [@mlaursen/eslint-config](https://github.com/mlaursen/eslint-config)
  - https://github.com/mlaursen/eslint-config/tree/main/CHANGELOG.md
  - https://github.com/mlaursen/eslint-config/tree/main/changelog.config.js

## Configuration

The behavior can be configured by creating a `changelog.config.js` at the root of your git repo.

Check out the [configuration interface](./types.ts) for documentation about how the config works.

## Simple Configuration Example

```js
const {
  createConfig,
  defaultCommitGroupsSort,
  defaultGetCommitType,
  defaultGetCommitScope,
} = require("@mlaursen/changelog-preset/createConfig");

// the `createConfig` is just used to add intellisense for the config
module.exports = createConfig({
  // these are _basically_ the defaults
  // tokens: [],
  // tokenizer: (subject) => subject,
  // ignoreDeps: true,
  // getCommitType: defaultGetCommitType,
  // getCommitScope: defaultGetCommitScope,
  // commitGroupsSort: defaultCommitGroupsSort,
});
```
