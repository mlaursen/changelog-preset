import { Commit } from "conventional-commits-parser";

export function defaultGetCommitScope(commit: Commit): string {
  return commit.scope || "";
}
