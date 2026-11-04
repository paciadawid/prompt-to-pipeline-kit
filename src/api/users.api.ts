import type { APIRequestContext } from '@playwright/test';
import { reply } from './reply';

export class UsersApi {
  constructor(private readonly request: APIRequestContext, private readonly token?: string) {}

  // A copy of this client that sends the token on protected endpoints.
  withToken(token: string) {
    return new UsersApi(this.request, token);
  }

  async register(user: { first_name: string; last_name: string; email: string; password: string }) {
    return reply(await this.request.post('/users/register', { data: user }));
  }

  async login(email: string, password: string) {
    return reply(await this.request.post('/users/login', { data: { email, password } }));
  }

  async me() {
    return reply(await this.request.get('/users/me', { headers: this.auth() }));
  }

  async logout() {
    return reply(await this.request.get('/users/logout', { headers: this.auth() }));
  }

  private auth() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : undefined;
  }
}
