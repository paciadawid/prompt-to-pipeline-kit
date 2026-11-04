import { test, expect } from '../../src/fixtures';

test('after login, /users/me returns the user I logged in as', async ({ shopper, account }) => {
  const { status, body } = await shopper.users.me();
  expect(status).toBe(200);
  const email = (body as { email?: string }).email;
  // Compared as a boolean so a failure never prints the e-mail.
  expect(email === account.email, 'me returns the e-mail I logged in with').toBe(true);
});
