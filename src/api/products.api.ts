import type { APIRequestContext } from '@playwright/test';
import { reply } from './reply';

export class ProductsApi {
  constructor(private readonly request: APIRequestContext) {}

  async search(q: string) {
    return reply(await this.request.get('/products/search', { params: { q } }));
  }
}
