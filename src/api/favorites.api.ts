import type { APIRequestContext } from '@playwright/test';
import { reply, type Reply } from './reply';

export class FavoritesApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
    // Called with the id of every favorite the server created, so a fixture can remove it later.
    private readonly onAdded?: (id: string) => void,
  ) {}

  async list(): Promise<Reply> {
    return reply(await this.request.get('/favorites', { headers: this.auth() }));
  }

  async add(productId: string): Promise<Reply> {
    const res = await reply(await this.request.post('/favorites', { headers: this.auth(), data: { product_id: productId } }));
    const id = (res.body as { id?: string | number } | null)?.id;
    if (id !== undefined && id !== null) this.onAdded?.(String(id));
    return res;
  }

  async get(id: string): Promise<Reply> {
    return reply(await this.request.get(`/favorites/${id}`, { headers: this.auth() }));
  }

  async remove(id: string): Promise<Reply> {
    return reply(await this.request.delete(`/favorites/${id}`, { headers: this.auth() }));
  }

  private auth(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}
