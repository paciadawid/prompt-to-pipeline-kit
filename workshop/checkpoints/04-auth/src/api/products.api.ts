import { Api, reply } from './reply';
import type { Page, Product } from '../domain/types';

export class ProductsApi extends Api {
  search(q: string) {
    return this.http.get('/products/search', { params: { q } }).then((r) => reply<Page<Product>>(r));
  }
}
