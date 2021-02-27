import { readFileSync } from "fs";
import { resolve } from "path";
import {
  ParserOptions,
  WriterOptions,
  Options,
} from "conventional-changelog-core";

import { getConfig } from "./getConfig";

const {
  tokenizer,
  ignoreDeps,
  getCommitType,
  getCommitScope,
  commitGroupsSort,
} = getConfig();

const parserOpts: ParserOptions = {
  headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
  headerCorrespondence: ["type", "scope", "subject"],
  noteKeywords: ["BREAKING CHANGE"],
  revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: ["header", "hash"],
};

const writerOpts: WriterOptions = {
  transform: (commit, context) => {
    // don't want to show the release tag in changelog
    if (commit.scope === "release") {
      return false;
    }

    const issues: string[] = [];
    let isBreaking = false;
    commit.notes.forEach((note) => {
      isBreaking = false;
      note.title = "BREAKING CHANGES";
    });

    commit.type = getCommitType(commit);
    commit.scope = getCommitScope(commit);
    if (
      !isBreaking &&
      (!commit.type || (ignoreDeps && commit.scope.includes("deps")))
    ) {
      // don't include un-typed commits in changelogs or deps
      return false;
    }

    if (typeof commit.hash === "string") {
      commit.shortHash = commit.hash.substring(0, 7);
    }

    if (typeof commit.subject === "string") {
      let url = context.repository
        ? `${context.host}/${context.owner}/${context.repository}`
        : context.repoUrl;

      if (url) {
        url = `${url}/issues/`;
        commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
          issues.push(issue);
          return `[#${issue}](${url}${issue})`;
        });
      }

      commit.subject = tokenizer(commit.subject);
    }

    // remove references that already appear in the subject
    commit.references = commit.references.filter(
      (reference) => !issues.includes(reference.issue)
    );

    return commit;
  },
  groupBy: "type",
  commitGroupsSort,
  commitsSort: ["scope", "subject"],
  noteGroupsSort: "title",
  mainTemplate: readFileSync(
    resolve(__dirname, "./templates/template.hbs"),
    "utf-8"
  ),
  headerPartial: readFileSync(
    resolve(__dirname, "./templates/header.hbs"),
    "utf-8"
  ),
  commitPartial: readFileSync(
    resolve(__dirname, "./templates/commit.hbs"),
    "utf-8"
  ),
  footerPartial: readFileSync(
    resolve(__dirname, "./templates/footer.hbs"),
    "utf-8"
  ),
};

const options: Options.Config = {
  parserOpts,
  writerOpts,
  recommendedBumpOpts: {
    config: {
      parserOpts,
      writerOpts,
    },
    whatBump: (commits) => {
      let level = 2;
      let breaking = 0;
      let features = 0;
      commits.forEach((commit) => {
        if (commit.notes.length > 0) {
          breaking += commit.notes.length;
          level = 0;
        } else if (commit.type === "feat") {
          features += 1;
          if (level === 2) {
            level = 1;
          }
        }
      });

      const verb = breaking === 1 ? "is" : "are";
      return {
        level,
        reason: `There ${verb} ${breaking} BREAKING CHANGES and ${features} features`,
      };
    },
  },
};

module.exports = options;
