import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: configService.getOrThrow<string>('REDIS_URL'),
          socket: {
            tls: true,
            servername: configService.getOrThrow<string>('REDIS_HOST') || 'localhost',
          }
        });

        client.on('ready', () => {
          console.log('Redis client connected successfully');
        });

        client.on('error', (err) => {
          console.log(`Redis client connection error: ${err}`);
        });
        
        await client.connect();

        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
@Global()
export class RedisModule {}
