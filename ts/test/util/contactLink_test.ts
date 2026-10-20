import { expect } from 'chai';

import { getContactLinkAccountIdFromArgv, parseContactLink } from '../../util/contactLink';

describe('contactLink', () => {
  const accountId = `05${'ab'.repeat(32)}`;

  describe('parseContactLink', () => {
    it('returns the account id of a valid link', () => {
      expect(parseContactLink(`sessionmessenger://add#${accountId}`)).to.equal(accountId);
    });

    it('rejects other schemes, hosts and invalid ids', () => {
      expect(parseContactLink(`https://add/#${accountId}`)).to.equal(null);
      expect(parseContactLink(`sessionmessenger://other#${accountId}`)).to.equal(null);
      expect(parseContactLink('sessionmessenger://add#05abc')).to.equal(null);
      expect(parseContactLink('sessionmessenger://add')).to.equal(null);
      expect(parseContactLink(`sessionmessenger://add#${accountId}zz`)).to.equal(null);
      expect(parseContactLink('not a url')).to.equal(null);
    });
  });

  describe('getContactLinkAccountIdFromArgv', () => {
    it('finds the link among the other arguments', () => {
      expect(
        getContactLinkAccountIdFromArgv(['/usr/bin/session', '--flag', `sessionmessenger://add#${accountId}`])
      ).to.equal(accountId);
    });

    it('returns null when there is no valid link', () => {
      expect(getContactLinkAccountIdFromArgv(['/usr/bin/session', '--flag'])).to.equal(null);
      expect(getContactLinkAccountIdFromArgv(['sessionmessenger://add#nope'])).to.equal(null);
    });
  });
});
