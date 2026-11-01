// The only place that reads secrets from environment variables. The base URL stays in playwright.config.ts.
// A function, not a constant: .env is loaded by playwright.config.ts after imports are evaluated.

/** Your own Toolshop user: registered once (Postman or `npm run user:create`), kept in .env, never given a default. */
export function credentials(): { email: string; password: string } {
  const { TOOLSHOP_EMAIL: email, TOOLSHOP_PASSWORD: password } = process.env;
  if (!email || !password) {
    throw new Error('TOOLSHOP_EMAIL / TOOLSHOP_PASSWORD are not set: copy .env.example to .env, or run `npm run user:create`');
  }
  return { email, password };
}
