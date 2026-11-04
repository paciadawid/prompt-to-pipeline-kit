import type { APIResponse } from '@playwright/test';

export type Reply = { status: number; body: unknown };

// An empty or non-JSON body (a 204, an HTML page) must not throw: the body is then undefined or the raw text.
export async function reply(res: APIResponse): Promise<Reply> {
  const text = await res.text();
  if (text === '') return { status: res.status(), body: undefined };
  try {
    return { status: res.status(), body: JSON.parse(text) };
  } catch {
    return { status: res.status(), body: text };
  }
}
