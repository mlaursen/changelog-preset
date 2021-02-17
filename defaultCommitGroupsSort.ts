import { CommitGroupsSort } from "./types";

/**
 * An ordered list of scopes used by the `getCommitType` function. This is how
 * the commits will be sorted in the CHANGELOG.md as well
 */
export const scopes: readonly string[] = [
  "Bug Fixes",
  "Features",
  "Documentation",
  "Reverts",
  "Performance Improvements",
  "Other Internal Changes",
];

/**
 * This is the default sort behavior for commits that will sort by the default
 * allowed `scopes` first, and then sort alpha-numerically for all other
 * scopes.
 */
export const defaultCommitGroupsSort: CommitGroupsSort = (commit1, commit2) => {
  const title1 = commit1.title;
  const title2 = commit2.title;
  if (!title1 && !title2) {
    return 0;
  }

  if (!title2) {
    return -1;
  }

  if (!title1) {
    return 1;
  }

  const commit1Index = scopes.indexOf(title1);
  const commit2Index = scopes.indexOf(title2);

  if (commit1Index !== -1 && commit2Index !== -1) {
    return commit1Index - commit2Index;
  }

  return title1.localeCompare(title2);
};
