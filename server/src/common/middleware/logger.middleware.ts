import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = new Date();
    const { method, url } = req;
    const userAgent = req.headers['user-agent'] || '';

    res.on('finish', () => {
      const duration = Date.now() - startTime.getTime();
      const { statusCode } = res;

      console.log(
        `${new Date().toLocaleString()}\t [REQUEST] - ${method} ${url} - ${userAgent}\t ${statusCode} +${duration}ms`,
      );
    });

    next();
  }
}
