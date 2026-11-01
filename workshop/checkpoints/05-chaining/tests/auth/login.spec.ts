import { test, expect } from '../../src/fixtures';

/** Compared as true/false: a failure then does not print your e-mail into the report. */
const sameEmail = (a: string | undefined, b: string) => a?.toLowerCase() === b.toLowerCase();

test.describe('auth', () => {
  // AUTH-01. The shopper fixture logs in and stops with a "precondition" error if it cannot.
  // The test itself checks what the token gives you.
  test('a shopper who logs in is identified by the token on /users/me', async ({ shopper, account }) => {
    const me = await shopper.users.me();
    expect(me.status, '/users/me accepts the fresh token').toBe(200);
    // Expected value comes from our input, not from the reply.
    expect(sameEmail(me.body.email, account.email), '/users/me returns the user who logged in').toBe(true);
  });

  // AUTH-02.
  test('login is refused for an e-mail that does not exist, while the real account logs in', async ({ guest, account }) => {
    // Never send a wrong password for the REAL account: a few failures lock it (HTTP 423) and nothing unlocks it.
    const refused = await guest.users.login(`nobody-${Date.now()}@example.invalid`, account.password);
    expect(refused.status, 'login with an unknown e-mail is refused').toBe(401);
    // Undocumented shape: login errors use "error", the rest of the API uses "message".
    expect(refused.body, 'the refusal says why, without a token').toEqual({ error: 'Unauthorized' });

    // Positive control: same call, real account.
    const right = await guest.users.login(account.email, account.password);
    expect(right.status, 'the real account logs in with the same password').toBe(200);
    await guest.users.withToken(right.body.access_token).logout();
  });

  test('after logout the same token no longer opens /users/me', async ({ guest, account }) => {
    const login = await guest.users.login(account.email, account.password);
    const client = guest.users.withToken(login.body.access_token);
    expect((await client.me()).status, 'precondition: the token works before logout').toBe(200);

    const logout = await client.logout();
    expect(logout.status, 'logout succeeds').toBe(200);
    expect(logout.body.message, 'logout confirms it').toBe('Successfully logged out');

    expect((await client.me()).status, 'the logged-out token is rejected').toBe(401);
  });

  test('refreshing issues a working token and revokes the old one', async ({ guest, account }) => {
    const login = await guest.users.login(account.email, account.password);
    const oldClient = guest.users.withToken(login.body.access_token);
    expect((await oldClient.me()).status, 'precondition: the original token works').toBe(200);

    const refreshed = await oldClient.refresh();
    expect(refreshed.status, 'refresh succeeds with a valid token').toBe(200);
    expect(refreshed.body.access_token, 'refresh returns a different token').not.toBe(login.body.access_token);

    const newClient = guest.users.withToken(refreshed.body.access_token);
    const me = await newClient.me();
    expect(me.status, 'the new token works').toBe(200);
    expect(sameEmail(me.body.email, account.email), 'the new token belongs to the same user').toBe(true);
    expect((await oldClient.me()).status, 'the old token is revoked by the refresh').toBe(401);

    await newClient.logout();
  });
});
