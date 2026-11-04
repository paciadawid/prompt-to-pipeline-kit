import { test, expect } from '../../src/fixtures';

test('after login, GET /users/me identifies the user who logged in', async ({ shopper, account }) => {
  const { status, body } = await shopper.users.me();
  expect(status, 'GET /users/me with the fresh token').toBe(200);

  const email = (body as { email?: unknown } | null)?.email;
  // Compared as true/false so a failure does not print the e-mail.
  expect(email === account.email, 'the e-mail returned by /users/me is the e-mail we logged in with').toBe(true);
});
