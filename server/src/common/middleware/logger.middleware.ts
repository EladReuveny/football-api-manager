import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Logger middleware
 * This middleware logs every incoming request with information about the request, response and execution time.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * Use the middleware
   * @param req The express request object
   * @param res The express response object
   * @param next The next function to be called in the middleware chain
   */
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
