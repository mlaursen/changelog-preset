import { Commit } from "conventional-commits-parser";
import { Options, CommitGroup } from "conventional-changelog-writer";

export type CommitGroupsSort = Options.Sort<CommitGroup>;

export type Tokenizer = (subject: string) => string;

export interface Configuration {
  /**
   * An optional list of "tokens" that will be wrapped with inline code bocks
   * if they were missing.
   *
   * Example:
   *
   * ```ts
   * const tokens = ['react', 'react-dom', 'husky', 'lint-staged', 'SpecificName'];
   * ```
   *
   * @defaultValue []
   */
  tokens?: readonly string[];

  /**
   * An optional function that will "tokenize" or change the commit message
   * that's displayed in the CHANGELOG. The default behavior will wrap any
   * `tokens` found with inline code blocks "\`\`".
   *
   * Default Example:
   *
   * ```ts
   * conts tokens = ['createTokenizer'];
   * const subject = "Added a new createTokenizer util"
   *
   * tokenizer(subject); // "Added a new `createTokenizer` util"
   * ```
   */
  tokenizer?: Tokenizer;

  /**
   * Boolean if any commits that have a scope of `deps` or `dev-deps` should be
   * ignored.  This is mostly to help filter out dependabot updates, but can
   * also be set to `false` if the package is something like an eslint config
   * that showing dependency updates matters.
   *
   * When this is `"deps"` or `"dev-deps"`, only the other type will be allowed.
   *
   * @example
   * Using "dev-deps"
   * ```
   * commits:
   *
   * chore(dev-deps): updated eslint from v0.0.1 to v0.0.2
   * chore(deps): updated typescript from v0.0.1 to v0.0.2
   *
   *
   * Changelog would include:
   *
   * ### Dependencies
   *
   * - chore(deps): updated typescript from v0.0.1 to v0.0.2
   * ```
   *
   * @remarks \@since 1.1.0 added support for `"deps"` and `"dev-deps"`
   * @defaultValue `true`
   */
  ignoreDeps?: boolean | "deps" | "dev-deps";

  /**
   * An optional function to transform the commit type into something else.
   * This is normally used to take a shorthand commit type and create a
   * "prettier"/more verbose message to add to the changelog.
   *
   * The default behavior will convert:
   *
   * ```
   * - feat -> Features
   * - fix -> Bug Fixes
   * - perf -> Performance Improvements
   * - docs -> Documentation
   * - revert -> Reverts (or if commit message has revert)
   * - everything else -> Other Internal Changes
   * ```
   */
  getCommitType?(commit: Commit): string;

  /**
   * An optional function that will transform the scope into another scope. This
   * is useful if you want to rename some shorthand scopes to something else.
   *
   * Example:
   *
   * ```ts
   * const getCommitScope = ({ scope }) => {
   *   if (MLAURSEN_SCOPED_PACKAGES.test(scope)) {
   *     return `@mlaursen/${scope}`;
   *   }
   *
   *   return scope || "";
   * }
   * ```
   */
  getCommitScope?(commit: Commit): string;

  /**
   * An optional function that will sort the commit groups. The default
   * behavior wilL sort to:
   *
   * 1. `Bug Fixes`
   * 2. `Features`
   * 3. `Documentation`
   * 4. `Reverts`
   * 5. `Performance Improvements`
   * 6. `Other Internal Changes`
   * 7. If none match, alpha-numeric sort by title.
   */
  commitGroupsSort?: CommitGroupsSort;
}
