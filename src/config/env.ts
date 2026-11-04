// The only place that reads secrets. They come from environment variables (.env locally, repository secrets in CI), never from a default.
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill it in (CI: add a repository secret with that name).`);
  }
  return value;
}

export function credentials(): { email: string; password: string } {
  return { email: required('TOOLSHOP_EMAIL'), password: required('TOOLSHOP_PASSWORD') };
}
