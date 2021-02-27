/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

import { createTokenizer, identity } from "./createTokenizer";
import { defaultCommitGroupsSort } from "./defaultCommitGroupsSort";
import { defaultGetCommitScope } from "./defaultGetCommitScope";
import { defaultGetCommitType } from "./defaultGetCommitType";
import { Configuration } from "./types";

export type RequiredConfiguration = Omit<Required<Configuration>, "tokens">;

const DEBUG = process.argv.includes("--debug");

export function getConfig(): RequiredConfiguration {
  try {
    const root = execSync("git rev-parse --show-toplevel").toString().trim();
    const configPath = join(root, "changelog.config.js");

    if (existsSync(configPath)) {
      const config = require(configPath);
      const { tokens } = config;
      let {
        tokenizer,
        ignoreDeps,
        getCommitType,
        getCommitScope,
        commitGroupsSort,
      } = config;

      if (DEBUG) {
        console.debug(`Found config:\n${JSON.stringify(config, null, 2)}`);
      }

      if (Array.isArray(tokens) && typeof tokenizer !== "function") {
        if (DEBUG) {
          console.debug(
            "Creating a tokenizer with the following tokens:",
            tokens
          );
        }

        tokenizer = createTokenizer(tokens);
      } else if (typeof tokenizer !== "function") {
        if (DEBUG) {
          console.debug("No tokenizer or tokens found.");
        }

        tokenizer = identity;
      }

      if (typeof ignoreDeps !== "boolean") {
        if (DEBUG) {
          console.debug("Defaulting to ignoring dependency changes");
        }

        ignoreDeps = true;
      }

      if (typeof getCommitType !== "function") {
        if (DEBUG) {
          console.debug("No `getCommitType` function found");
        }

        getCommitType = defaultGetCommitType;
      }

      if (typeof getCommitScope !== "function") {
        if (DEBUG) {
          console.debug("No `getCommitScope` function found");
        }

        getCommitScope = defaultGetCommitScope;
      }

      if (typeof commitGroupsSort !== "function") {
        if (DEBUG) {
          console.debug("No `commitGroupsSort` function found");
        }

        commitGroupsSort = defaultCommitGroupsSort;
      }

      return {
        tokenizer,
        ignoreDeps,
        getCommitType,
        getCommitScope,
        commitGroupsSort,
      };
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  if (DEBUG) {
    console.debug("Using the default configuration");
  }

  return {
    tokenizer: identity,
    ignoreDeps: true,
    getCommitType: defaultGetCommitType,
    getCommitScope: defaultGetCommitScope,
    commitGroupsSort: defaultCommitGroupsSort,
  };
}
