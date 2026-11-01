import { test, expect } from '../../src/fixtures';

test.describe('auth', () => {
  // AUTH-01. The shopper fixture logs in and stops with a "precondition" error if it cannot.
  // The test itself checks what the token gives you.
  test('a shopper who logs in is identified by the token on /users/me', async ({ shopper, account }) => {
    const me = await shopper.users.me();
    expect(me.status, '/users/me accepts the fresh token').toBe(200);
    // Expected value comes from our input, not from the reply.
    // Compared as true/false: a failure then does not print your e-mail into the report.
    expect(me.body.email?.toLowerCase() === account.email.toLowerCase(), '/users/me returns the user who logged in').toBe(true);
  });
});
