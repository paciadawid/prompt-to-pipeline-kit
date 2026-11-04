import type { APIResponse } from '@playwright/test';

export type Reply = { status: number; body: unknown };

// An empty body (204) becomes null; a body that is not JSON (an HTML error page) comes back as its text.
export async function reply(res: APIResponse): Promise<Reply> {
  const text = await res.text();
  if (text === '') return { status: res.status(), body: null };
  try {
    return { status: res.status(), body: JSON.parse(text) };
  } catch {
    return { status: res.status(), body: text };
  }
}
