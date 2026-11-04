import { request, type FullConfig } from '@playwright/test';
import { UsersApi } from '../api/users.api';
import { credentials } from '../config/env';

// Runs once before all tests. Registers my user if it does not exist yet, so a login in a fixture can work.
// Registering instead of logging in is the existence check: a login with a wrong password counts toward the 423 lockout.
export default async function globalSetup(config: FullConfig) {
  const { baseURL, extraHTTPHeaders, userAgent } = config.projects[0].use;
  const context = await request.newContext({ baseURL, extraHTTPHeaders, userAgent });
  try {
    const { email, password } = credentials();
    const { status } = await new UsersApi(context).register({ first_name: 'Twz', last_name: 'Shopper', email, password });
    if (status === 201) console.log('global setup: the test user did not exist and was created');
    // 409 is the spec's answer for an e-mail that is already registered.
    else if (status !== 409) throw new Error(`precondition: registering the test user must answer 201 (created) or 409 (already exists), got ${status}.`);
  } finally {
    await context.dispose();
  }
}
