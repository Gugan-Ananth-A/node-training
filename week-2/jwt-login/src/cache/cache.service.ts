import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setKey(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async getKey(key: string): Promise<string | undefined> {
    return await this.cacheManager.get(key);
  }
}
