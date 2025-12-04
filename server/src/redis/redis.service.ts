import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from 'redis';

/**
 * Service for interacting with Redis cache.
 */
export class RedisService {
  private defaultTtl: number;

  /**
   * Constructs a new instance of the RedisService.
   * @param {RedisClientType} redisClient - The Redis client to use.
   * @param {ConfigService} configService - The config service to use.
   */
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly configService: ConfigService,
  ) {
    this.defaultTtl = this.configService.get<number>('CACHE_TTL') || 60;
  }

  /**
   * Get a value from the Redis cache.
   * @param key The key of the value to get.
   * @returns The value associated with the key, or null if the key does not exist.
   * @template T The type of the value to get.
   */
  async get<T>(key: string) {
    const value = await this.redisClient.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  }

  /**
   * Set a value in the Redis cache.
   * @param key The key of the value to set.
   * @param value The value to set.
   * @param ttl The time to live of the value in seconds. If not provided, the default ttl of 60 seconds will be used.
   * @template T The type of the value to set.
   */
  async set<T>(key: string, value: T, ttl?: number) {
    await this.redisClient.set(key, JSON.stringify(value), {
      expiration: { type: 'EX', value: ttl || this.defaultTtl },
    });
  }

  /**
   * Deletes a key from the Redis cache.
   * @param key The key of the value to delete.
   */
  async del(key: string) {
    await this.redisClient.del(key);
  }

  /**
   * Invalidates all keys in the Redis cache that match the given pattern.
   * @param {string} pattern - The pattern to match keys against.
   */
  async invalidateByPattern(pattern: string) {
    const keys: string[] = await this.redisClient.keys(pattern);
    if (keys.length > 0) {
      await this.redisClient.del(keys);
    }
  }

  /**
   * Clears the Redis cache by deleting all keys.
   */
  async clearCache() {
    await this.redisClient.flushDb();
  }
}
