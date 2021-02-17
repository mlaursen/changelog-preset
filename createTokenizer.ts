export const identity = <T>(thing: T): T => thing;

/**
 * the default behavior is to replace all "tokens" to be inline code blocks. If
 * there are no provided "tokens", no replacements occur.
 */
export function createTokenizer(tokens: readonly string[]) {
  if (!tokens.length) {
    return identity;
  }

  const TOKEN_REGEXP = new RegExp(
    `(?<=\\s|^)(${tokens.join("|")})(?=\\s|$)`,
    "g"
  );

  return function tokenizer(subject: string) {
    return subject.replace(TOKEN_REGEXP, "`$1`");
  };
}
