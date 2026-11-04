import type { APIRequestContext } from '@playwright/test';
import { reply } from './reply';

export class FavoritesApi {
  // onAdded is told the id of every favorite the server hands back, so a fixture can remove exactly those later.
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
    private readonly onAdded?: (id: string) => void,
  ) {}

  async list() {
    return reply(await this.request.get('/favorites', { headers: this.auth() }));
  }

  async add(productId: string) {
    const result = await reply(await this.request.post('/favorites', { data: { product_id: productId }, headers: this.auth() }));
    const id = (result.body as { id?: unknown } | undefined)?.id;
    if (typeof id === 'string') this.onAdded?.(id);
    return result;
  }

  async get(id: string) {
    return reply(await this.request.get(`/favorites/${id}`, { headers: this.auth() }));
  }

  async remove(id: string) {
    return reply(await this.request.delete(`/favorites/${id}`, { headers: this.auth() }));
  }

  private auth() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : undefined;
  }
}
