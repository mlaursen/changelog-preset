import { Commit } from "conventional-commits-parser";

export function defaultGetCommitType({ type, scope, revert }: Commit): string {
  if (type === "revert" || revert) {
    return "Reverts";
  }

  switch (scope) {
    case "feat":
      return "Features";
    case "fix":
      return "Bug Fixes";
    case "perf":
      return "Performance Improvements";
    case "docs":
      return "Documentation";
    default:
      return "Other Internal Changes";
  }
}
