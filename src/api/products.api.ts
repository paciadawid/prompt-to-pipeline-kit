import type { APIRequestContext } from '@playwright/test';
import { reply, type Reply } from './reply';

export class ProductsApi {
  constructor(private readonly request: APIRequestContext) {}

  async search(q: string): Promise<Reply> {
    return reply(await this.request.get('/products/search', { params: { q } }));
  }
}
