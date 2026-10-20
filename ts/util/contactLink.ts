/**
 * Deeplink used to add a contact: `sessionmessenger://add#<accountId>`.
 *
 * It is opened by the landing page `https://<domain>/add/#<accountId>` (see session-link).
 * The OS hands the url to us differently depending on the platform:
 * - macOS: the `open-url` app event,
 * - Windows/Linux: as a command line argument (of the first instance, or of a `second-instance`).
 */
export const CONTACT_LINK_SCHEME = 'sessionmessenger';
const CONTACT_LINK_HOST = 'add';
const ACCOUNT_ID_REGEX = /^[0-9a-f]{66}$/i;

/**
 * Returns the account id carried in the fragment of a contact link, or null if the url is not a valid contact link.
 */
export function parseContactLink(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.protocol !== `${CONTACT_LINK_SCHEME}:` || parsed.hostname !== CONTACT_LINK_HOST) {
    return null;
  }

  let accountId: string;
  try {
    accountId = decodeURIComponent(parsed.hash.slice(1)).trim();
  } catch {
    return null;
  }

  return ACCOUNT_ID_REGEX.test(accountId) ? accountId : null;
}

/**
 * Finds the first valid contact link in a list of command line arguments.
 */
export function getContactLinkAccountIdFromArgv(argv: Array<string>): string | null {
  for (const arg of argv) {
    if (arg.toLowerCase().startsWith(`${CONTACT_LINK_SCHEME}:`)) {
      const accountId = parseContactLink(arg);
      if (accountId) {
        return accountId;
      }
    }
  }
  return null;
}
