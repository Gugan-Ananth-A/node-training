import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post()
  async setCacheKey(@Query('key') key: string, @Query('value') value: string) {
    await this.cacheService.setKey(key, value);
    return {
      success: true,
      status: 201,
      message: 'Key Cached successfully',
    };
  }

  @Get('/get/:key')
  async getCacheKey(@Param('key') key: string) {
    const data = await this.cacheService.getKey(key);
    return {
      success: true,
      status: 200,
      data,
    };
  }
}
