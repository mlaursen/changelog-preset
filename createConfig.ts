import { Configuration } from "./types";

export * from "./defaultGetCommitType";
export * from "./defaultGetCommitScope";
export * from "./defaultCommitGroupsSort";

/**
 * This is used to add intellisense in the config file and is really just an
 * identity function.
 */
export function createConfig(config: Configuration): Configuration {
  return config;
}
