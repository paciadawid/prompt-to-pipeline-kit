import type { APIRequestContext } from '@playwright/test';
import { reply, type Reply } from './reply';

export class UsersApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  // A copy of this client that sends the token on the protected endpoints.
  withToken(token: string): UsersApi {
    return new UsersApi(this.request, token);
  }

  async login(email: string, password: string): Promise<Reply> {
    return reply(await this.request.post('/users/login', { data: { email, password } }));
  }

  async me(): Promise<Reply> {
    return reply(await this.request.get('/users/me', { headers: this.auth() }));
  }

  async logout(): Promise<Reply> {
    return reply(await this.request.get('/users/logout', { headers: this.auth() }));
  }

  private auth(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}
